import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  laundryServices,
  laundryServiceDetail,
} from '@api/laundry-services';
import type { LaundryServicesParams } from '@api/laundry-services.types';

export const LAUNDRY_SERVICES_QUERY_KEY = {
  base: 'laundryServices',
  regular: 'laundryServices-regular',
  alacarte: 'laundryServices-alacarte',
  detail: (id: string) => `laundryServiceDetail-${id}`,
} as const;

export const laundryServicesQueries = createQueryKeys(LAUNDRY_SERVICES_QUERY_KEY.base, {
  regular: (params?: LaundryServicesParams) => ({
    queryKey: [LAUNDRY_SERVICES_QUERY_KEY.regular],
    queryFn: ({ signal }) =>
      laundryServices('regular',params, LAUNDRY_SERVICES_QUERY_KEY.regular, signal),
  }),
  alacarte: (params?: LaundryServicesParams) => ({
    queryKey: [LAUNDRY_SERVICES_QUERY_KEY.alacarte],
    queryFn: ({ signal }) =>
      laundryServices('alacarte', params, LAUNDRY_SERVICES_QUERY_KEY.alacarte, signal),
  }),
  detail: (id: string) => ({
    queryKey: [LAUNDRY_SERVICES_QUERY_KEY.detail(id), id],
    queryFn: ({ signal }) =>
      laundryServiceDetail(id, LAUNDRY_SERVICES_QUERY_KEY.detail(id), signal),
  }),
});
