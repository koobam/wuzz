import { theme } from '@components/atoms';
import type { OutletListItem, OutletStatus, OutletTag, ServiceFilter } from '../types';

/** < 5km = primary, 5–10km = secondary, > 10km = danger. Background + icon/text. */
export const getDistanceStyles = (
  distanceKm: number,
): { backgroundColor: string; color: string } => {
  if (distanceKm < 5) {
    return {
      backgroundColor: theme.pallate.primary['01'],
      color: theme.pallate.primary['03'],
    };
  }
  if (distanceKm <= 10) {
    return {
      backgroundColor: theme.pallate.secondary['01'],
      color: theme.pallate.secondary['03'],
    };
  }
  return {
    backgroundColor: theme.pallate.danger['01'],
    color: theme.pallate.danger['03'],
  };
};

/** e.g. "2.5 km" */
export const formatDistanceKm = (distanceKm: number): string =>
  `${distanceKm % 1 === 0 ? distanceKm : distanceKm.toFixed(1)} km`;

export const getServiceFilterLabel = (filter: ServiceFilter): string => {
  if (filter === 'all') return 'All';
  if (filter === 'coffee') return 'Coffee';
  return 'Laundry';
};

export const getServiceFilterPillStyle = (
  filter: ServiceFilter,
  isActive: boolean,
): { backgroundColor: string; color: string } => {
  const color = isActive ? theme.pallate.neutral['01'] : theme.pallate.neutral['05'];
  if (!isActive) {
    return { backgroundColor: theme.pallate.neutral['02'], color };
  }
  if (filter === 'all') {
    return { backgroundColor: theme.pallate.primary['01'], color: theme.pallate.primary['03'] };
  }
  if (filter === 'coffee') {
    return { backgroundColor: theme.pallate.coffee['01'], color: theme.pallate.coffee['03'] };
  }
  return { backgroundColor: theme.pallate.teal['01'], color: theme.pallate.teal['03'] };
};

/** Ramai = danger, Sedang = secondary, Sepi = success. Same pattern as distance. */
export const getStatusStyles = (
  status: OutletStatus,
): { backgroundColor: string; color: string } => {
  if (status === 'ramai')
    return {
      backgroundColor: theme.pallate.danger['01'],
      color: theme.pallate.danger['03'],
    };
  if (status === 'sedang')
    return {
      backgroundColor: theme.pallate.secondary['01'],
      color: theme.pallate.secondary['03'],
    };
  // sepi
  return {
    backgroundColor: theme.pallate.success['01'],
    color: theme.pallate.success['03'],
  };
};

export const getOutletTags = (outlet: OutletListItem): OutletTag[] => {
  const tags: OutletTag[] = [];
  if (outlet.status) {
    const statusLabel =
      outlet.status === 'ramai'
        ? 'Ramai'
        : outlet.status === 'sedang'
          ? 'Sedang'
          : 'Sepi';
    tags.push({
      kind: 'status',
      label: statusLabel,
      statusValue: outlet.status,
    });
  }
  if (outlet.delivery && outlet.pickup) {
    tags.push({ kind: 'delivery_pickup', label: 'Delivery • Pickup' });
  } else if (outlet.delivery) {
    tags.push({ kind: 'delivery', label: 'Delivery' });
  } else if (outlet.pickup) {
    tags.push({ kind: 'pickup', label: 'Pickup' });
  }
  if (outlet.openingHours)
    tags.push({ kind: 'hours', label: outlet.openingHours });
  return tags;
};
