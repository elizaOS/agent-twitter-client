import { EventEmitter } from 'events';
import WebSocket from 'ws';
import { Logger } from '../logger';
import type { OccupancyUpdate, SpeakerRequest } from '../types';

interface ChatClientConfig {
  spaceId: string;
  accessToken: string;
  endpoint: string;
  logger: Logger;
}

export class ChatClient extends EventEmitter {
  private ws?: WebSocket;
  private connected = false;
  private logger: Logger;
  private readonly spaceId: string;
  private readonly accessToken: string;
  private endpoint: string;

  constructor(config: ChatClientConfig) {
    super();
    this.spaceId = config.spaceId;
    this.accessToken = config.accessToken;
    this.endpoint = config.endpoint;
    this.logger = config.logger;
  }

  async connect() {
    const wsUrl = `${this.endpoint}/chatapi/v1/chatnow`.replace(
      'https://',
      'wss://',
    );
    this.logger.info('[ChatClient] Connecting =>', wsUrl);

    this.ws = new WebSocket(wsUrl, {
      headers: {
        Origin: 'https://x.com',
        'User-Agent': 'Mozilla/5.0',
      },
    });

    await this.setupHandlers();
  }

  private setupHandlers(): Promise<void> {
    if (!this.ws) {
      throw new Error('No WebSocket instance');
    }

    return new Promise((resolve, reject) => {
      this.ws!.on('open', () => {
        this.logger.info('[ChatClient] Connected');
        this.connected = true;
        this.sendAuthAndJoin();
        resolve();
      });

      this.ws!.on('message', (data: { toString: () => string }) => {
        this.handleMessage(data.toString());
      });

      this.ws!.on('close', () => {
        this.logger.info('[ChatClient] Closed');
        this.connected = false;
        this.emit('disconnected');
      });

      this.ws!.on('error', (err) => {
        this.logger.error('[ChatClient] Error =>', err);
        reject(err);
      });
    });
  }

  private sendAuthAndJoin() {
    if (!this.ws) return;

    this.ws.send(
      JSON.stringify({
        payload: JSON.stringify({ access_token: this.accessToken }),
        kind: 3,
      }),
    );

    this.ws.send(
      JSON.stringify({
        payload: JSON.stringify({
          body: JSON.stringify({ room: this.spaceId }),
          kind: 1,
        }),
        kind: 2,
      }),
    );
  }

  reactWithEmoji(emoji: string) {
    if (!this.ws) return;
    const payload = JSON.stringify({
      body: JSON.stringify({ body: emoji, type: 2, v: 2 }),
      kind: 1,
      /*
      // The 'sender' field is not required, it's not even verified by the server
      // Instead of passing attributes down here it's easier to ignore it
      sender: {
        user_id: null,
        twitter_id: null,
        username: null,
        display_name: null,
      },
      */
      payload: JSON.stringify({
        room: this.spaceId,
        body: JSON.stringify({ body: emoji, type: 2, v: 2 }),
      }),
      type: 2,
    });
    this.ws.send(payload);
  }

  private handleMessage(raw: string) {
    let msg: any;
    try {
      msg = JSON.parse(raw);
    } catch {
      return;
    }
    if (!msg.payload) return;

    const payload = safeJson(msg.payload);
    if (!payload?.body) return;

    const body = safeJson(payload.body);

    if (body.guestBroadcastingEvent === 1) {
      const req: SpeakerRequest = {
        userId: body.guestRemoteID,
        username: body.guestUsername,
        displayName: payload.sender?.display_name || body.guestUsername,
        sessionUUID: body.sessionUUID,
      };
      this.emit('speakerRequest', req);
    }

    if (typeof body.occupancy === 'number') {
      const update: OccupancyUpdate = {
        occupancy: body.occupancy,
        totalParticipants: body.total_participants || 0,
      };
      this.emit('occupancyUpdate', update);
    }

    if (body.guestBroadcastingEvent === 16) {
      this.emit('muteStateChanged', {
        userId: body.guestRemoteID,
        muted: true,
      });
    }
    if (body.guestBroadcastingEvent === 17) {
      this.emit('muteStateChanged', {
        userId: body.guestRemoteID,
        muted: false,
      });
    }
    // Example of guest reaction
    if (body?.type === 2) {
      this.logger.info('[ChatClient] Emitting guest reaction event =>', body);
      this.emit('guestReaction', {
        displayName: body.displayName,
        emoji: body.body,
      });
    }
  }

  async disconnect() {
    if (this.ws) {
      this.logger.info('[ChatClient] Disconnecting...');
      this.ws.close();
      this.ws = undefined;
      this.connected = false;
    }
  }
}

function safeJson(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
