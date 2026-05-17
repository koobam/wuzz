import type {
  LaundryServiceDetailResponse,
  LaundryServicesParams,
  LaundryServicesResponse,
} from '@api/laundry-services.types';
import queries from '@services/queries';
import { useQuery } from '@tanstack/react-query';

export const useFetchLaundryServices = (params?: LaundryServicesParams) => {
  return useQuery({
    ...queries.laundryServices.regular(params),
    select: (data: LaundryServicesResponse) => data.data ?? null,
  });
};

export const useFetchLaundryServicesAlacarte = (
  params?: LaundryServicesParams,
) => {
  return useQuery({
    ...queries.laundryServices.alacarte(params),
    select: (data: LaundryServicesResponse) => data.data ?? null,
  });
};

export const useFetchLaundryServiceDetail = (id: string) => {
  return useQuery({
    ...queries.laundryServices.detail(id),
    gcTime: 5 * 60 * 1000, // 5 menit
    select: (data: LaundryServiceDetailResponse) => data.data ?? null,
    enabled: !!id,
  });
};
