import { API_V1, apiUrl } from '@http/url';
import request from '@http/request';

import type { CoverageParams, CoverageResponse } from './coverage.types';

/** Which service area a position falls in. GET /app/v1/coverage */
export const coverage = (
  params: CoverageParams,
  prefetchKey?: string,
  signal?: AbortSignal,
): Promise<CoverageResponse> =>
  request(
    apiUrl(`${API_V1}/coverage`, { lat: String(params.lat), long: String(params.long) }),
    { signal, prefetchKey },
  );
