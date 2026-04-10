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

export const mapOutletApiToListItem = (api: OutletApi): OutletListItem => ({
  id: api.id,
  name: api.name,
  address: api.address,
  lat: api.lat,
  lng: api.long,
  photos: api.images ?? [],
  delivery: false,
  pickup: false,
  services: CATEGORY_TO_SERVICES[api.category],
  openingHours: `${api.today_open_time}–${api.today_close_time}`,
  status: API_STATUS_TO_OUTLET[api.current_status],
});

export const outletListItemToMapMarker = (item: OutletListItem): OutletMapMarker => ({
  id: item.id,
  lat: item.lat,
  lng: item.lng,
  rating: 0,
  imageUri: item.photos[0] ?? '',
});
