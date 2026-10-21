export type Outlet = { id: number; name: string; address: string };

export type CatalogItem = {
  id: number;
  name: string;
  unit: string;
  /** Rupiah, integer. */
  price: number;
};

export type Catalog = { outlets: Outlet[]; services: CatalogItem[] };

export type OrderLine = { itemId: number; name: string; unit: string; price: number; qty: number };

/** pending = not on the server yet; synced = the server has it; failed = the server refused it. */
export type SyncStatus = 'pending' | 'synced' | 'failed';

/** The server's lifecycle: created → processing → ready → fulfilled, or cancelled. */
export type OrderStatus = 'created' | 'processing' | 'ready' | 'fulfilled' | 'cancelled';

export type Order = {
  /** Generated on the device; doubles as the idempotency key for the server. */
  id: string;
  outletId: number;
  customerName: string;
  customerPhone: string;
  lines: OrderLine[];
  total: number;
  createdAt: string;
  status: OrderStatus;
  sync: SyncStatus;
  syncError?: string;
  attempts: number;
};
