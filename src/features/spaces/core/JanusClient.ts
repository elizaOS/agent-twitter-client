import wrtc from '@roamhq/wrtc';
import { EventEmitter } from 'events';
import { Logger } from '../logger';
import type { AudioDataWithUser, TurnServersInfo } from '../types';
import { JanusAudioSink, JanusAudioSource } from './JanusAudio';
const { RTCPeerConnection, MediaStream } = wrtc;

interface JanusConfig {
  webrtcUrl: string;
  roomId: string;
  credential: string;
  userId: string;
  streamName: string;
  turnServers: TurnServersInfo;
  logger: Logger;
}

/**
 * This class is in charge of the Janus session, handle,
 * joining the videoroom, and polling events.
 */
export class JanusClient extends EventEmitter {
  private logger: Logger;

  private sessionId?: number;
  private handleId?: number;
  private publisherId?: number;
  private pc?: RTCPeerConnection;
  private localAudioSource?: JanusAudioSource;
  private pollActive = false;
  private eventWaiters: Array<{
    predicate: (evt: any) => boolean;
    resolve: (value: any) => void;
    reject: (error: Error) => void;
  }> = [];
  private subscribers = new Map<
    string,
    {
      handleId: number;
      pc: RTCPeerConnection;
    }
  >();

  constructor(private readonly config: JanusConfig) {
    super();
    this.logger = config.logger;
  }

  async initialize() {
    this.logger.debug('[JanusClient] initialize() called');

    this.sessionId = await this.createSession();
    this.handleId = await this.attachPlugin();
    this.pollActive = true;
    this.startPolling();
    await this.createRoom();
    this.publisherId = await this.joinRoom();

    this.pc = new RTCPeerConnection({
      iceServers: [
        {
          urls: this.config.turnServers.uris,
          username: this.config.turnServers.username,
          credential: this.config.turnServers.password,
        },
      ],
    });
    this.setupPeerEvents();

    this.enableLocalAudio();
    await this.configurePublisher();

    this.logger.info('[JanusClient] Initialization complete');
  }

  public async subscribeSpeaker(userId: string): Promise<void> {
    this.logger.debug('[JanusClient] subscribeSpeaker => userId=', userId);

    const subscriberHandleId = await this.attachPlugin();
    this.logger.debug('[JanusClient] subscriber handle =>', subscriberHandleId);

    const publishersEvt = await this.waitForJanusEvent(
      (e) =>
        e.janus === 'event' &&
        e.plugindata?.plugin === 'janus.plugin.videoroom' &&
        e.plugindata?.data?.videoroom === 'event' &&
        Array.isArray(e.plugindata?.data?.publishers) &&
        e.plugindata?.data?.publishers.length > 0,
      8000,
      'discover feed_id from "publishers"',
    );

    const list = publishersEvt.plugindata.data.publishers as any[];
    const pub = list.find(
      (p) => p.display === userId || p.periscope_user_id === userId,
    );
    if (!pub) {
      throw new Error(
        `[JanusClient] subscribeSpeaker => No publisher found for userId=${userId}`,
      );
    }
    const feedId = pub.id;
    this.logger.debug('[JanusClient] found feedId =>', feedId);
    this.emit('subscribedSpeaker', { userId, feedId });

    const joinBody = {
      request: 'join',
      room: this.config.roomId,
      periscope_user_id: this.config.userId,
      ptype: 'subscriber',
      streams: [
        {
          feed: feedId,
          mid: '0',
          send: true,
        },
      ],
    };
    await this.sendJanusMessage(subscriberHandleId, joinBody);

    const attachedEvt = await this.waitForJanusEvent(
      (e) =>
        e.janus === 'event' &&
        e.sender === subscriberHandleId &&
        e.plugindata?.plugin === 'janus.plugin.videoroom' &&
        e.plugindata?.data?.videoroom === 'attached' &&
        e.jsep?.type === 'offer',
      8000,
      'subscriber attached + offer',
    );
    this.logger.debug('[JanusClient] subscriber => "attached" with offer');

    const offer = attachedEvt.jsep;

    const subPc = new RTCPeerConnection({
      iceServers: [
        {
          urls: this.config.turnServers.uris,
          username: this.config.turnServers.username,
          credential: this.config.turnServers.password,
        },
      ],
    });

    subPc.ontrack = (evt) => {
      this.logger.debug(
        '[JanusClient] subscriber track => kind=%s, readyState=%s, muted=%s',
        evt.track.kind,
        evt.track.readyState,
        evt.track.muted,
      );

      const sink = new JanusAudioSink(evt.track, { logger: this.logger });
      sink.on('audioData', (frame) => {
        if (this.logger.isDebugEnabled()) {
          let maxVal = 0;
          for (let i = 0; i < frame.samples.length; i++) {
            const val = Math.abs(frame.samples[i]);
            if (val > maxVal) maxVal = val;
          }
          this.logger.debug(
            `[AudioSink] userId=${userId}, maxAmplitude=${maxVal}`,
          );
        }

        this.emit('audioDataFromSpeaker', {
          userId,
          bitsPerSample: frame.bitsPerSample,
          sampleRate: frame.sampleRate,
          numberOfFrames: frame.numberOfFrames,
          channelCount: frame.channelCount,
          samples: frame.samples,
        } as AudioDataWithUser);
      });
    };

    await subPc.setRemoteDescription(offer);
    const answer = await subPc.createAnswer();
    await subPc.setLocalDescription(answer);

    await this.sendJanusMessage(
      subscriberHandleId,
      {
        request: 'start',
        room: this.config.roomId,
        periscope_user_id: this.config.userId,
      },
      answer,
    );
    this.logger.debug('[JanusClient] subscriber => done (user=', userId, ')');
    this.subscribers.set(userId, { handleId: subscriberHandleId, pc: subPc });
  }

