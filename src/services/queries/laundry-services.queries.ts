import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  laundryServicesAlacarte,
  laundryServicesRegular,
} from '@api/laundry-services';
import type { LaundryServicesParams } from '@api/laundry-services.types';

export const laundryServicesQueries = createQueryKeys('laundryServices', {
  regular: (params?: LaundryServicesParams) => ({
    queryKey: [params?.num, params?.include_tiers],
    queryFn: () => laundryServicesRegular(params),
  }),
  alacarte: (params?: LaundryServicesParams) => ({
    queryKey: [params?.num, params?.include_tiers],
    queryFn: () => laundryServicesAlacarte(params),
  }),
});
