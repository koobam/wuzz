import Mapbox, { Camera, MapView } from '@rnmapbox/maps';
import { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { Box, theme } from '@components/atoms';
import type { OrderStatusMapViewProps } from './order-status-map-view.types';

const DRIVER_MARKER_SIZE = 24;
const DEST_MARKER_SIZE = 20;

const mapStyle = StyleSheet.create({
  fill: {
    flex: 1,
  },
});

export const OrderStatusMapView = memo(({ order }: OrderStatusMapViewProps) => {
  const driverCoord = useMemo(() => {
    if (order.driverLat != null && order.driverLng != null) {
      return [order.driverLng, order.driverLat] as [number, number];
    }
    return null;
  }, [order.driverLat, order.driverLng]);

  const destCoord = useMemo(() => {
    const lat = order.status === 'delivery_to_customer' ? order.customerLat : order.outletLat;
    const lng = order.status === 'delivery_to_customer' ? order.customerLng : order.outletLng;
    if (lat != null && lng != null) return [lng, lat] as [number, number];
    return null;
  }, [order.status, order.customerLat, order.customerLng, order.outletLat, order.outletLng]);

  const bounds = useMemo(() => {
    const coords: [number, number][] = [];
    if (driverCoord) coords.push(driverCoord);
    if (destCoord) coords.push(destCoord);
    if (coords.length === 0) {
      return {
        ne: [106.66, -6.2] as [number, number],
        sw: [106.64, -6.24] as [number, number],
      };
    }
    const lngs = coords.map((c) => c[0]);
    const lats = coords.map((c) => c[1]);
    const padding = 0.01;
    return {
      ne: [Math.max(...lngs) + padding, Math.max(...lats) + padding] as [number, number],
      sw: [Math.min(...lngs) - padding, Math.min(...lats) - padding] as [number, number],
    };
  }, [driverCoord, destCoord]);

  return (
    <MapView
      style={mapStyle.fill}
      styleURL={Mapbox.StyleURL.Outdoors}
      scrollEnabled
      pitchEnabled={false}
      rotateEnabled={false}
      attributionEnabled={false}
      compassEnabled={false}
      scaleBarEnabled={false}
      logoEnabled={false}
    >
      <Camera
        bounds={bounds}
        animationDuration={800}
        animationMode="easeTo"
      />
      {driverCoord != null && (
        <Mapbox.MarkerView id="driver" coordinate={driverCoord}>
          <Box
            width={DRIVER_MARKER_SIZE}
            height={DRIVER_MARKER_SIZE}
            borderRadius={DRIVER_MARKER_SIZE / 2}
            backgroundColor={theme.pallate.primary['03']}
            borderWidth={2}
            borderColor={theme.pallate.neutral['01']}
          />
        </Mapbox.MarkerView>
      )}
      {destCoord != null && (
        <Mapbox.MarkerView id="destination" coordinate={destCoord}>
          <Box
            width={DEST_MARKER_SIZE}
            height={DEST_MARKER_SIZE}
            borderRadius={DEST_MARKER_SIZE / 2}
            backgroundColor={theme.pallate.neutral['05']}
            borderWidth={2}
            borderColor={theme.pallate.neutral['01']}
          />
        </Mapbox.MarkerView>
      )}
    </MapView>
  );
});

OrderStatusMapView.displayName = 'OrderStatusMapView';