  pushLocalAudio(samples: Int16Array, sampleRate: number, channels = 1) {
    if (!this.localAudioSource) {
      this.logger.warn('[JanusClient] No localAudioSource; enabling now...');
      this.enableLocalAudio();
    }
    this.localAudioSource?.pushPcmData(samples, sampleRate, channels);
  }

  enableLocalAudio() {
    if (!this.pc) {
      this.logger.warn(
        '[JanusClient] enableLocalAudio => No RTCPeerConnection',
      );
      return;
    }
    if (this.localAudioSource) {
      this.logger.debug('[JanusClient] localAudioSource already active');
      return;
    }
    this.localAudioSource = new JanusAudioSource({ logger: this.logger });
    const track = this.localAudioSource.getTrack();
    const localStream = new MediaStream();
    localStream.addTrack(track);
    this.pc.addTrack(track, localStream);
  }

  async stop() {
    this.logger.info('[JanusClient] Stopping...');
    this.pollActive = false;
    if (this.pc) {
      this.pc.close();
      this.pc = undefined;
    }
  }

  getSessionId() {
    return this.sessionId;
  }

  getHandleId() {
    return this.handleId;
  }

  getPublisherId() {
    return this.publisherId;
  }

  private async createSession(): Promise<number> {
    const transaction = this.randomTid();
    const resp = await fetch(this.config.webrtcUrl, {
      method: 'POST',
      headers: {
        Authorization: this.config.credential,
        'Content-Type': 'application/json',
        Referer: 'https://x.com',
      },
      body: JSON.stringify({
        janus: 'create',
        transaction,
      }),
    });
    if (!resp.ok) {
      throw new Error('[JanusClient] createSession failed');
    }
    const json = await resp.json();
    if (json.janus !== 'success') {
      throw new Error('[JanusClient] createSession invalid response');
    }
    return json.data.id;
  }

