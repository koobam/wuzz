import { useQuery } from '@tanstack/react-query';
import { outlets } from '@api/outlets';
import type { OutletApi } from '@core/api/outlets.types';
import type { Coordinates } from './useGeolocation';

export const useNearestOutletQuery = (coords: Coordinates | null | undefined) =>
  useQuery<OutletApi | null>({
    queryKey: ['nearestOutlet', coords ? { lat: coords.lat, long: coords.long } : null],
    queryFn: () =>
      outlets({ lat: coords!.lat, long: coords!.long, num: 1 }).then(
        (r) => r.data?.outlets?.[0] ?? null,
      ),
    enabled: !!coords,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
  });
