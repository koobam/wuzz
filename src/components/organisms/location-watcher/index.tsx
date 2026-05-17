import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Location } from 'iconsax-react-native';
import { Button, Text, theme, VStack, HStack, Box } from '@components/atoms';
import { useLocationState, useLocationActions } from '@services/contexts/location';
import { useLocationPermission } from '@features/(utils)/location-permission/hooks/useLocationPermission';
import { useGeolocationQuery } from '@features/(utils)/location-permission/hooks/useGeolocation';

/**
 * Renders at app root. Does two things:
 *  1. When permission flips to 'granted' while source is 'default', upgrades coords to real GPS.
 *  2. Shows a dismissible bottom sheet nudging the user to set their location.
 */
export const LocationWatcher = memo(() => {
  const { source, coords } = useLocationState();
  const { setGPSCoords, } = useLocationActions();
  const { status, requestPermission, openSettings } = useLocationPermission();
  const { bottom } = useSafeAreaInsets();


  const sheetRef = useRef<BottomSheetModal>(null);

  const permissionGranted = status === 'granted';

  // Fetch GPS whenever permission is granted — not limited to 'default' source,
  // so returning from Settings always refreshes the stored position.
  const { data: gpsCoords } = useGeolocationQuery(permissionGranted);

  // Always persist the latest GPS fix when it arrives
  useEffect(() => {
    if (gpsCoords) {
      setGPSCoords(gpsCoords);
    }
  }, [gpsCoords, setGPSCoords]);

  // Present the sheet once per session when location is still using the default
  useEffect(() => {
    if (status !== 'granted') {
      const timer = setTimeout(() => {
        sheetRef.current?.present();
      }, 600);
      return () => clearTimeout(timer);
    }
    // Dismiss automatically if location was set (e.g. GPS came in)
    if (status === 'granted') {
      sheetRef.current?.dismiss();
    }
  }, [status]);

  const handleTurnOnLocation = useCallback(async () => {
    if (status === 'blocked') {
      openSettings();
    } else {
      await requestPermission();
    }
    sheetRef.current?.dismiss();
  }, [status, requestPermission, openSettings]);

  const handleDismiss = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  return (
    <BottomSheetModal
      ref={sheetRef}
      enableDynamicSizing
      enablePanDownToClose
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={[styles.content, { paddingBottom: bottom + theme.spacing.large }]}>
        <HStack gap={theme.spacing.standard} items="center">
          <Box style={styles.iconBadge}>
            <Location size={20} variant="Bulk" color={theme.pallate.primary['03']} />
          </Box>
          <VStack fill>
            <Text type="s2" weight="semibold" color={theme.pallate.neutral['05']}>
              Location not set
            </Text>
            <Text type="b2" color={theme.pallate.neutral['04']}>
              Set your location to find the nearest outlets.
            </Text>
          </VStack>
        </HStack>

        <VStack gap={theme.spacing.small} style={styles.buttons}>
          <Button variant="primary" size="md" rounded onPress={handleTurnOnLocation}>
            <Text type="b2" weight="semibold" color={theme.pallate.neutral['01']}>
              {status === 'blocked' ? 'Open Settings' : 'Turn on location'}
            </Text>
          </Button>
          <Button variant="outline" size="md" rounded onPress={handleDismiss}>
            <Text type="b2" weight="semibold" color={theme.pallate.neutral['05']}>
              Use saved address
            </Text>
          </Button>
        </VStack>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.pallate.neutral['01'],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    backgroundColor: theme.pallate.neutral['03'],
  },
  content: {
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.large,
    gap: theme.spacing.large,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.pallate.primary['01'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttons: {
    marginTop: theme.spacing.small,
  },
});

LocationWatcher.displayName = '@organisms/location-watcher';
export default LocationWatcher;