  private async attachPlugin(): Promise<number> {
    if (!this.sessionId) {
      throw new Error('[JanusClient] attachPlugin => no sessionId');
    }
    const transaction = this.randomTid();
    const resp = await fetch(`${this.config.webrtcUrl}/${this.sessionId}`, {
      method: 'POST',
      headers: {
        Authorization: this.config.credential,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        janus: 'attach',
        plugin: 'janus.plugin.videoroom',
        transaction,
      }),
    });
    if (!resp.ok) {
      throw new Error('[JanusClient] attachPlugin failed');
    }
    const json = await resp.json();
    if (json.janus !== 'success') {
      throw new Error('[JanusClient] attachPlugin invalid response');
    }
    return json.data.id;
  }

  private async createRoom() {
    if (!this.sessionId || !this.handleId) {
      throw new Error('[JanusClient] createRoom => No session/handle');
    }
    const transaction = this.randomTid();
    const body = {
      request: 'create',
      room: this.config.roomId,
      periscope_user_id: this.config.userId,
      audiocodec: 'opus',
      videocodec: 'h264',
      transport_wide_cc_ext: true,
      app_component: 'audio-room',
      h264_profile: '42e01f',
      dummy_publisher: false,
    };
    const resp = await fetch(
      `${this.config.webrtcUrl}/${this.sessionId}/${this.handleId}`,
      {
        method: 'POST',
        headers: {
          Authorization: this.config.credential,
          'Content-Type': 'application/json',
          Referer: 'https://x.com',
        },
        body: JSON.stringify({
          janus: 'message',
          transaction,
          body,
        }),
      },
    );
    if (!resp.ok) {
      throw new Error(`[JanusClient] createRoom failed => ${resp.status}`);
    }
    const json = await resp.json();
    this.logger.debug('[JanusClient] createRoom =>', JSON.stringify(json));
    if (json.janus === 'error') {
      throw new Error(
        `[JanusClient] createRoom error => ${
          json.error?.reason || 'Unknown error'
        }`,
      );
    }
    if (json.plugindata?.data?.videoroom !== 'created') {
      throw new Error(
        `[JanusClient] unexpected createRoom response => ${JSON.stringify(
          json,
        )}`,
      );
    }
    this.logger.debug(
      `[JanusClient] Room '${this.config.roomId}' created successfully`,
    );
  }

  private async joinRoom(): Promise<number> {
    if (!this.sessionId || !this.handleId) {
      throw new Error('[JanusClient] no session/handle');
    }
    this.logger.debug('[JanusClient] joinRoom => start');
    const evtPromise = this.waitForJanusEvent(
      (e) =>
        e.janus === 'event' &&
        e.plugindata?.plugin === 'janus.plugin.videoroom' &&
        e.plugindata?.data?.videoroom === 'joined',
      12000,
      'Host Joined Event',
    );
    const body = {
      request: 'join',
      room: this.config.roomId,
      ptype: 'publisher',
      display: this.config.userId,
      periscope_user_id: this.config.userId,
    };
    await this.sendJanusMessage(this.handleId, body);
    const evt = await evtPromise;
    const publisherId = evt.plugindata.data.id;
    this.logger.debug('[JanusClient] joined room => publisherId=', publisherId);
    return publisherId;
  }

  private async configurePublisher() {
    if (!this.pc || !this.sessionId || !this.handleId) {
      return;
    }
    this.logger.debug('[JanusClient] createOffer...');
    const offer = await this.pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: false,
    });
    await this.pc.setLocalDescription(offer);
    this.logger.debug('[JanusClient] sending configure with JSEP...');
    await this.sendJanusMessage(
      this.handleId,
      {
        request: 'configure',
        room: this.config.roomId,
        periscope_user_id: this.config.userId,
        session_uuid: '',
        stream_name: this.config.streamName,
        vidman_token: this.config.credential,
      },
      offer,
    );
    this.logger.debug('[JanusClient] waiting for answer...');
  }

  private async sendJanusMessage(
    handleId: number,
    body: any,
    jsep?: any,
  ): Promise<void> {
    if (!this.sessionId) {
      throw new Error('[JanusClient] No session');
    }
    const transaction = this.randomTid();
    const resp = await fetch(
      `${this.config.webrtcUrl}/${this.sessionId}/${handleId}`,
      {
        method: 'POST',
        headers: {
          Authorization: this.config.credential,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          janus: 'message',
          transaction,
          body,
          jsep,
        }),
      },
    );
    if (!resp.ok) {
      throw new Error(
        '[JanusClient] sendJanusMessage failed => ' + resp.status,
      );
    }
  }

  private startPolling() {
    this.logger.debug('[JanusClient] Starting polling...');
    const doPoll = async () => {
      if (!this.pollActive || !this.sessionId) {
        this.logger.debug('[JanusClient] Polling stopped');
        return;
      }
      try {
        const url = `${this.config.webrtcUrl}/${
          this.sessionId
        }?maxev=1&_=${Date.now()}`;
        const resp = await fetch(url, {
          headers: { Authorization: this.config.credential },
        });
        if (resp.ok) {
          const event = await resp.json();
          this.handleJanusEvent(event);
        } else {
          this.logger.warn('[JanusClient] poll error =>', resp.status);
        }
      } catch (err) {
        this.logger.error('[JanusClient] poll exception =>', err);
      }
      setTimeout(doPoll, 500);
    };
    doPoll();
  }

  private handleJanusEvent(evt: any) {
    if (!evt.janus) {
      return;
    }
    if (evt.janus === 'keepalive') {
      this.logger.debug('[JanusClient] keepalive received');
      return;
    }
    if (evt.janus === 'webrtcup') {
      this.logger.debug('[JanusClient] webrtcup =>', evt.sender);
    }
    if (evt.jsep && evt.jsep.type === 'answer') {
      this.onReceivedAnswer(evt.jsep);
    }
    if (evt.plugindata?.data?.id) {
      this.publisherId = evt.plugindata.data.id;
    }
    if (evt.error) {
      this.logger.error('[JanusClient] Janus error =>', evt.error.reason);
      this.emit('error', new Error(evt.error.reason));
    }
    for (let i = 0; i < this.eventWaiters.length; i++) {
      const waiter = this.eventWaiters[i];
      if (waiter.predicate(evt)) {
        this.eventWaiters.splice(i, 1);
        waiter.resolve(evt);
        break;
      }
    }
  }

  private async onReceivedAnswer(answer: any) {
    if (!this.pc) {
      return;
    }
    this.logger.debug('[JanusClient] got answer => setRemoteDescription');
    await this.pc.setRemoteDescription(answer);
  }

  private setupPeerEvents() {
    if (!this.pc) {
      return;
    }
    this.pc.addEventListener('iceconnectionstatechange', () => {
      this.logger.debug(
        '[JanusClient] ICE state =>',
        this.pc?.iceConnectionState,
      );
      if (this.pc?.iceConnectionState === 'failed') {
        this.emit('error', new Error('ICE connection failed'));
      }
    });
    this.pc.addEventListener('track', (evt) => {
      this.logger.debug('[JanusClient] track =>', evt.track.kind);
    });
  }

  private randomTid() {
    return Math.random().toString(36).slice(2, 10);
  }

  /**
   * Allows code to wait for a specific Janus event that matches a predicate
   */
  private async waitForJanusEvent(
    predicate: (evt: any) => boolean,
    timeoutMs = 5000,
    description = 'some event',
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const waiter = { predicate, resolve, reject };
      this.eventWaiters.push(waiter);

      setTimeout(() => {
        const idx = this.eventWaiters.indexOf(waiter);
        if (idx !== -1) {
          this.eventWaiters.splice(idx, 1);
          this.logger.warn(
            `[JanusClient] waitForJanusEvent => timed out waiting for: ${description}`,
          );
          reject(
            new Error(
              `[JanusClient] waitForJanusEvent (expecting "${description}") timed out after ${timeoutMs}ms`,
            ),
          );
        }
      }, timeoutMs);
    });
  }

  public async destroyRoom(): Promise<void> {
    if (!this.sessionId || !this.handleId) {
      this.logger.warn('[JanusClient] destroyRoom => no session/handle');
      return;
    }
    if (!this.config.roomId || !this.config.userId) {
      this.logger.warn('[JanusClient] destroyRoom => no roomId/userId');
      return;
    }
    const transaction = this.randomTid();
    const body = {
      request: 'destroy',
      room: this.config.roomId,
      periscope_user_id: this.config.userId,
    };
    this.logger.info('[JanusClient] destroying room =>', body);
    const resp = await fetch(
      `${this.config.webrtcUrl}/${this.sessionId}/${this.handleId}`,
      {
        method: 'POST',
        headers: {
          Authorization: this.config.credential,
          'Content-Type': 'application/json',
          Referer: 'https://x.com',
        },
        body: JSON.stringify({
          janus: 'message',
          transaction,
          body,
        }),
      },
    );
    if (!resp.ok) {
      throw new Error(`[JanusClient] destroyRoom failed => ${resp.status}`);
    }
    const json = await resp.json();
    this.logger.debug('[JanusClient] destroyRoom =>', JSON.stringify(json));
  }

  public async leaveRoom(): Promise<void> {
    if (!this.sessionId || !this.handleId) {
      this.logger.warn('[JanusClient] leaveRoom => no session/handle');
      return;
    }
    const transaction = this.randomTid();
    const body = {
      request: 'leave',
      room: this.config.roomId,
      periscope_user_id: this.config.userId,
    };
    this.logger.info('[JanusClient] leaving room =>', body);
    const resp = await fetch(
      `${this.config.webrtcUrl}/${this.sessionId}/${this.handleId}`,
      {
        method: 'POST',
        headers: {
          Authorization: this.config.credential,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          janus: 'message',
          transaction,
          body,
        }),
      },
    );
    if (!resp.ok) {
      throw new Error(`[JanusClient] leaveRoom => error code ${resp.status}`);
    }
    const json = await resp.json();
    this.logger.debug('[JanusClient] leaveRoom =>', JSON.stringify(json));
  }
}
