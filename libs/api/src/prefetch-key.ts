/**
 * Turns a query-key-factory `queryKey` (e.g. `['outlets', 'list', { lat, long }]`)
 * into a stable, readable string for nitro-fetch's native prefetchKey — same
 * source of truth as the actual React Query cache key, sorted and with
 * nullish param values dropped so it stays deterministic.
 */
export function buildPrefetchKey(queryKey: readonly unknown[]): string {
  return queryKey
    .flatMap((part) => {
      if (part == null) return [];
      if (typeof part === 'object') {
        return Object.entries(part)
          .filter(([, value]) => value != null)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, value]) => `${key}:${value}`);
      }
      return [String(part)];
    })
    .join('-');
}
