// src/plugins/IdleMonitorPlugin.ts

import { Plugin, AudioDataWithUser } from '../types';
import { Space } from '../core/Space';

/**
 * Plugin that tracks the last speaker audio timestamp
 * and the last local audio timestamp to detect overall silence.
 */
export class IdleMonitorPlugin implements Plugin {
  private space?: Space;
  private lastSpeakerAudioMs = Date.now();
  private lastLocalAudioMs = Date.now();
  private checkInterval?: NodeJS.Timeout;

  /**
   * @param idleTimeoutMs How many ms of silence before triggering idle (default 60s)
   * @param checkEveryMs Interval for checking silence (default 10s)
   */
  constructor(
    private idleTimeoutMs: number = 60_000,
    private checkEveryMs: number = 10_000,
  ) {}

  onAttach(space: Space) {
    this.space = space;
    console.log('[IdleMonitorPlugin] onAttach => plugin attached');
  }

  init(params: { space: Space; pluginConfig?: Record<string, any> }): void {
    this.space = params.space;
    console.log('[IdleMonitorPlugin] init => setting up idle checks');

    // Update lastSpeakerAudioMs on incoming speaker audio
    this.space.on('audioDataFromSpeaker', (data: AudioDataWithUser) => {
      this.lastSpeakerAudioMs = Date.now();
    });

    // Patch space.pushAudio to update lastLocalAudioMs
    const originalPushAudio = this.space.pushAudio.bind(this.space);
    this.space.pushAudio = (samples, sampleRate) => {
      this.lastLocalAudioMs = Date.now();
      originalPushAudio(samples, sampleRate);
    };

    // Periodically check for silence
    this.checkInterval = setInterval(() => this.checkIdle(), this.checkEveryMs);
  }

  private checkIdle() {
    const now = Date.now();
    const lastAudio = Math.max(this.lastSpeakerAudioMs, this.lastLocalAudioMs);
    const idleMs = now - lastAudio;

    if (idleMs >= this.idleTimeoutMs) {
      console.log(
        '[IdleMonitorPlugin] idleTimeout => no audio for',
        idleMs,
        'ms',
      );
      this.space?.emit('idleTimeout', { idleMs });
    }
  }

  /**
   * Returns how many ms have passed since any audio was detected.
   */
  public getIdleTimeMs(): number {
    const now = Date.now();
    const lastAudio = Math.max(this.lastSpeakerAudioMs, this.lastLocalAudioMs);
    return now - lastAudio;
  }

  cleanup(): void {
    console.log('[IdleMonitorPlugin] cleanup => stopping idle checks');
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = undefined;
    }
  }
}
