import type {
  OutletService,
  OutletStatus,
} from '@features/(outlet)/outlet-list';

export type OutletCardTagItem =
  | { type: 'distance'; id: string; label: string; distanceKm: number }
  | { type: 'status'; id: string; label: string; statusValue: OutletStatus };

export type OutletCardOutlet = {
  name?: string;
  address?: string;
  status?: OutletStatus;
  services: OutletService[];
  distanceKm?: number;
};

export type OutletCardProps = {
  onPress: () => void;
  outlet?: OutletCardOutlet;
};
