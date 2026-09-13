import Geolocation from '@react-native-community/geolocation';
import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { useQuery } from '@tanstack/react-query';

export type Coordinates = {
  lat: number;
  long: number;
};

const getCurrentPositionAsync = (): Promise<Coordinates> =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position) =>
        resolve({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        }),
      reject,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  });

export const geolocationQueryKeys = createQueryKeyStore({
  geolocation: {
    current: () => ({
      queryKey: ['geolocation', 'current'],
      queryFn: getCurrentPositionAsync,
    }),
  },
});

export const useGeolocationQuery = (enabled = true) =>
  useQuery({
    ...geolocationQueryKeys.geolocation.current(),
    enabled,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: false,
    retry: 1,
  });
