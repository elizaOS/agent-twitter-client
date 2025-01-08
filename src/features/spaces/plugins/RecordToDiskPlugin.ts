import * as fs from 'fs';
import { AudioDataWithUser, Plugin } from '../types';

export class RecordToDiskPlugin implements Plugin {
  private outStream = fs.createWriteStream('/tmp/speaker_audio.raw');

  onAudioData(data: AudioDataWithUser): void {
    // Convert Int16Array -> Buffer
    const buf = Buffer.from(data.samples.buffer);
    this.outStream.write(buf);
  }

  cleanup(): void {
    this.outStream.end();
  }
}
