import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MMKV } from 'react-native-mmkv';
import { LocationStateContext, LocationActionsContext } from './location.context';
import type { LocationSource } from './location.types';
import type { Coordinates } from '@features/(utils)/location-permission/hooks/useGeolocation';
import { DEFAULT_COORDS } from '@core/location/defaults';

const storage = new MMKV({ id: 'location.storage' });

const KEYS = {
  COORDS: 'location.coords',
  SOURCE: 'location.source',
} as const;

const loadStoredCoords = (): Coordinates | null => {
  const raw = storage.getString(KEYS.COORDS);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

const loadStoredSource = (): LocationSource | null => {
  const raw = storage.getString(KEYS.SOURCE);
  return raw === 'gps' || raw === 'default' ? raw : null;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coords, setCoords] = useState<Coordinates>(DEFAULT_COORDS);
  const [source, setSource] = useState<LocationSource>('default');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedCoords = loadStoredCoords();
    const storedSource = loadStoredSource();
    if (storedCoords && storedSource) {
      setCoords(storedCoords);
      setSource(storedSource);
    }
    setIsLoading(false);
  }, []);

  const setGPSCoords = useCallback((newCoords: Coordinates) => {
    setCoords(newCoords);
    setSource('gps');
    storage.set(KEYS.COORDS, JSON.stringify(newCoords));
    storage.set(KEYS.SOURCE, 'gps');
  }, []);

  const setSkipped = useCallback(() => {
    setCoords(DEFAULT_COORDS);
    setSource('default');
    storage.set(KEYS.COORDS, JSON.stringify(DEFAULT_COORDS));
    storage.set(KEYS.SOURCE, 'default');
  }, []);

  const clearLocation = useCallback(() => {
    setCoords(DEFAULT_COORDS);
    setSource('default');
    storage.delete(KEYS.COORDS);
    storage.delete(KEYS.SOURCE);
  }, []);

  const stateValue = useMemo(
    () => ({ coords, source, isLoading }),
    [coords, source, isLoading],
  );

  const actionsValue = useMemo(
    () => ({ setGPSCoords, setSkipped, clearLocation }),
    [setGPSCoords, setSkipped, clearLocation],
  );

  return (
    <LocationStateContext.Provider value={stateValue}>
      <LocationActionsContext.Provider value={actionsValue}>
        {children}
      </LocationActionsContext.Provider>
    </LocationStateContext.Provider>
  );
};
