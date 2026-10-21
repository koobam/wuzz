import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useCatalog } from '@/core/pos/hooks';
import { createOrder } from '@/core/pos/outbox';
import type { CatalogItem } from '@/core/pos/types';

export const Route = createFileRoute('/_authed/')({
  component: RouteComponent,
});

const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
const input = 'w-full rounded-md border border-input px-3 py-2 text-sm';
const OUTLET_KEY = 'pos.outlet';

function RouteComponent() {
  const { data: catalog, isLoading } = useCatalog();
  const outlets = catalog?.outlets ?? [];
  const services = catalog?.services ?? [];

  const [outletId, setOutletId] = useState<number | null>(null);
  const [qty, setQty] = useState<Record<number, number>>({});
  const [customerName, setName] = useState('');
  const [customerPhone, setPhone] = useState('');
  const [saved, setSaved] = useState<string | null>(null);

  // Remember the cashier's outlet; a staff member with one outlet never has to choose.
  useEffect(() => {
    if (outlets.length === 0) return;
    const remembered = Number(localStorage.getItem(OUTLET_KEY));
    setOutletId((cur) => cur ?? (outlets.find((o) => o.id === remembered) ?? outlets[0]!).id);
  }, [outlets]);

  const lines = services
    .filter((i) => (qty[i.id] ?? 0) > 0)
    .map((i) => ({ itemId: i.id, name: i.name, unit: i.unit, price: i.price, qty: qty[i.id]! }));
  const total = Math.round(lines.reduce((s, l) => s + l.price * l.qty, 0));
  const canSave = outletId != null && lines.length > 0 && customerName.trim() !== '';

  const change = (item: CatalogItem, value: string) => {
    const n = Math.max(0, Number(value) || 0);
    setQty((q) => ({ ...q, [item.id]: n }));
  };

  const save = async () => {
    if (outletId == null) return;
    const order = await createOrder({ outletId, customerName: customerName.trim(), customerPhone: customerPhone.trim(), lines });
    setSaved(order.id.slice(0, 8));
    setQty({});
    setName('');
    setPhone('');
  };

  if (!isLoading && outlets.length === 0) {
    return (
      <p className="mx-auto max-w-md rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground">
        No catalog on this device yet. Connect to the internet once so the outlet and price list can be loaded; after that the POS works offline.
      </p>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-[1fr_20rem]">
      <section className="rounded-lg border border-border bg-card p-4">
        <h1 className="mb-3 text-lg font-semibold">New order</h1>
        <ul className="divide-y divide-border">
          {services.map((item) => (
            <li key={item.id} className="flex items-center gap-3 py-2">
              <div className="flex-1">
                <div className="text-sm font-medium">{item.name}</div>
                <div className="text-xs text-muted-foreground">
                  {rupiah(item.price)} / {item.unit}
                </div>
              </div>
              <input
                type="number"
                min={0}
                step={item.unit === 'kg' ? 0.5 : 1}
                value={qty[item.id] ?? ''}
                onChange={(e) => change(item, e.target.value)}
                placeholder="0"
                className="w-24 rounded-md border border-input px-2 py-1 text-right text-sm"
              />
              <span className="w-8 text-xs text-muted-foreground">{item.unit}</span>
            </li>
          ))}
        </ul>
      </section>

      <aside className="space-y-3 rounded-lg border border-border bg-card p-4">
        {outlets.length > 1 && (
          <select
            className={input}
            value={outletId ?? ''}
            onChange={(e) => {
              setOutletId(Number(e.target.value));
              localStorage.setItem(OUTLET_KEY, e.target.value);
            }}
          >
            {outlets.map((o) => (
              <option key={o.id} value={o.id}>{o.name}</option>
            ))}
          </select>
        )}
        {outlets.length === 1 && <div className="text-sm font-medium">{outlets[0]!.name}</div>}
        <input className={input} placeholder="Customer name" value={customerName} onChange={(e) => setName(e.target.value)} />
        <input className={input} placeholder="Phone (optional)" inputMode="tel" value={customerPhone} onChange={(e) => setPhone(e.target.value)} />
        <div className="flex justify-between border-t border-border pt-3 text-sm font-medium">
          <span>Total</span>
          <span>{rupiah(total)}</span>
        </div>
        <button
          disabled={!canSave}
          onClick={save}
          className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          Save order
        </button>
        {saved && <p className="text-xs text-muted-foreground">Order {saved} saved. It syncs automatically.</p>}
      </aside>
    </div>
  );
}
