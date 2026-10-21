import { Socket } from 'phoenix';
import { env } from '@/services/env/client';

export type Conversation = {
  id: string;
  customer_id: string;
  kind: 'support' | 'outlet';
  outlet_id: string | null;
  status: 'open' | 'closed';
  last_message_at: string | null;
};

export type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: 'customer' | 'admin' | 'outlet';
  body: string;
  inserted_at: string;
};

async function api<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${env.VITE_SUPPORT_URL}/api${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`support api ${res.status}`);
  return ((await res.json()) as { data: T }).data;
}

export const fetchConversations = (token: string) => api<Conversation[]>('/conversations', token);
export const fetchMessages = (token: string, id: string) =>
  api<ChatMessage[]>(`/conversations/${id}/messages`, token);

export function connectSocket(token: string): Socket {
  const url = env.VITE_SUPPORT_URL.replace(/^http/, 'ws') + '/socket';
  const socket = new Socket(url, { params: { token } });
  socket.connect();
  return socket;
}

export type IceServer = { urls: string[]; username?: string; credential?: string };

export const fetchIceServers = (token: string) => api<IceServer[]>('/ice-servers', token);
