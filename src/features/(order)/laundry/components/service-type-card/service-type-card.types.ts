import type { ServiceTypeOption } from '../../types';

export type ServiceTypeCardProps = {
  option: ServiceTypeOption;
  selected: boolean;
  onPress: () => void;
  cardWidth: number;
  /** When true, jangan tampilkan suffix "/kg" (untuk satuan/single). */
  hideKgLabel?: boolean;
};
