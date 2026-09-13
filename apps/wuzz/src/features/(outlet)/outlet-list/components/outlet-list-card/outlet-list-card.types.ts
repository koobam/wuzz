import type { OutletService, OutletTag } from '../../types';

export type OutletListCardProps = {
  name: string;
  address: string;
  /** Distance in km for header (Row(icon, km) • address). */
  distanceKm?: number;
  /** Service types for top-right badge (coffee, laundry, or both). */
  services: OutletService[];
  photos?: string[];
  tags?: OutletTag[];
  isSelected?: boolean;
  onPress: () => void;
};
