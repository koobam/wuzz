import type { OutletsParams } from '@api/outlets.types';
import { useFetchNearestOutlet, useFetchOutlets } from '@hooks/apis/outlets';
import { useMemo } from 'react';
import type { OutletListItem } from '../types';
import {
  mapOutletApiToListItem,
  outletListItemToMapMarker,
} from '../utils/mapOutletFromApi';

export type OutletListData = {
  outletList: OutletListItem[];
  mapMarkers: Array<{ id: number; lat: number; lng: number; rating: number; imageUri: string }>;
  mapBounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  nextCursor: string;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
};

/** Fallback lokasi saat koordinat user belum tersedia: Monas, Jakarta. */
const DEFAULT_CENTER: OutletsParams = {
  lat: -6.175392,
  long: 106.827153,
};

export const useOutletListData = (
  params?: OutletsParams | null,
): OutletListData => {
  const queryParams: OutletsParams = {
    ...(params ?? DEFAULT_CENTER),
  };

  const { data, isLoading, isError, refetch } = useFetchOutlets(queryParams);

  const outletList = useMemo(() => {
    if (!data?.outlets?.length) return [];
    return data.outlets.map(mapOutletApiToListItem);
  }, [data?.outlets]);

  const mapMarkers = useMemo(
    () => outletList.map(outletListItemToMapMarker),
    [outletList],
  );

  const mapBounds = useMemo(() => {
    if (outletList.length === 0) {
      return {
        minLat: -6.14,
        maxLat: -6.13,
        minLng: 106.49,
        maxLng: 106.51,
      };
    }
    const lats = outletList.map((o) => o.lat);
    const lngs = outletList.map((o) => o.lng);
    return {
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
    };
  }, [outletList]);

  return {
    outletList,
    mapMarkers,
    mapBounds,
    nextCursor: data?.next ?? '',
    isLoading,
    isError,
    refetch,
  };
};

export type NearestOutletData = {
  outlet: OutletListItem | null;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => void;
};

/** Single nearest outlet from GET /outlets/nearest, mapped to OutletListItem. */
export const useNearestOutlet = (
  params?: OutletsParams | null,
): NearestOutletData => {
  const queryParams = params ?? DEFAULT_CENTER;
  const { data, isLoading, isError, error, refetch } = useFetchNearestOutlet(queryParams);

  const outlet = useMemo(
    () => (data ? mapOutletApiToListItem(data) : null),
    [data],
  );

  return { outlet, isLoading, isError, error, refetch };
};
