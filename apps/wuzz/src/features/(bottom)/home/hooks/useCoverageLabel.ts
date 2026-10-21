import { useCurrentLocation } from '@hooks/utils';
import type { CurrentLocationState } from '@hooks/utils/useCurrentLocation';
import { useFetchCoverage } from '@hooks/apis/coverage';

/**
 * The area name the Home header shows ("Jakarta Barat"), worked out from the
 * device position by the backend. Every state says what is actually true — no
 * area is ever guessed when the position or the lookup is missing.
 */
export const useCoverageLabel = (): {
  label: string;
  refetch: () => void;
  /** The device position state this label was worked out from. */
  location: CurrentLocationState;
} => {
  const location = useCurrentLocation();
  const coverage = useFetchCoverage(location.coords);

  const refetch = () => {
    location.refetch();
    coverage.refetch();
  };

  if (location.isLocationError)
    return { label: 'Aktifkan lokasi', refetch, location };
  if (location.isError)
    return { label: 'Lokasi tidak ditemukan', refetch, location };
  if (location.isLoading || (location.coords != null && coverage.isLoading)) {
    return { label: 'Mencari lokasi…', refetch, location };
  }
  if (location.coords == null)
    return { label: 'Lokasi tidak tersedia', refetch, location };
  if (coverage.isError)
    return { label: 'Gagal memuat area', refetch, location };
  if (coverage.data?.covered && coverage.data.area) {
    return { label: coverage.data.area.name, refetch, location };
  }
  return { label: 'Di luar area layanan', refetch, location };
};
