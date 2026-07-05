import Geolocation from '@react-native-community/geolocation';
import { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export type Coordinates = { lat: number; long: number };

export type CurrentLocationState = {
  /** Koordinat device; null saat belum ada / gagal. */
  coords: Coordinates | null;
  /** True saat izin sedang diminta / posisi sedang diambil. */
  isLoading: boolean;
  /** True saat izin ditolak atau GPS gagal/mati (arahkan user ke Pengaturan). */
  isLocationError: boolean;
  /** Minta ulang izin + posisi. */
  refetch: () => void;
};

async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  // iOS: otorisasi lewat library (butuh NSLocationWhenInUseUsageDescription).
  return new Promise<boolean>((resolve) => {
    Geolocation.requestAuthorization(
      () => resolve(true),
      () => resolve(false),
    );
  });
}

/**
 * Ambil koordinat device (izin + getCurrentPosition). Kalau izin ditolak atau
 * GPS gagal, `isLocationError` true dan `coords` null — caller bisa tampilkan
 * empty state "Lokasi tidak aktif" dengan tombol ke Pengaturan.
 */
export const useCurrentLocation = (): CurrentLocationState => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocationError, setIsLocationError] = useState(false);

  const fetchLocation = useCallback(async () => {
    setIsLoading(true);
    setIsLocationError(false);

    const granted = await requestLocationPermission();
    if (!granted) {
      setIsLocationError(true);
      setIsLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
        setIsLoading(false);
      },
      () => {
        setIsLocationError(true);
        setIsLoading(false);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 10000 },
    );
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { coords, isLoading, isLocationError, refetch: fetchLocation };
};
