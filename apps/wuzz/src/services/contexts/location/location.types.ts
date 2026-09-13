import type { Coordinates } from '@features/(utils)/location-permission/hooks/useGeolocation';

/** 'gps' = real device GPS, 'default' = user skipped (fallback coords) */
export type LocationSource = 'gps' | 'default';

export interface LocationState {
  coords: Coordinates;
  source: LocationSource;
  isLoading: boolean;
}

export interface LocationActions {
  /** Save real GPS coordinates and mark source as 'gps'. */
  setGPSCoords: (coords: Coordinates) => void;
  /** Save fallback DEFAULT_COORDS and mark source as 'default'. */
  setSkipped: () => void;
  /** Wipe stored location (e.g. on logout). */
  clearLocation: () => void;
}
