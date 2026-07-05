import { outletNearest, outlets } from '@api/outlets';
import type {
  NearestOutletResponse,
  OutletsParams,
  OutletsResponse,
} from '@api/outlets.types';
import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { useQuery } from '@tanstack/react-query';

export const outletsQueryKeys = createQueryKeyStore({
  outlets: {
    list: (params?: OutletsParams) => ({
      queryKey: ['fetchOutlets', params?.lat, params?.long, params?.cursor, params?.num],
      queryFn: () => outlets(params),
    }),
    nearest: (params?: OutletsParams) => ({
      queryKey: ['fetchNearestOutlet', params?.lat, params?.long],
      queryFn: () => outletNearest(params),
    }),
  },
});

export const useFetchOutlets = (params?: OutletsParams) => {
  return useQuery({
    ...outletsQueryKeys.outlets.list(params),
    select: (data: OutletsResponse) => data.data ?? null,
  });
};

export const useFetchNearestOutlet = (params?: OutletsParams) => {
  return useQuery({
    ...outletsQueryKeys.outlets.nearest(params),
    select: (data: NearestOutletResponse) => data.data ?? null,
  });
};
