import Geolocation, {
  type GeolocationError,
} from '@react-native-community/geolocation';
import { useCallback, useEffect, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

export type Coordinates = { lat: number; long: number };

// Pakai fused/Play Services kalau tersedia (fallback ke provider Android). Ini
// bikin getCurrentPosition sering langsung dapat last-known location, jadi jarang
// timeout. Dipanggil sekali saat module load; aman kalau ke-run berkali-kali.
Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'whenInUse',
  locationProvider: 'auto',
});

export type CurrentLocationState = {
  /** Koordinat device; null saat belum ada / gagal. */
  coords: Coordinates | null;
  /** True saat izin sedang diminta / posisi sedang diambil. */
  isLoading: boolean;
  /**
   * True HANYA saat izin lokasi ditolak → arahkan user ke Pengaturan
   * ("Lokasi tidak aktif"). Timeout/GPS tidak dapat fix TIDAK masuk sini.
   */
  isLocationError: boolean;
  /**
   * True saat izin sudah granted tapi gagal dapat posisi (timeout / position
   * unavailable). Ini transient — tampilkan error biasa dengan tombol "Coba lagi",
   * BUKAN "aktifkan GPS".
   */
  isError: boolean;
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
 * Ambil koordinat device (izin + getCurrentPosition).
 *
 * - Izin ditolak → `isLocationError` true (arahkan ke Pengaturan).
 * - Izin granted tapi gagal dapat fix (timeout/unavailable) → `isError` true
 *   (transient, kasih tombol "Coba lagi"). Ini beda dengan "lokasi tidak aktif".
 */
export const useCurrentLocation = (): CurrentLocationState => {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocationError, setIsLocationError] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchLocation = useCallback(async () => {
    setIsLoading(true);
    setIsLocationError(false);
    setIsError(false);

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
      (error: GeolocationError) => {
        // Bedakan izin ditolak (perlu ke Pengaturan) vs timeout/unavailable
        // (transient — GPS-nya justru aktif, cukup coba lagi).
        if (error.code === error.PERMISSION_DENIED) {
          setIsLocationError(true);
        } else {
          setIsError(true);
        }
        setIsLoading(false);
      },
      // maximumAge longgar: terima cached fix s/d 1 menit → cepat & jarang timeout.
      { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 },
    );
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { coords, isLoading, isLocationError, isError, refetch: fetchLocation };
};
