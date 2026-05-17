import { useEffect } from 'react';
import { prefetch, prefetchOnAppStart } from 'react-native-nitro-fetch';
import { buildHeaders } from '@http/request';
import { apiUrl } from '@http/url';

type PrefetchEntry = {
  path: string;
  prefetchKey: string;
};

async function executePrefetch(path: string, prefetchKey: string): Promise<void> {
  const headers = await buildHeaders();
  await prefetch(apiUrl(path), {
    headers: { ...headers, prefetchKey },
  });
}

async function executeAppStartPrefetch(path: string, prefetchKey: string): Promise<void> {
  const headers = await buildHeaders();
  await prefetchOnAppStart(apiUrl(path), { headers, prefetchKey });
}

export async function prefetchUrls(entries: PrefetchEntry[]): Promise<void> {
  await Promise.all(entries.map(({ path, prefetchKey }) => executePrefetch(path, prefetchKey)));
}

export async function appStartPrefetchUrls(entries: PrefetchEntry[]): Promise<void> {
  await Promise.all(entries.map(({ path, prefetchKey }) => executeAppStartPrefetch(path, prefetchKey)));
}

export function usePrefetch(entries: PrefetchEntry[]): void {
  useEffect(() => {
    entries.forEach(({ path, prefetchKey }) => {
      executePrefetch(path, prefetchKey).catch(() => {});
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
