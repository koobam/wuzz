import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useSyncExternalStore } from 'react';
import { loadCatalog } from './catalog';
import { listOrders, onOrdersChanged } from './outbox';

const subscribeOnline = (cb: () => void) => {
  window.addEventListener('online', cb);
  window.addEventListener('offline', cb);
  return () => {
    window.removeEventListener('online', cb);
    window.removeEventListener('offline', cb);
  };
};

export function useOnline() {
  return useSyncExternalStore(subscribeOnline, () => navigator.onLine, () => true);
}

export function useCatalog() {
  return useQuery({ queryKey: ['pos', 'catalog'], queryFn: loadCatalog, staleTime: 5 * 60_000 });
}

export function useOrders() {
  const queryClient = useQueryClient();
  useEffect(
    () => onOrdersChanged(() => void queryClient.invalidateQueries({ queryKey: ['pos', 'orders'] })),
    [queryClient],
  );
  return useQuery({ queryKey: ['pos', 'orders'], queryFn: listOrders, staleTime: 0 });
}
