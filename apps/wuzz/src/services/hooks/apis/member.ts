import { memberSummary } from '@api/member';
import type { MemberSummaryResponse } from '@api/member.types';
import { buildPrefetchKey } from '@http/prefetch-key';
import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { useQuery } from '@tanstack/react-query';

export const memberQueryKeys = createQueryKeyStore({
  member: {
    summary: {
      queryKey: null,
      queryFn: ({ signal, queryKey }) =>
        memberSummary(buildPrefetchKey(queryKey), signal),
    },
  },
});

/** Only runs for a signed-in customer; a guest has no member card to load. */
export const useFetchMemberSummary = (options: { enabled: boolean }) => {
  return useQuery({
    ...memberQueryKeys.member.summary,
    select: (data: MemberSummaryResponse) => data.data ?? null,
    enabled: options.enabled,
    // A failed summary is almost always a missing or expired session, which a retry
    // cannot fix; fail fast instead of spinning through the default backoff.
    retry: false,
    // Points, vouchers and the like change outside the app; a persisted copy from
    // an earlier session (or an older response shape) must not stand in for them.
    staleTime: 0,
    refetchOnMount: 'always',
  });
};
