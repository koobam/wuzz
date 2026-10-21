import type { OutletService, OutletStatus } from '@features/(outlet)/outlet-list';
import type { SharedValue } from 'react-native-reanimated';

export type MenuHeaderProps = {
  topInset: number;
  /** Label for delivery/pickup location (e.g. "Home", "Office"). When not set, shows "Near you · Tap to choose address". */
  deliveryLocationLabel?: string;
  outletName?: string;
  outletAddress?: string;
  /** Distance from user in km. Shown next to address when set. */
  distanceKm?: number;
  outletStatus?: OutletStatus;
  outletServices?: OutletService[];
  onOutletPress: () => void;
  onSearchPress?: () => void;
  /** When provided (0 = visible, 1 = collapsed), outlet section animates by scroll distance. */
  collapseProgress?: SharedValue<number>;
};
