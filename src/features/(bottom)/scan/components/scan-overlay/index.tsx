import { Text, theme, VStack } from '@components/atoms';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

const FRAME_SIZE = 220;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderWidth: 2,
    borderColor: theme.pallate.neutral['01'],
    borderRadius: theme.spacing.standard,
  },
  labelWrapper: {
    marginTop: theme.spacing.large,
    paddingHorizontal: theme.spacing.large,
  },
  label: {
    textAlign: 'center',
  },
});

export const ScanOverlay = memo(function ScanOverlay() {
  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.frame} />
      <VStack style={styles.labelWrapper} items="center">
        <Text
          type="b2"
          color={theme.pallate.neutral['01']}
          style={styles.label}
        >
          Scan QR code pada mesin laundry
        </Text>
      </VStack>
    </View>
  );
});
