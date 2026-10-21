import { ApiError, api, patch, post } from '@/core/api/http';
import { orderStore } from '@/lib/storage';
import type { Order, OrderLine, OrderStatus } from './types';

const listeners = new Set<() => void>();
export const onOrdersChanged = (fn: () => void) => {
  listeners.add(fn);
  return () => void listeners.delete(fn);
};
const emit = () => listeners.forEach((fn) => fn());

export async function listOrders(): Promise<Order[]> {
  const all = await orderStore.all<Order>();
  return all.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// The write path never touches the network: the order is durable on the
// device the moment this resolves, and sync happens separately.
export async function createOrder(input: {
  outletId: number;
  customerName: string;
  customerPhone: string;
  lines: OrderLine[];
}): Promise<Order> {
  const order: Order = {
    id: crypto.randomUUID(),
    ...input,
    total: Math.round(input.lines.reduce((sum, l) => sum + l.price * l.qty, 0)),
    createdAt: new Date().toISOString(),
    status: 'created',
    sync: 'pending',
    attempts: 0,
  };
  await orderStore.put(order.id, order);
  emit();
  void syncOrders();
  return order;
}

type ServerOrder = {
  id: string;
  outlet_id: number;
  customer_name: string;
  customer_phone: string;
  lines: { item_id: number; name: string; unit: string; price: number; qty: number }[];
  total: number;
  status: OrderStatus;
  created_at: string;
};

const fromServer = (o: ServerOrder): Order => ({
  id: o.id,
  outletId: o.outlet_id,
  customerName: o.customer_name,
  customerPhone: o.customer_phone,
  lines: o.lines.map((l) => ({ itemId: l.item_id, name: l.name, unit: l.unit, price: l.price, qty: l.qty })),
  total: o.total,
  createdAt: o.created_at,
  status: o.status,
  sync: 'synced',
  attempts: 0,
});

const toBody = (o: Order) => ({
  id: o.id,
  outlet_id: o.outletId,
  customer_name: o.customerName,
  customer_phone: o.customerPhone,
  lines: o.lines.map((l) => ({ item_id: l.itemId, name: l.name, unit: l.unit, price: l.price, qty: l.qty })),
});

let syncing = false;

/** Pushes every unsynced order (oldest first), then pulls the server's view. Safe to call at any time. */
export async function syncOrders(): Promise<void> {
  if (syncing || !navigator.onLine) return;
  syncing = true;
  try {
    const queue = (await listOrders()).filter((o) => o.sync !== 'synced').reverse();
    for (const order of queue) {
      try {
        const stored = await post<ServerOrder>('/orders', toBody(order));
        await orderStore.put(order.id, { ...fromServer(stored), createdAt: order.createdAt });
      } catch (e) {
        if (e instanceof ApiError && e.status >= 400 && e.status < 500 && e.status !== 401) {
          // The server rejected it; retrying the same payload won't help.
          await orderStore.put(order.id, { ...order, sync: 'failed', attempts: order.attempts + 1, syncError: e.message });
        } else {
          // 401, 5xx or no network: transient. Keep it pending and stop, so order is preserved.
          await orderStore.put(order.id, { ...order, attempts: order.attempts + 1 });
          break;
        }
      }
      emit();
    }
    await pull();
  } finally {
    syncing = false;
    emit();
  }
}

// Mirrors the server's orders locally so statuses changed on another device (or
// the back-office) show up, and orders this device never saw appear.
async function pull() {
  try {
    const { items } = await api<{ items: ServerOrder[] }>('/orders?limit=100');
    for (const remote of items) {
      const local = await orderStore.get<Order>(remote.id);
      if (local && local.sync !== 'synced') continue; // our unsent edits win
      await orderStore.put(remote.id, fromServer(remote));
    }
  } catch {
    // offline or signed out: keep what we have
  }
}

/** Moves an order along its lifecycle. Needs a connection: the server enforces the rules. */
export async function setStatus(id: string, status: OrderStatus): Promise<void> {
  const updated = await patch<ServerOrder>(`/orders/${id}/status`, { status });
  const local = await orderStore.get<Order>(id);
  await orderStore.put(id, { ...fromServer(updated), createdAt: local?.createdAt ?? updated.created_at });
  emit();
}

export async function retryFailed(): Promise<void> {
  for (const o of await listOrders()) {
    if (o.sync === 'failed') await orderStore.put(o.id, { ...o, sync: 'pending' });
  }
  emit();
  await syncOrders();
}

export function startSync(): () => void {
  const run = () => void syncOrders();
  window.addEventListener('online', run);
  const timer = setInterval(run, 30_000);
  run();
  return () => {
    window.removeEventListener('online', run);
    clearInterval(timer);
  };
}
