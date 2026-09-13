import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AppState as RNAppState,
  type AppStateStatus,
  useColorScheme,
} from 'react-native';
import type {
  AppStateContextValue,
  AppVisibility,
  ColorScheme,
} from './app-state.types';

const initialState: AppStateContextValue['network'] = {
  isConnected: null,
  type: undefined,
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

export interface AppStateProviderProps {
  children: React.ReactNode;
  /** Optional: set initial network (e.g. true if you assume online at start). */
  initialNetworkConnected?: boolean | null;
}

const systemColorSchemeToColorScheme = (
  scheme: ReturnType<typeof useColorScheme>,
): ColorScheme => (scheme === 'dark' ? 'dark' : 'light');

export const AppStateProvider = ({
  children,
  initialNetworkConnected = null,
}: AppStateProviderProps) => {
  const systemColorScheme = useColorScheme();
  const [network, setNetworkState] = useState<AppStateContextValue['network']>({
    ...initialState,
    isConnected: initialNetworkConnected,
  });
  const [appVisibility, setAppVisibility] = useState<AppVisibility>('active');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(() =>
    systemColorSchemeToColorScheme(systemColorScheme),
  );

  const setNetwork = useCallback((state: Partial<AppStateContextValue['network']>) => {
    setNetworkState((prev) => ({ ...prev, ...state }));
  }, []);

  const setColorScheme = useCallback((value: ColorScheme) => {
    setColorSchemeState(value);
  }, []);

  useEffect(() => {
    const subscription = RNAppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        setAppVisibility(nextState);
      },
    );
    return () => subscription.remove();
  }, []);

  const value = useMemo<AppStateContextValue>(
    () => ({
      network,
      setNetwork,
      appVisibility,
      maintenanceMode,
      setMaintenanceMode,
      globalError,
      setGlobalError,
      colorScheme,
      setColorScheme,
    }),
    [
      network,
      setNetwork,
      appVisibility,
      maintenanceMode,
      globalError,
      colorScheme,
      setColorScheme,
    ],
  );

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export const AppState = {
  Context: AppStateContext,
  Provider: AppStateProvider,
} as const;
