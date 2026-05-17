import { outlets, outletsNearest } from '@api/outlets';
import type { NearestOutletParams, NearestOutletResponse, OutletsParams, OutletsResponse } from '@api/outlets.types';
import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { useQuery } from '@tanstack/react-query';

export const outletsQueryKeys = createQueryKeyStore({
  outlets: {
    list: (params?: OutletsParams) => ({
      queryKey: ['fetchOutlets', params?.lat, params?.long, params?.cursor, params?.num],
      queryFn: () => outlets(params),
    }),
    nearest: (params: NearestOutletParams) => ({
      queryKey: ['fetchNearestOutlet', params.lat, params.long],
      queryFn: () => outletsNearest(params),
    }),
  },
});

export const useFetchOutlets = (params?: OutletsParams) => {
  return useQuery({
    ...outletsQueryKeys.outlets.list(params),
    select: (data: OutletsResponse) => data.data ?? null,
    gcTime: 0,
  });
};

export const useFetchNearestOutlet = (params: NearestOutletParams) => {
  return useQuery({
    ...outletsQueryKeys.outlets.nearest(params),
    select: (data: NearestOutletResponse) => data.data ?? null,
    enabled: params.lat !== 0 && params.long !== 0,
    gcTime: 5 * 60 * 1000, // 5 menit
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}
