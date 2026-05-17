import { createContext, useContext } from 'react';
import type { LocationState, LocationActions } from './location.types';
import { DEFAULT_COORDS } from '@core/location/defaults';

export const LocationStateContext = createContext<LocationState>({
  coords: DEFAULT_COORDS,
  source: 'default',
  isLoading: true,
});

export const LocationActionsContext = createContext<LocationActions>({
  setGPSCoords: () => {},
  setSkipped: () => {},
  clearLocation: () => {},
});

export const useLocationState = () => useContext(LocationStateContext);
export const useLocationActions = () => useContext(LocationActionsContext);
