import { focusManager, onlineManager } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAppState } from '@services/hooks/utils/useAppState';

/**
 * Syncs app state (visibility + network) to React Query's focusManager and onlineManager
 * so refetchOnWindowFocus and refetchOnReconnect work correctly.
 * Must be rendered inside both AppStateProvider and QueryClientProvider.
 */
export const QuerySyncWithAppState = () => {
  const { appVisibility, network } = useAppState();

  useEffect(() => {
    focusManager.setFocused(appVisibility === 'active');
  }, [appVisibility]);

  useEffect(() => {
    onlineManager.setOnline(network.isConnected ?? true);
  }, [network.isConnected]);

  return null;
};
