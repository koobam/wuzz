import { Text, theme } from '@components/atoms';
import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

type LocationPickerPinProps = {
  tooltip?: string;
  /** Sebelum peta digeser: tampilkan tooltip + animasi pin naik-turun. */
  active?: boolean;
  /** Sedang digeser: kepala + garis terangkat naik, titik anchor tetap. */
  lifted?: boolean;
};

const DOT_SIZE = 12;
const STEM_HEIGHT = 24;
const HEAD_SIZE = 40;
const LIFT_AMOUNT = 6;

const TT_ARROW = 24; // sisi kotak panah (diputar 45°)
const TT_FILL = 'rgba(20, 20, 22, 0.95)';
// Lebar area tooltip (ditengahkan pada anchor) → ruang ukur teks.
const STACK_WIDTH = 320;

/**
 * Gelembung tooltip: badan rounded + panah (kotak diputar 45° dengan border di
 * dua sisi) sehingga border putih menyatu dengan badan. Semua RN → pasti render.
 */
function TooltipBubble({ label }: { label: string }) {
  return (
    <View style={styles.bubble}>
      <Text
        type="l1"
        weight="medium"
        align="center"
        numberOfLines={2}
        color={theme.pallate.neutral['01']}
        style={styles.bubbleText}
      >
        Geser map untuk memindahkan lokasi
      </Text>
      {/* Panah: kotak diputar 45°, border di sisi bawah+kanan → ujung ∨ */}
      <View style={styles.tailWrap} pointerEvents="none">
        <View style={styles.tail} />
      </View>
    </View>
  );
}

/**
 * Marker pemilih lokasi: tooltip → kepala bulat → garis → titik kecil di bawah.
 * Titik kecil (ground dot) adalah anchor: satu-satunya elemen di flow, sehingga
 * saat wrapper di-center, titik itu tepat di pusat area peta yang terlihat.
 * Saat `active`, bagian atas (tooltip+kepala+garis) mengambang naik-turun; titik
 * tetap diam sebagai anchor.
 */
export const LocationPickerPin = memo(function LocationPickerPin({
  tooltip = 'Geser peta untuk menentukan lokasi',
  active = true,
  lifted = false,
}: LocationPickerPinProps) {
  const lift = useSharedValue(0);
  const pinLift = useSharedValue(0);

  useEffect(() => {
    pinLift.value = withSpring(lifted ? -LIFT_AMOUNT : 0, {
      damping: 14,
      stiffness: 180,
    });
  }, [lifted, pinLift]);

  const pinBodyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: pinLift.value }],
  }));

  useEffect(() => {
    if (active) {
      lift.value = withRepeat(
        withSequence(
          withTiming(-6, { duration: 650, easing: Easing.inOut(Easing.quad) }),
          withTiming(0, { duration: 650, easing: Easing.inOut(Easing.quad) }),
        ),
        -1,
        false,
      );
    } else {
      cancelAnimation(lift);
      lift.value = withTiming(0, { duration: 150 });
    }
    return () => cancelAnimation(lift);
  }, [active, lift]);

  const stackStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value }],
  }));

  return (
    <View style={styles.wrapper}>
      {/* Tooltip + kepala + garis, tersusun di atas titik. Kepala & garis diam;
          hanya tooltip yang mengambang saat active. */}
      <View style={styles.stack} pointerEvents="none">
        {active && (
          <Animated.View style={[styles.tooltipWrap, stackStyle]}>
            <TooltipBubble label={tooltip} />
          </Animated.View>
        )}
        <Animated.View style={[styles.pinBody, pinBodyStyle]}>
          <View style={styles.head}>
            <View style={styles.headInner} />
          </View>
          <View style={styles.stem} />
        </Animated.View>
      </View>

      {/* Ground dot: anchor yang di-center ke titik peta (diam) */}
      <View style={styles.dot} />
    </View>
  );
});

LocationPickerPin.displayName = 'LocationPickerPin';

const styles = StyleSheet.create({
  wrapper: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stack: {
    position: 'absolute',
    bottom: DOT_SIZE,
    // Lebar besar & ditengahkan pada anchor (12px) supaya teks tooltip punya
    // ruang ukur (kalau mengikuti lebar anchor, teks ke-wrap jadi kosong).
    width: STACK_WIDTH,
    left: (DOT_SIZE - STACK_WIDTH) / 2,
    alignItems: 'center',
  },
  tooltipWrap: {
    alignItems: 'center',
  },
  pinBody: {
    alignItems: 'center',
  },
  bubble: {
    maxWidth: 200,
    paddingHorizontal: theme.spacing.standard,
    paddingVertical: theme.spacing.standard,
    borderRadius: 12,
    backgroundColor: TT_FILL,
    borderWidth: 2,
    borderColor: theme.pallate.neutral['01'],
    // ruang untuk ujung panah di bawah
    marginBottom: TT_ARROW,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  bubbleText: {
    maxWidth: 200,
  },
  tailWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -TT_ARROW / 2 - 1,
    alignItems: 'center',
  },
  tail: {
    width: TT_ARROW,
    height: TT_ARROW,
    backgroundColor: TT_FILL,
    borderColor: theme.pallate.neutral['01'],
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderBottomRightRadius: 3,
    transform: [{ rotate: '45deg' }],
  },
  head: {
    width: HEAD_SIZE,
    height: HEAD_SIZE,
    elevation: 1,
    borderRadius: HEAD_SIZE / 2,
    backgroundColor: theme.pallate.secondary['03'],
    borderWidth: 4,
    borderColor: theme.pallate.neutral['01'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headInner: {
    width: HEAD_SIZE / 3,
    height: HEAD_SIZE / 3,
    borderRadius: HEAD_SIZE / 6,
    backgroundColor: theme.pallate.neutral['01'],
  },
  stem: {
    width: 2,
    height: STEM_HEIGHT,
    backgroundColor: theme.pallate.neutral['05'],
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: theme.pallate.neutral['05'],
    borderWidth: 2,
    borderColor: theme.pallate.neutral['01'],
  },
});
