import type { LaundryServiceTier } from '@core/api/laundry-services.types';
import type { ServiceTypeId } from '../../types';

export type ServiceTypeRowProps = {
  /** Tiers dari API (GET /services/:id). Kalau ada, opsi dibangun dari sini. */
  tiers?: LaundryServiceTier[];
  selectedId?: ServiceTypeId;
  onSelect?: (id: ServiceTypeId) => void;
  /** When true, jangan tampilkan "/kg" di kartu layanan (untuk satuan/single). */
  hideKgLabel?: boolean;
};
