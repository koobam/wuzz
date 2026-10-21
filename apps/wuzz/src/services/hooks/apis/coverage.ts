import { coverage } from '@api/coverage';
import type { CoverageParams, CoverageResponse } from '@api/coverage.types';
import { buildPrefetchKey } from '@http/prefetch-key';
import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { useQuery } from '@tanstack/react-query';

export const coverageQueryKeys = createQueryKeyStore({
  coverage: {
    at: (params: CoverageParams) => ({
      queryKey: [{ ...params }],
      queryFn: ({ signal, queryKey }) => coverage(params, buildPrefetchKey(queryKey), signal),
    }),
  },
});

/** Service area for a position. Stays off until there are real coordinates. */
export const useFetchCoverage = (params: CoverageParams | null) => {
  return useQuery({
    ...coverageQueryKeys.coverage.at(params ?? { lat: 0, long: 0 }),
    select: (data: CoverageResponse) => data.data ?? null,
    enabled: params != null,
  });
};
