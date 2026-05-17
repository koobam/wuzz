import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useAnimatedReaction,
  scrollTo,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { Text } from '../text';
import theme from '../theme';

export const ITEM_HEIGHT = 52;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);
const HALF = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

interface WheelPickerItemProps {
  item: string;
  index: number;
  scrollY: SharedValue<number>;
}

const WheelPickerItem = React.memo(
  ({ item, index, scrollY }: WheelPickerItemProps) => {
    const animatedStyle = useAnimatedStyle(() => {
      const distance = Math.abs(scrollY.value / ITEM_HEIGHT - index);
      const opacity = interpolate(
        distance,
        [0, 1, 2],
        [1, 0.45, 0.2],
        Extrapolation.CLAMP,
      );
      const scale = interpolate(
        distance,
        [0, 1, 2],
        [1.08, 0.94, 0.88],
        Extrapolation.CLAMP,
      );
      return { opacity, transform: [{ scale }] };
    });

    return (
      <Animated.View style={[styles.item, animatedStyle]}>
        <Text type="b1" weight="semibold" color={theme.pallate.neutral['05']}>
          {item}
        </Text>
      </Animated.View>
    );
  },
);

WheelPickerItem.displayName = 'WheelPickerItem';

interface WheelPickerProps {
  items: string[];
  selectedIndex: number;
  onIndexChange: (index: number) => void;
  width: number;
  overlayColor?: string;
}

export const WheelPicker = ({
  items,
  selectedIndex,
  onIndexChange,
  width,
  overlayColor = theme.pallate.neutral['01'],
}: WheelPickerProps) => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(selectedIndex * ITEM_HEIGHT);
  const lastHapticIndex = useSharedValue(selectedIndex);
  const isScrolling = useSharedValue(false);

  const selectedIndexSV = useSharedValue(selectedIndex);
  useEffect(() => {
    selectedIndexSV.value = selectedIndex;
  }, [selectedIndex, selectedIndexSV]);

  useAnimatedReaction(
    () => selectedIndexSV.value,
    (current, previous) => {
      if (current !== previous && !isScrolling.value) {
        scrollTo(scrollRef, 0, current * ITEM_HEIGHT, false);
      }
    },
  );

  // Stable mutable refs so commitFromY never captures a stale closure
  const itemsLengthRef = useRef(items.length);
  itemsLengthRef.current = items.length;
  const onIndexChangeRef = useRef(onIndexChange);
  onIndexChangeRef.current = onIndexChange;

  const triggerHaptic = useCallback(() => {
    ReactNativeHapticFeedback.trigger('selection', { enableVibrateFallback: false });
  }, []);

  const commitFromY = useCallback(
    (y: number) => {
      const index = Math.round(y / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(index, itemsLengthRef.current - 1));
      isScrolling.value = false;
      onIndexChangeRef.current(clamped);
    },
    [isScrolling],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      const currentIndex = Math.round(event.contentOffset.y / ITEM_HEIGHT);
      if (currentIndex !== lastHapticIndex.value) {
        lastHapticIndex.value = currentIndex;
        scheduleOnRN(triggerHaptic);
      }
    },
    onBeginDrag: () => {
      isScrolling.value = true; // UI thread directly — no runOnJS needed
    },
    onMomentumEnd: (event) => {
      scheduleOnRN(commitFromY, event.contentOffset.y);
    },
  });

  return (
    <View style={[styles.container, { width }]}>
      <Animated.ScrollView
        ref={scrollRef}
        accessible={false}
        onScroll={scrollHandler}
        contentOffset={{ x: 0, y: selectedIndex * ITEM_HEIGHT }}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingVertical: PADDING }}
      >
        {items.map((item, index) => (
          <WheelPickerItem
            key={`${item}-${index}`}
            item={item}
            index={index}
            scrollY={scrollY}
          />
        ))}
      </Animated.ScrollView>

      <View
        pointerEvents="none"
        style={[styles.overlay, styles.overlayTop, { backgroundColor: overlayColor }]}
      />
      <View
        pointerEvents="none"
        style={[styles.overlay, styles.overlayBottom, { backgroundColor: overlayColor }]}
      />

      <View pointerEvents="none" style={styles.selectionWindow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: PICKER_HEIGHT,
    overflow: 'hidden',
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: HALF,
    opacity: 0.78,
  },
  overlayTop: {
    top: 0,
  },
  overlayBottom: {
    bottom: 0,
  },
  selectionWindow: {
    position: 'absolute',
    left: 4,
    right: 4,
    top: HALF,
    height: ITEM_HEIGHT,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: theme.pallate.neutral['03'],
  },
});
