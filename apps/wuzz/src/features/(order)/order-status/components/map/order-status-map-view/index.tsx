import { memo, useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Box, theme } from '@components/atoms';
import type { OrderStatusMapViewProps } from './order-status-map-view.types';

const DRIVER_MARKER_SIZE = 24;
const DEST_MARKER_SIZE = 20;

const mapStyle = StyleSheet.create({
  fill: {
    flex: 1,
  },
});

const DEFAULT_REGION = {
  latitude: -6.22,
  longitude: 106.65,
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

const FIT_EDGE_PADDING = { top: 60, right: 60, bottom: 60, left: 60 };

export const OrderStatusMapView = memo(({ order }: OrderStatusMapViewProps) => {
  const mapRef = useRef<MapView>(null);

  const driverCoord = useMemo(() => {
    if (order.driverLat != null && order.driverLng != null) {
      return { latitude: order.driverLat, longitude: order.driverLng };
    }
    return null;
  }, [order.driverLat, order.driverLng]);

  const destCoord = useMemo(() => {
    const lat = order.status === 'delivery_to_customer' ? order.customerLat : order.outletLat;
    const lng = order.status === 'delivery_to_customer' ? order.customerLng : order.outletLng;
    if (lat != null && lng != null) return { latitude: lat, longitude: lng };
    return null;
  }, [order.status, order.customerLat, order.customerLng, order.outletLat, order.outletLng]);

  const points = useMemo(() => {
    const coords: { latitude: number; longitude: number }[] = [];
    if (driverCoord) coords.push(driverCoord);
    if (destCoord) coords.push(destCoord);
    return coords;
  }, [driverCoord, destCoord]);

  useEffect(() => {
    if (points.length === 0) return;
    mapRef.current?.fitToCoordinates(points, {
      edgePadding: FIT_EDGE_PADDING,
      animated: true,
    });
  }, [points]);

  return (
    <MapView
      ref={mapRef}
      style={mapStyle.fill}
      initialRegion={DEFAULT_REGION}
      scrollEnabled
      pitchEnabled={false}
      rotateEnabled={false}
      showsCompass={false}
      toolbarEnabled={false}
    >
      {driverCoord != null && (
        <Marker coordinate={driverCoord} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
          <Box
            width={DRIVER_MARKER_SIZE}
            height={DRIVER_MARKER_SIZE}
            borderRadius={DRIVER_MARKER_SIZE / 2}
            backgroundColor={theme.pallate.primary['03']}
            borderWidth={2}
            borderColor={theme.pallate.neutral['01']}
          />
        </Marker>
      )}
      {destCoord != null && (
        <Marker coordinate={destCoord} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
          <Box
            width={DEST_MARKER_SIZE}
            height={DEST_MARKER_SIZE}
            borderRadius={DEST_MARKER_SIZE / 2}
            backgroundColor={theme.pallate.neutral['05']}
            borderWidth={2}
            borderColor={theme.pallate.neutral['01']}
          />
        </Marker>
      )}
    </MapView>
  );
});

OrderStatusMapView.displayName = 'OrderStatusMapView';
