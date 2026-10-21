import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useOnline, useOrders } from '@/core/pos/hooks';
import { retryFailed, setStatus } from '@/core/pos/outbox';
import type { Order, OrderStatus } from '@/core/pos/types';

export const Route = createFileRoute('/_authed/orders')({
  component: RouteComponent,
});

const syncBadge = {
  pending: 'bg-secondary text-secondary-foreground',
  synced: 'bg-green-100 text-green-800',
  failed: 'bg-destructive text-destructive-foreground',
} as const;

// What a staff member can do next; the server enforces the same lifecycle.
const NEXT: Partial<Record<OrderStatus, { to: OrderStatus; label: string }[]>> = {
  created: [{ to: 'processing', label: 'Start' }, { to: 'cancelled', label: 'Cancel' }],
  processing: [{ to: 'ready', label: 'Ready' }, { to: 'cancelled', label: 'Cancel' }],
  ready: [{ to: 'fulfilled', label: 'Picked up' }],
};

function RouteComponent() {
  const { data: orders = [] } = useOrders();
  const online = useOnline();
  const [error, setError] = useState<string | null>(null);
  const hasFailed = orders.some((o) => o.sync === 'failed');

  const move = async (o: Order, to: OrderStatus) => {
    setError(null);
    try {
      await setStatus(o.id, to);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Orders</h1>
        {hasFailed && (
          <button onClick={() => void retryFailed()} className="rounded-md border border-input px-3 py-1 text-sm">
            Retry failed
          </button>
        )}
      </div>
      {error && <p className="mb-2 text-sm text-destructive">{error}</p>}
      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <ul className="divide-y divide-border">
          {orders.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center gap-3 py-2 text-sm">
              <span className="font-mono text-xs text-muted-foreground">{o.id.slice(0, 8)}</span>
              <span className="flex-1">
                {o.customerName}
                <span className="ml-2 text-xs text-muted-foreground">{o.lines.length} item</span>
              </span>
              <span>Rp {o.total.toLocaleString('id-ID')}</span>
              <span className="rounded bg-accent px-2 py-0.5 text-xs">{o.status}</span>
              <span className={`rounded px-2 py-0.5 text-xs ${syncBadge[o.sync]}`} title={o.syncError}>
                {o.sync}
              </span>
              {o.sync === 'synced' &&
                NEXT[o.status]?.map((a) => (
                  <button
                    key={a.to}
                    disabled={!online}
                    onClick={() => void move(o, a.to)}
                    title={online ? undefined : 'Needs a connection'}
                    className="rounded-md border border-input px-2 py-0.5 text-xs disabled:opacity-40"
                  >
                    {a.label}
                  </button>
                ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
