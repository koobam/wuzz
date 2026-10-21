import { api } from '@/core/api/http';
import { cacheStore } from '@/lib/storage';
import type { Catalog } from './types';

const KEY = 'catalog';
const EMPTY: Catalog = { outlets: [], services: [] };

type ServerCatalog = {
  outlets: { id: number; name: string; address: string }[];
  services: { id: number; name: string; unit: string; price: number }[];
};

// Network first with a short timeout, cache as the fallback: online the cashier
// always sees today's prices, offline they get the last catalog they loaded.
// A brand-new device that has never been online has nothing to sell yet.
export async function loadCatalog(): Promise<Catalog> {
  try {
    const fresh = await withTimeout(api<ServerCatalog>('/catalog'), 4000);
    const catalog: Catalog = {
      outlets: fresh.outlets.map((o) => ({ id: o.id, name: o.name, address: o.address })),
      services: fresh.services,
    };
    await cacheStore.put(KEY, catalog);
    return catalog;
  } catch {
    return (await cacheStore.get<Catalog>(KEY)) ?? EMPTY;
  }
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([p, new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);
}
