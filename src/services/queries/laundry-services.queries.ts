import { createQueryKeys } from '@lukemorales/query-key-factory';
import { laundryServices } from '@api/laundry-services';
import type { LaundryServicesParams } from '@api/laundry-services.types';

export const laundryServicesQueries = createQueryKeys('laundryServices', {
  regular: (params?: LaundryServicesParams) => ({
    queryKey: [params?.num, params?.include_tiers],
    queryFn: () => laundryServices('regular', params),
  }),
  alacarte: (params?: LaundryServicesParams) => ({
    queryKey: [params?.num, params?.include_tiers],
    queryFn: () => laundryServices('alacarte', params),
  }),
});
