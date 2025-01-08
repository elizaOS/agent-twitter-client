import wrtc from '@roamhq/wrtc';
import { EventEmitter } from 'events';
import { Logger } from '../logger';
const { nonstandard } = wrtc;
const { RTCAudioSource, RTCAudioSink } = nonstandard;

interface AudioSourceOptions {
  logger?: Logger;
}

interface AudioSinkOptions {
  logger?: Logger;
}

export class JanusAudioSource extends EventEmitter {
  private source: any;
  private readonly track: MediaStreamTrack;
  private logger?: Logger;

  constructor(options?: AudioSourceOptions) {
    super();
    this.logger = options?.logger;
    this.source = new RTCAudioSource();
    this.track = this.source.createTrack();
  }

  getTrack() {
    return this.track;
  }

  pushPcmData(samples: Int16Array, sampleRate: number, channels = 1) {
    if (this.logger?.isDebugEnabled()) {
      this.logger?.debug(
        `[JanusAudioSource] pushPcmData => sampleRate=${sampleRate}, channels=${channels}`,
      );
    }
    this.source.onData({
      samples,
      sampleRate,
      bitsPerSample: 16,
      channelCount: channels,
      numberOfFrames: samples.length / channels,
    });
  }
}

export class JanusAudioSink extends EventEmitter {
  private sink: any;
  private active = true;
  private logger?: Logger;

  constructor(track: MediaStreamTrack, options?: AudioSinkOptions) {
    super();
    this.logger = options?.logger;
    if (track.kind !== 'audio') {
      throw new Error('JanusAudioSink must be an audio track');
    }
    this.sink = new RTCAudioSink(track);

    this.sink.ondata = (frame: {
      samples: Int16Array;
      sampleRate: number;
      bitsPerSample: number;
      channelCount: number;
    }) => {
      if (!this.active) return;
      if (this.logger?.isDebugEnabled()) {
        this.logger?.debug(
          `[JanusAudioSink] ondata => sampleRate=${frame.sampleRate}, bitsPerSample=${frame.bitsPerSample}, channelCount=${frame.channelCount}`,
        );
      }
      this.emit('audioData', frame);
    };
  }

  stop() {
    this.active = false;
    if (this.logger?.isDebugEnabled()) {
      this.logger?.debug('[JanusAudioSink] stop');
    }
    this.sink?.stop();
  }
}
