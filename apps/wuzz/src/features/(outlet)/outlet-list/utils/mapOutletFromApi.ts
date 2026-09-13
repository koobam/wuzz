import type { OutletApi } from '@api/outlets.types';
import type { OutletListItem, OutletMapMarker, OutletStatus, OutletService } from '../types';

const API_STATUS_TO_OUTLET: Record<OutletApi['current_status'], OutletStatus> = {
  busy: 'ramai',
  moderate: 'sedang',
  quiet: 'sepi',
};

const CATEGORY_TO_SERVICES: Record<OutletApi['category'], OutletService[]> = {
  laundry: ['laundry'],
  caffe: ['coffee'],
  all: ['laundry', 'coffee'],
};

/** "0000-01-01T08:00:00Z" → "08:00". Diambil literal (wall-clock), tanpa konversi timezone. */
const formatOutletTime = (raw?: string): string | null => {
  if (!raw) return null;
  const match = raw.match(/T(\d{2}:\d{2})/);
  return match ? match[1] : null;
};

/** Jam buka dari API `hours` [open, close] → "08:00–22:00" (atau '' kalau tak ada). */
const getOpeningHours = (hours?: OutletApi['hours']): string => {
  if (!hours || hours.length < 2) return '';
  const open = formatOutletTime(hours[0]);
  const close = formatOutletTime(hours[1]);
  return open && close ? `${open}–${close}` : '';
};

export const mapOutletApiToListItem = (api: OutletApi): OutletListItem => ({
  id: api.id,
  name: api.name,
  address: api.address,
  lat: api.lat ?? 0,
  lng: api.long ?? 0,
  distance_in_km: api.distance_in_km,
  photos: api.images ?? [],
  delivery: api.delivery_types?.includes('delivery') ?? false,
  pickup: api.delivery_types?.includes('pickup') ?? false,
  services: CATEGORY_TO_SERVICES[api.category],
  openingHours: getOpeningHours(api.hours),
  status: API_STATUS_TO_OUTLET[api.current_status],
});

export const outletListItemToMapMarker = (item: OutletListItem): OutletMapMarker => ({
  id: item.id,
  lat: item.lat,
  lng: item.lng,
  rating: 0,
  imageUri: item.photos[0] ?? '',
});
