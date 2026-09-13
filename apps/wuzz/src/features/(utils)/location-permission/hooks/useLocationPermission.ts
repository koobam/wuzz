import { useCallback } from 'react';
import { Linking, Platform } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  type PermissionStatus,
} from 'react-native-permissions';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const LOCATION_PERMISSION =
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

export type LocationPermissionStatus =
  | 'checking'
  | 'granted'
  | 'denied'
  | 'blocked';

const mapResult = (result: PermissionStatus): Exclude<LocationPermissionStatus, 'checking'> => {
  switch (result) {
    case RESULTS.GRANTED:
      return 'granted';
    case RESULTS.BLOCKED:
      return 'blocked';
    default:
      return 'denied';
  }
};

export const LOCATION_PERMISSION_QUERY_KEY = ['locationPermission'];

export const useLocationPermission = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: LOCATION_PERMISSION_QUERY_KEY,
    queryFn: () => check(LOCATION_PERMISSION).then(mapResult),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true, // re-checks when user returns from Settings
    refetchOnReconnect: false,
  });

  const status: LocationPermissionStatus = data ?? 'checking';

  const requestPermission = useCallback(async () => {
    const result = await request(LOCATION_PERMISSION);
    const mapped = mapResult(result);
    queryClient.setQueryData(LOCATION_PERMISSION_QUERY_KEY, mapped);
    return mapped;
  }, [queryClient]);

  const openSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  return { status, requestPermission, openSettings };
};
