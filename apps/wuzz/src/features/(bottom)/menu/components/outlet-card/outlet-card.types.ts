import type { OutletService } from '@features/(outlet)/outlet-list';

export type OutletCardProps = {
  outletName?: string;
  outletAddress?: string;
  distanceKm?: number;
  outletServices?: OutletService[];
  onOutletPress: () => void;
  /** Icon color when not using service badge (e.g. from getDistanceStyles or primary). */
  locationColor: string;
  showBadge: boolean;
};
