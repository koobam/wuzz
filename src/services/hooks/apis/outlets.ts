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
      queryKey: [
        'fetchOutlets',
        params?.lat,
        params?.long,
        params?.cursor,
        params?.num,
        params?.selected_outlet_id,
      ],
      queryFn: () => outlets(params),
    }),
    nearest: (params?: OutletsParams) => ({
      queryKey: ['fetchNearestOutlet', params?.lat, params?.long],
      queryFn: () => outletNearest(params),
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

export const useFetchNearestOutlet = (params?: OutletsParams) => {
  return useQuery({
    ...outletsQueryKeys.outlets.nearest(params),
    select: (data: NearestOutletResponse) => data.data ?? null,
  });
};
