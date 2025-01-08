// src/plugins/HlsRecordPlugin.ts

import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { Plugin, OccupancyUpdate } from '../types';
import { Space } from '../core/Space';
import { Logger } from '../logger';

/**
 * Plugin that records the final Twitter Spaces HLS mix to a local file.
 * It waits for at least one listener to join (occupancy > 0),
 * then repeatedly attempts to get the HLS URL from Twitter
 * until it is available (HTTP 200), and finally spawns ffmpeg.
 */
export class HlsRecordPlugin implements Plugin {
  private logger?: Logger;
  private recordingProcess?: ChildProcessWithoutNullStreams;
  private isRecording = false;
  private outputPath?: string;
  private mediaKey?: string;
  private space?: Space;

  constructor(outputPath?: string) {
    this.outputPath = outputPath;
  }

  /**
   * Called once the Space has fully initialized (broadcastInfo is ready).
   * We store references and subscribe to "occupancyUpdate".
   */
  async init(params: { space: Space; pluginConfig?: Record<string, any> }) {
    const spaceLogger = (params.space as any).logger as Logger | undefined;
    if (spaceLogger) {
      this.logger = spaceLogger;
    }

    if (params.pluginConfig?.outputPath) {
      this.outputPath = params.pluginConfig.outputPath;
    }

    this.space = params.space;

    const broadcastInfo = (params.space as any).broadcastInfo;
    if (!broadcastInfo || !broadcastInfo.broadcast?.media_key) {
      this.logger?.warn(
        '[HlsRecordPlugin] No media_key found in broadcastInfo',
      );
      return;
    }
    this.mediaKey = broadcastInfo.broadcast.media_key;

    const roomId = broadcastInfo.room_id || 'unknown_room';
    if (!this.outputPath) {
      this.outputPath = `/tmp/record_${roomId}.ts`;
    }

    // Subscribe to occupancyUpdate
    this.space.on('occupancyUpdate', (update: OccupancyUpdate) => {
      this.handleOccupancyUpdate(update).catch((err) => {
        this.logger?.error(
          '[HlsRecordPlugin] handleOccupancyUpdate error =>',
          err,
        );
      });
    });
  }

  /**
   * Called each time occupancyUpdate is emitted.
   * If occupancy > 0 and we're not recording yet, we attempt to fetch the HLS URL.
   * If the URL is valid (HTTP 200), we launch ffmpeg.
   */
  private async handleOccupancyUpdate(update: OccupancyUpdate) {
    if (!this.space || !this.mediaKey) return;
    if (this.isRecording) return;

    // We only care if occupancy > 0 (at least one listener).
    if (update.occupancy <= 0) {
      this.logger?.debug('[HlsRecordPlugin] occupancy=0 => ignoring');
      return;
    }

    const scraper = (this.space as any).scraper;
    if (!scraper) {
      this.logger?.warn('[HlsRecordPlugin] No scraper found on space');
      return;
    }

    this.logger?.debug(
      `[HlsRecordPlugin] occupancy=${update.occupancy} => trying to fetch HLS URL...`,
    );

    try {
      const status = await scraper.getAudioSpaceStreamStatus(this.mediaKey);
      if (!status?.source?.location) {
        this.logger?.debug(
          '[HlsRecordPlugin] occupancy>0 but no HLS URL => wait next update',
        );
        return;
      }

      const hlsUrl = status.source.location;
      const isReady = await this.waitForHlsReady(hlsUrl, 1);
      if (!isReady) {
        this.logger?.debug(
          '[HlsRecordPlugin] HLS URL 404 => waiting next occupancy update...',
        );
        return;
      }

      await this.startRecording(hlsUrl);
    } catch (err) {
      this.logger?.error('[HlsRecordPlugin] handleOccupancyUpdate =>', err);
    }
  }

  /**
   * Spawns ffmpeg to record the HLS stream at the given URL.
   */
  private async startRecording(hlsUrl: string): Promise<void> {
    if (this.isRecording) {
      this.logger?.debug('[HlsRecordPlugin] Already recording');
      return;
    }
    this.isRecording = true;

    if (!this.outputPath) {
      this.logger?.warn(
        '[HlsRecordPlugin] No output path set, using /tmp/space_record.ts',
      );
      this.outputPath = '/tmp/space_record.ts';
    }

    this.logger?.info('[HlsRecordPlugin] Starting HLS recording =>', hlsUrl);

    this.recordingProcess = spawn('ffmpeg', [
      '-y',
      '-i',
      hlsUrl,
      '-c',
      'copy',
      this.outputPath,
    ]);

    this.recordingProcess.stderr.on('data', (chunk) => {
      const msg = chunk.toString();
      if (msg.toLowerCase().includes('error')) {
        this.logger?.error('[HlsRecordPlugin][ffmpeg error] =>', msg.trim());
      } else {
        this.logger?.debug('[HlsRecordPlugin][ffmpeg]', msg.trim());
      }
    });

    this.recordingProcess.on('close', (code) => {
      this.isRecording = false;
      this.logger?.info(
        '[HlsRecordPlugin] Recording process closed => code=',
        code,
      );
    });

    this.recordingProcess.on('error', (err) => {
      this.logger?.error('[HlsRecordPlugin] Recording process failed =>', err);
    });
  }

  /**
   * HEAD request to see if the HLS URL is returning 200 OK.
   * maxRetries=1 means we'll just try once here, and rely on occupancyUpdate re-calls for further tries.
   */
  private async waitForHlsReady(
    hlsUrl: string,
    maxRetries: number,
  ): Promise<boolean> {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const resp = await fetch(hlsUrl, { method: 'HEAD' });
        if (resp.ok) {
          this.logger?.debug(
            `[HlsRecordPlugin] HLS is ready (attempt #${attempt + 1})`,
          );
          return true;
        } else {
          this.logger?.debug(
            `[HlsRecordPlugin] HLS status=${resp.status}, retrying...`,
          );
        }
      } catch (error) {
        this.logger?.debug(
          '[HlsRecordPlugin] HLS fetch error:',
          (error as Error).message,
        );
      }

      attempt++;
      await new Promise((r) => setTimeout(r, 2000));
    }
    return false;
  }

  /**
   * Called when the plugin is cleaned up (e.g. space.stop()).
   */
  cleanup(): void {
    if (this.isRecording && this.recordingProcess) {
      this.logger?.info('[HlsRecordPlugin] Stopping HLS recording...');
      this.recordingProcess.kill();
      this.recordingProcess = undefined;
      this.isRecording = false;
    }
  }
}
