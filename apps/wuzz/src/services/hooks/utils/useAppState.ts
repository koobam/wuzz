import type {
  AppStateAction,
  AppStateState,
} from '@services/contexts/app-state';
import { AppState } from '@services/contexts/app-state';
import { useContext } from 'react';

const getContext = () => {
  const context = useContext(AppState.Context);
  if (!context) {
    throw new Error('useAppState / useAppAction must be used within an AppStateProvider');
  }
  return context;
};

/** Returns read-only app state. Use when you only need to read state. */
export const useAppState = (): AppStateState => {
  const ctx = getContext();
  return {
    network: ctx.network,
    appVisibility: ctx.appVisibility,
    maintenanceMode: ctx.maintenanceMode,
    globalError: ctx.globalError,
    colorScheme: ctx.colorScheme,
  };
};

/** Returns app state actions (setters) only. Stable refs, use when you only need to dispatch. */
export const useAppAction = (): AppStateAction => {
  const ctx = getContext();
  return {
    setNetwork: ctx.setNetwork,
    setMaintenanceMode: ctx.setMaintenanceMode,
    setGlobalError: ctx.setGlobalError,
    setColorScheme: ctx.setColorScheme,
  };
};
