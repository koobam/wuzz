export type OutletService = 'coffee' | 'laundry';

export type ServiceFilter = 'all' | 'coffee' | 'laundry';

export type OutletStatus = 'busy' | 'moderate' | 'quiet';

export type OutletTagKind =
  | 'distance'
  | 'delivery'
  | 'pickup'
  | 'delivery_pickup'
  | 'hours'
  | 'status';

export type OutletTag = {
  kind: OutletTagKind;
  label: string;
  /** Set when kind is 'distance'. Used for color (< 5km okay, > 10km red). */
  distanceKm?: number;
  /** Set when kind is 'status'. */
  statusValue?: OutletStatus;
};

export type OutletListItem = {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  /** Distance from user in km. Used for color-coded display (< 5km okay, > 10km red). */
  distanceKm?: number;
  /** Outlet crowd status for tag row. */
  status?: OutletStatus;
  photos: string[];
  delivery: boolean;
  pickup: boolean;
  services: OutletService[];
  openingHours: string;
};

export type OutletMapMarker = {
  id: number;
  lat: number;
  lng: number;
  rating: number;
  imageUri: string;
};
