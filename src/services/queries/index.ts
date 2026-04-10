import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { laundryServicesQueries } from './laundry-services.queries';

export const queries = mergeQueryKeys(laundryServicesQueries);

export { laundryServicesQueries };

