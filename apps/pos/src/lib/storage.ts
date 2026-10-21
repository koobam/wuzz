import { createStore, del, entries, get, set } from 'idb-keyval';

// One IndexedDB database, one object store per concern.
const orders = createStore('wuzz-pos', 'orders');
const cache = createStore('wuzz-pos-cache', 'kv');

export const orderStore = {
  put: (id: string, value: unknown) => set(id, value, orders),
  get: <T>(id: string) => get<T>(id, orders),
  remove: (id: string) => del(id, orders),
  all: <T>() => entries<string, T>(orders).then((rows) => rows.map(([, v]) => v)),
};

export const cacheStore = {
  put: (key: string, value: unknown) => set(key, value, cache),
  get: <T>(key: string) => get<T>(key, cache),
};
