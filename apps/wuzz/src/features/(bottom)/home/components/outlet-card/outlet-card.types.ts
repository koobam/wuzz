import type {
  OutletService,
  OutletStatus,
} from '@features/(outlet)/outlet-list';

export type DeliveryType = 'pickup' | 'delivery' | string;

export type OutletCardTagItem =
  | { type: 'distance'; id: string; label: string; distanceKm: number }
  | { type: 'status'; id: string; label: string; statusValue: OutletStatus }
  | { type: 'delivery-type'; id: string; deliveryTypes: DeliveryType[] };

export type OutletCardOutlet = {
  name?: string;
  address?: string;
  status?: OutletStatus;
  services: OutletService[];
  distanceKm?: number;
  deliveryTypes?: string[];
  /** [openTime, closeTime] as ISO strings e.g. "0000-01-01T08:00:00Z" */
  hours?: [string, string];
};

export type OutletCardProps = {
  onPress: () => void;
  outlet?: OutletCardOutlet;
  /** True saat nearest outlet masih dimuat. */
  isLoading?: boolean;
  /** True saat gagal memuat nearest outlet (error server/jaringan). */
  isError?: boolean;
  /** Error object dari query; dipakai untuk membedakan pesan network vs lainnya. */
  error?: unknown;
  /** True saat masalah lokasi/GPS (izin ditolak / GPS mati). Tombol mengarah ke Pengaturan. */
  isLocationError?: boolean;
  /** Dipanggil saat user menekan "Coba lagi" pada empty/error state. */
  onRefresh?: () => void;
};
