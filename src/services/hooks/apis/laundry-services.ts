import {
  laundryServiceDetail,
  laundryServicesAlacarte,
  laundryServicesRegular,
} from '@api/laundry-services';
import type {
  LaundryServiceDetailResponse,
  LaundryServicesParams,
  LaundryServicesResponse,
} from '@api/laundry-services.types';
import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { useQuery } from '@tanstack/react-query';

export const laundryServicesQueryKeys = createQueryKeyStore({
  laundryServices: {
    listRegular: (params?: LaundryServicesParams) => ({
      queryKey: [
        'fetchLaundryServices',
        'regular',
        params?.num,
        params?.include_tiers,
      ],
      queryFn: () => laundryServicesRegular(params),
    }),
    listAlacarte: (params?: LaundryServicesParams) => ({
      queryKey: [
        'fetchLaundryServices',
        'alacarte',
        params?.num,
        params?.include_tiers,
      ],
      queryFn: () => laundryServicesAlacarte(params),
    }),
    detail: (id: string) => ({
      queryKey: ['fetchLaundryServiceDetail', id],
      queryFn: () => laundryServiceDetail(id),
    }),
  },
});

export const useFetchLaundryServices = (params?: LaundryServicesParams) => {
  return useQuery({
    ...laundryServicesQueryKeys.laundryServices.listRegular(params),
    select: (data: LaundryServicesResponse) => data.data ?? null,
  });
};

export const useFetchLaundryServicesAlacarte = (
  params?: LaundryServicesParams,
) => {
  return useQuery({
    ...laundryServicesQueryKeys.laundryServices.listAlacarte(params),
    select: (data: LaundryServicesResponse) => data.data ?? null,
  });
};

export const useFetchLaundryServiceDetail = (id: string) => {
  return useQuery({
    ...laundryServicesQueryKeys.laundryServices.detail(id),
    select: (data: LaundryServiceDetailResponse) => data.data ?? null,
    enabled: !!id,
  });
};
