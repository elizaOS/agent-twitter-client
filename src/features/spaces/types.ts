import { Space } from './core/Space';

export interface AudioData {
  bitsPerSample: number; // e.g., 16
  sampleRate: number; // e.g., 48000
  channelCount: number; // e.g., 1 for mono, 2 for stereo
  numberOfFrames: number; // how many samples per channel
  samples: Int16Array; // the raw PCM data
}

export interface AudioDataWithUser extends AudioData {
  userId: string; // The ID of the speaker or user
}

export interface SpeakerRequest {
  userId: string;
  username: string;
  displayName: string;
  sessionUUID: string;
}

export interface OccupancyUpdate {
  occupancy: number;
  totalParticipants: number;
}

export interface GuestReaction {
  displayName: string;
  emoji: string;
}

export interface BroadcastCreated {
  room_id: string;
  credential: string;
  stream_name: string;
  webrtc_gw_url: string;
  broadcast: {
    user_id: string;
    twitter_id: string;
    media_key: string;
  };
  access_token: string;
  endpoint: string;
  share_url: string;
  stream_url: string;
}

export interface TurnServersInfo {
  ttl: string;
  username: string;
  password: string;
  uris: string[];
}

export interface Plugin {
  /**
   * onAttach is called immediately when .use(plugin) is invoked,
   * passing the Space instance (if needed for immediate usage).
   */
  onAttach?(space: Space): void;

  /**
   * init is called once the Space has *fully* initialized (Janus, broadcast, etc.)
   * so the plugin can get references to Janus or final config, etc.
   */
  init?(params: { space: Space; pluginConfig?: Record<string, any> }): void;

  onAudioData?(data: AudioDataWithUser): void;
  cleanup?(): void;
}

export interface PluginRegistration {
  plugin: Plugin;
  config?: Record<string, any>;
}

export interface SpeakerInfo {
  userId: string;
  sessionUUID: string;
  janusParticipantId?: number;
}
