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
  isError?: boolean;
  isLoading?: boolean;
  error?: Error;
};
