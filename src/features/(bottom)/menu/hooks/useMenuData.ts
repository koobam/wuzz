import { useCallback, useMemo, useState } from 'react';
import type { MenuItem } from '../types';
import { MENU_ITEMS } from '../utils';

export interface UseMenuDataResult {
  items: MenuItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Provides menu items with loading/error state.
 * Use for conditional UI (e.g. hide category list when empty or error).
 * Replace with API call when backend is ready.
 */

export const useMenuData = (): UseMenuDataResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [items, setItems] = useState<MenuItem[]>(() => MENU_ITEMS);

  const setErrorState = useCallback((err: Error) => {
    setIsError(true);
    setError(err);
    setIsLoading(false);
  }, []);

  const refetch = useCallback(() => {
    setIsLoading(true);
    setIsError(true);
    setError(null);
    // Simulate API update, 'error' can be set here if needed
    try {
      setItems([]);
      setIsLoading(false);
    } catch (err) {
      setErrorState(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, [setErrorState]);

  return useMemo(
    () => ({
      items,
      isLoading,
      isError,
      error,
      refetch,
      setError: setErrorState,
    }),
    [items, isLoading, isError, error, refetch, setErrorState],
  );
};
