import type { QueryClient } from '@tanstack/react-query';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchSession, login, logout, type Admin } from '@/core/api/auth';

export const sessionKey = ['auth', 'session'] as const;

// Reads the query cache directly rather than a hook, so a router `beforeLoad`
// guard can check it synchronously before any component renders.
export function isAuthenticatedIn(queryClient: QueryClient): boolean {
  return queryClient.getQueryData<Admin | null>(sessionKey) != null;
}

export function useSession() {
  const query = useQuery({
    queryKey: sessionKey,
    queryFn: fetchSession,
  });
  return { ...query, isBootstrapping: query.isLoading };
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (admin) => queryClient.setQueryData(sessionKey, admin),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.setQueryData(sessionKey, null),
  });
}
