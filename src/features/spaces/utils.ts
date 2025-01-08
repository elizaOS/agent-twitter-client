import { Headers } from 'headers-polyfill';
import type { BroadcastCreated, TurnServersInfo } from './types';

export async function authorizeToken(cookie: string): Promise<string> {
  const headers = new Headers({
    'X-Periscope-User-Agent': 'Twitter/m5',
    'Content-Type': 'application/json',
    'X-Idempotence': Date.now().toString(),
    Referer: 'https://x.com/',
    'X-Attempt': '1',
  });

  const resp = await fetch('https://proxsee.pscp.tv/api/v2/authorizeToken', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      service: 'guest',
      cookie: cookie,
    }),
  });

  if (!resp.ok) {
    throw new Error(`Failed to authorize token => ${resp.status}`);
  }

  const data = (await resp.json()) as { authorization_token: string };
  if (!data.authorization_token) {
    throw new Error('authorizeToken: Missing authorization_token in response');
  }

  return data.authorization_token;
}

export async function publishBroadcast(params: {
  title: string;
  broadcast: BroadcastCreated;
  cookie: string;
  janusSessionId?: number;
  janusHandleId?: number;
  janusPublisherId?: number;
}) {
  const headers = new Headers({
    'X-Periscope-User-Agent': 'Twitter/m5',
    'Content-Type': 'application/json',
    Referer: 'https://x.com/',
    'X-Idempotence': Date.now().toString(),
    'X-Attempt': '1',
  });

  await fetch('https://proxsee.pscp.tv/api/v2/publishBroadcast', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      accept_guests: true,
      broadcast_id: params.broadcast.room_id,
      webrtc_handle_id: params.janusHandleId,
      webrtc_session_id: params.janusSessionId,
      janus_publisher_id: params.janusPublisherId,
      janus_room_id: params.broadcast.room_id,
      cookie: params.cookie,
      status: params.title,
      conversation_controls: 0,
    }),
  });
}

export async function getTurnServers(cookie: string): Promise<TurnServersInfo> {
  const headers = new Headers({
    'X-Periscope-User-Agent': 'Twitter/m5',
    'Content-Type': 'application/json',
    Referer: 'https://x.com/',
    'X-Idempotence': Date.now().toString(),
    'X-Attempt': '1',
  });

  const resp = await fetch('https://proxsee.pscp.tv/api/v2/turnServers', {
    method: 'POST',
    headers,
    body: JSON.stringify({ cookie }),
  });
  if (!resp.ok) throw new Error('Failed to get turn servers => ' + resp.status);
  return resp.json();
}

/**
 * Get region from signer.pscp.tv
 */
export async function getRegion(): Promise<string> {
  const resp = await fetch('https://signer.pscp.tv/region', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Referer: 'https://x.com',
    },
    body: JSON.stringify({}),
  });
  if (!resp.ok) {
    throw new Error(`Failed to get region => ${resp.status}`);
  }
  const data = (await resp.json()) as { region: string };
  return data.region;
}

/**
 * Create broadcast on Periscope
 */
export async function createBroadcast(params: {
  description?: string;
  languages?: string[];
  cookie: string;
  region: string;
}): Promise<BroadcastCreated> {
  const headers = new Headers({
    'X-Periscope-User-Agent': 'Twitter/m5',
    'Content-Type': 'application/json',
    'X-Idempotence': Date.now().toString(),
    Referer: 'https://x.com/',
    'X-Attempt': '1',
  });

  const resp = await fetch('https://proxsee.pscp.tv/api/v2/createBroadcast', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      app_component: 'audio-room',
      content_type: 'visual_audio',
      cookie: params.cookie,
      conversation_controls: 0,
      description: params.description || '',
      height: 1080,
      is_360: false,
      is_space_available_for_replay: false,
      is_webrtc: true,
      languages: params.languages ?? [],
      region: params.region,
      width: 1920,
    }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Failed to create broadcast => ${resp.status} ${text}`);
  }

  const data = await resp.json();
  return data as BroadcastCreated;
}
