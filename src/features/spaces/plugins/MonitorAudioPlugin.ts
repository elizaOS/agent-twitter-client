// src/plugins/MonitorAudioPlugin.ts

import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { Plugin, AudioDataWithUser } from '../types';

export class MonitorAudioPlugin implements Plugin {
  private ffplay?: ChildProcessWithoutNullStreams;

  constructor(private readonly sampleRate = 48000) {
    // spawn ffplay reading raw PCM s16le from stdin
    // "-nodisp" hides any video window, "-loglevel quiet" reduces console spam
    this.ffplay = spawn('ffplay', [
      '-f',
      's16le',
      '-ar',
      this.sampleRate.toString(), // e.g. "16000"
      '-ac',
      '1', // mono
      '-nodisp',
      '-loglevel',
      'quiet',
      '-i',
      'pipe:0',
    ]);

    this.ffplay.on('error', (err) => {
      console.error('[MonitorAudioPlugin] ffplay error =>', err);
    });
    this.ffplay.on('close', (code) => {
      console.log('[MonitorAudioPlugin] ffplay closed => code=', code);
      this.ffplay = undefined;
    });

    console.log('[MonitorAudioPlugin] Started ffplay for real-time monitoring');
  }

  onAudioData(data: AudioDataWithUser): void {
    // TODO: REMOVE DEBUG
    // console.log(
    //   '[MonitorAudioPlugin] onAudioData => user=',
    //   data.userId,
    //   'samples=',
    //   data.samples.length,
    //   'sampleRate=',
    //   data.sampleRate,
    // );

    // Check sampleRate if needed
    if (!this.ffplay?.stdin.writable) return;

    // Suppose data.sampleRate = this.sampleRate
    // Convert Int16Array => Buffer
    const buf = Buffer.from(data.samples.buffer);

    // Write raw 16-bit PCM samples to ffplay stdin
    this.ffplay.stdin.write(buf);
  }

  cleanup(): void {
    console.log('[MonitorAudioPlugin] Cleanup => stopping ffplay');
    if (this.ffplay) {
      this.ffplay.stdin.end(); // close the pipe
      this.ffplay.kill(); // kill ffplay process
      this.ffplay = undefined;
    }
  }
}
