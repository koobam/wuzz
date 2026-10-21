import { outlets } from '@api/outlets';
import type { OutletsParams, OutletsResponse } from '@api/outlets.types';
import { buildPrefetchKey } from '@http/prefetch-key';
import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { useQuery } from '@tanstack/react-query';

export const outletsQueryKeys = createQueryKeyStore({
  outlets: {
    list: (params?: OutletsParams) => ({
      queryKey: [{ ...params }],
      queryFn: ({ signal, queryKey }) => outlets(params, buildPrefetchKey(queryKey), signal),
    }),
  },
});

export const useFetchOutlets = (
  params?: OutletsParams,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    ...outletsQueryKeys.outlets.list(params),
    select: (data: OutletsResponse) => data.data ?? null,
    enabled: options?.enabled ?? true,
  });
};
