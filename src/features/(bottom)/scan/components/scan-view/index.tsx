import { Pressable, Text, theme, VStack } from '@components/atoms';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import {
  Camera,
  useCameraDevice,
} from 'react-native-vision-camera';
import { ScanOverlay } from '../scan-overlay';
import type { ScanViewProps } from './scan-view.types';

export type { ScanViewProps } from './scan-view.types';

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  permissionWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.large,
  },
  permissionMessage: {
    textAlign: 'center',
    marginBottom: theme.spacing.large,
  },
});

export const ScanView = memo(function ScanView({
  hasPermission,
  onRequestPermission,
  codeScanner,
  isActive = true,
}: ScanViewProps) {
  const device = useCameraDevice('back');

  if (hasPermission === false) {
    return (
      <VStack fill style={styles.permissionWrapper}>
        <Text
          type="l1"
          color={theme.pallate.neutral['04']}
          style={styles.permissionMessage}
        >
          Camera access is needed to scan QR codes. Please allow in settings or
          tap Retry.
        </Text>
        <Pressable
          onPress={onRequestPermission}
          padding={{
            paddingVertical: theme.spacing.standard,
            paddingHorizontal: theme.spacing.large,
          }}
          borderRadius={999}
          backgroundColor={theme.pallate.primary['03']}
        >
          <Text type="b2" weight="bold" color={theme.pallate.neutral['01']}>
            Retry
          </Text>
        </Pressable>
      </VStack>
    );
  }

  if (device == null) {
    return (
      <VStack fill style={styles.permissionWrapper}>
        <Text type="l1" color={theme.pallate.neutral['04']} style={styles.permissionMessage}>
          No camera device found.
        </Text>
      </VStack>
    );
  }

  return (
    <VStack fill style={styles.fill}>
      <Camera
        style={styles.camera}
        device={device}
        isActive={isActive}
        codeScanner={codeScanner}
      />
      <ScanOverlay />
    </VStack>
  );
});
