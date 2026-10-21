import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import type { Channel } from 'phoenix';
import { useEffect, useRef, useState } from 'react';
import {
  connectSocket,
  fetchConversations,
  fetchMessages,
  type ChatMessage,
  type Conversation,
} from '@/core/chat/support';
import { useCall } from '@/core/chat/call';
import { useOnline } from '@/core/pos/hooks';
import { useSession } from '@/services/hooks/apis/auth';

export const Route = createFileRoute('/_authed/chat')({
  component: RouteComponent,
});

function RouteComponent() {
  const online = useOnline();
  const token = useSession().data?.access_token;
  const [activeId, setActiveId] = useState<string | null>(null);

  const conversations = useQuery({
    queryKey: ['chat', 'conversations'],
    queryFn: () => fetchConversations(token!),
    enabled: !!token && online,
    refetchInterval: 15_000,
  });

  if (!token) return <p className="text-sm text-muted-foreground">Chat needs a signed-in session with an access token.</p>;

  return (
    <div className="mx-auto grid h-[calc(100vh-7rem)] max-w-4xl grid-cols-[16rem_1fr] overflow-hidden rounded-lg border border-border bg-card">
      <ul className="overflow-y-auto border-r border-border">
        {!online && <li className="p-3 text-xs text-destructive">Offline — chat is unavailable.</li>}
        {(conversations.data ?? []).map((c: Conversation) => (
          <li key={c.id}>
            <button
              onClick={() => setActiveId(c.id)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-accent ${activeId === c.id ? 'bg-accent' : ''}`}
            >
              <div className="font-medium">{c.kind === 'support' ? 'Support' : `Outlet ${c.outlet_id}`}</div>
              <div className="text-xs text-muted-foreground">Customer {c.customer_id}</div>
            </button>
          </li>
        ))}
      </ul>
      {activeId && online ? (
        <Thread key={activeId} id={activeId} token={token} />
      ) : (
        <div className="flex items-center justify-center text-sm text-muted-foreground">Select a conversation</div>
      )}
    </div>
  );
}

function Thread({ id, token }: { id: string; token: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const channel = useRef<Channel | null>(null);
  const [joined, setJoined] = useState<Channel | null>(null);
  const call = useCall(joined, token);
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const socket = connectSocket(token);
    const ch = socket.channel(`conversation:${id}`);
    channel.current = ch;

    // Subscribe before loading history so nothing sent in between is lost;
    // dedupe by id when the two overlap.
    const add = (incoming: ChatMessage[]) =>
      setMessages((prev) => {
        const seen = new Set(prev.map((m) => m.id));
        return [...prev, ...incoming.filter((m) => !seen.has(m.id))];
      });
    ch.on('message', (m: ChatMessage) => add([m]));
    ch.join().receive('ok', () => setJoined(ch));
    fetchMessages(token, id).then((history) => !cancelled && add(history)).catch(() => undefined);

    return () => {
      cancelled = true;
      ch.leave();
      socket.disconnect();
    };
  }, [id, token]);

  useEffect(() => bottom.current?.scrollIntoView({ block: 'end' }), [messages]);
  useEffect(() => {
    if (localVideo.current) localVideo.current.srcObject = call.local;
    if (remoteVideo.current) remoteVideo.current.srcObject = call.remote;
  }, [call.local, call.remote]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const body = draft.trim();
    if (!body) return;
    channel.current?.push('message', { body });
    setDraft('');
  };

  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-sm">
        {call.state.status === 'idle' && (
          <>
            <button onClick={() => call.start(false)} className="rounded-md border border-input px-3 py-1">Call</button>
            <button onClick={() => call.start(true)} className="rounded-md border border-input px-3 py-1">Video call</button>
          </>
        )}
        {call.state.status === 'ringing' && (
          <>
            <span>{call.state.incoming ? `Incoming ${call.state.video ? 'video ' : ''}call${call.state.from ? ` from ${call.state.from}` : ''}` : 'Calling…'}</span>
            {call.state.incoming && (
              <button onClick={() => void call.accept()} className="rounded-md bg-primary px-3 py-1 text-primary-foreground">Accept</button>
            )}
            <button onClick={call.hangup} className="rounded-md border border-input px-3 py-1">
              {call.state.incoming ? 'Decline' : 'Cancel'}
            </button>
          </>
        )}
        {call.state.status === 'connected' && (
          <>
            <span className="text-green-600">In call</span>
            <button onClick={call.hangup} className="rounded-md bg-destructive px-3 py-1 text-destructive-foreground">End</button>
          </>
        )}
      </div>
      {call.state.status !== 'idle' && (
        <div className="relative bg-black">
          <video ref={remoteVideo} autoPlay playsInline className="h-56 w-full object-contain" />
          <video ref={localVideo} autoPlay playsInline muted className="absolute bottom-2 right-2 h-20 rounded border border-white/30" />
        </div>
      )}
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender_role === 'customer' ? 'justify-start' : 'justify-end'}`}>
            <span
              className={`max-w-[70%] rounded-lg px-3 py-1.5 text-sm ${
                m.sender_role === 'customer' ? 'bg-secondary' : 'bg-primary text-primary-foreground'
              }`}
            >
              {m.body}
            </span>
          </div>
        ))}
        <div ref={bottom} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-border p-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message"
          className="flex-1 rounded-md border border-input px-3 py-2 text-sm"
        />
        <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Send</button>
      </form>
    </div>
  );
}
