/** Global app state shared across the app. */

import type { AppStateStatus } from 'react-native';

/** Matches React Native AppState status (active, background, inactive, unknown, extension, etc.). */
export type AppVisibility = AppStateStatus;

export type ColorScheme = 'light' | 'dark';

export interface NetworkState {
  /** true = online, false = offline, null = unknown (not yet determined). */
  isConnected: boolean | null;
  /** Connection type when available (e.g. 'wifi', 'cellular'). */
  type?: string;
}

export interface AppStateContextValue {
  /** Current network connectivity. Update via setNetwork or wire to @react-native-community/netinfo. */
  network: NetworkState;
  /** Set network state (e.g. from NetInfo listener or API interceptor). */
  setNetwork: (state: Partial<NetworkState>) => void;

  /** App in foreground ('active'), background, or inactive. */
  appVisibility: AppVisibility;

  /** Optional: global maintenance mode to show a banner or block actions. */
  maintenanceMode: boolean;
  setMaintenanceMode: (value: boolean) => void;

  /** Optional: global error message to show once (e.g. "Session expired"). */
  globalError: string | null;
  setGlobalError: (message: string | null) => void;

  /** Dark mode / color scheme. */
  colorScheme: ColorScheme;
  setColorScheme: (value: ColorScheme) => void;
}

/** Read-only app state (use with useAppState to avoid re-renders from action refs). */
export type AppStateState = Pick<
  AppStateContextValue,
  'network' | 'appVisibility' | 'maintenanceMode' | 'globalError' | 'colorScheme'
>;

/** App state actions/setters only (use with useAppAction for stable refs, fewer re-renders). */
export type AppStateAction = Pick<
  AppStateContextValue,
  'setNetwork' | 'setMaintenanceMode' | 'setGlobalError' | 'setColorScheme'
>;
