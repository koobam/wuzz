import { env } from '@/services/env/client';

// Staff API client: bearer-token auth against the gateway's /pos/v1.
// The session lives in localStorage so a reload (or a reload while offline)
// keeps the cashier signed in.

const AUDIENCE = 'pos';
const KEY = `${AUDIENCE}.session`;
const REFRESH_SKEW_MS = 30_000;

export type SessionUser = { id: string; name: string; phone: string; roles: string[] };
export type Session = {
  user: SessionUser;
  access_token: string;
  refresh_token: string;
  expires_at: string;
};

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

type Envelope<T> = { success: boolean; message: string; data: T };

export function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function writeSession(session: Session | null) {
  try {
    if (session) localStorage.setItem(KEY, JSON.stringify(session));
    else localStorage.removeItem(KEY);
  } catch {
    // Storage unavailable: the session just won't survive a reload.
  }
}

async function send<T>(path: string, init: RequestInit, token?: string): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(`${env.VITE_API_URL}/${AUDIENCE}/v1${path}`, { ...init, headers });

  let body: Envelope<T> | null = null;
  try {
    body = (await res.json()) as Envelope<T>;
  } catch {
    // non-JSON error page from a proxy
  }
  if (!res.ok || !body?.success) throw new ApiError(res.status, body?.message ?? `Request failed (${res.status})`);
  return body.data;
}

let refreshing: Promise<Session | null> | null = null;

/**
 * Exchanges the refresh token for a new session. Returns null only when the
 * server says the session is over (401/403); a network failure throws, so the
 * caller can keep working offline on the session it has.
 */
export function refreshSession(): Promise<Session | null> {
  refreshing ??= (async () => {
    const current = readSession();
    if (!current) return null;
    try {
      const next = await send<Session>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refresh_token: current.refresh_token }),
      });
      writeSession(next);
      return next;
    } catch (e) {
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) {
        writeSession(null);
        return null;
      }
      throw e;
    }
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
}

function nearExpiry(s: Session) {
  return new Date(s.expires_at).getTime() - Date.now() < REFRESH_SKEW_MS;
}

/** A valid access token, refreshing first when it is about to expire. */
export async function accessToken(): Promise<string | null> {
  let session = readSession();
  if (session && nearExpiry(session)) {
    try {
      session = await refreshSession();
    } catch {
      // offline: try the token we have; the server decides
    }
  }
  return session?.access_token ?? null;
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await accessToken();
  try {
    return await send<T>(path, init, token ?? undefined);
  } catch (e) {
    if (e instanceof ApiError && e.status === 401 && token) {
      const next = await refreshSession();
      if (next) return send<T>(path, init, next.access_token);
    }
    throw e;
  }
}

export const post = <T>(path: string, body?: unknown) =>
  api<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) });
export const patch = <T>(path: string, body: unknown) =>
  api<T>(path, { method: 'PATCH', body: JSON.stringify(body) });

// Unauthenticated calls (sign-in).
export const publicPost = <T>(path: string, body: unknown) =>
  send<T>(path, { method: 'POST', body: JSON.stringify(body) });
