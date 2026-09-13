import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { laundryServicesQueries } from './laundry-services.queries';
import { usernameQueries } from './username.queries';

const queries = mergeQueryKeys(laundryServicesQueries, usernameQueries);

export default queries;