import type { ServiceTypeId } from '../../types';

export type ServiceTypeRowProps = {
  selectedId?: ServiceTypeId;
  onSelect?: (id: ServiceTypeId) => void;
  /** When true, jangan tampilkan "/kg" di kartu layanan (untuk satuan/single). */
  hideKgLabel?: boolean;
};
