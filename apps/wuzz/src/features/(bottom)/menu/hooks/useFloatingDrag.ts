import { Dimensions } from 'react-native';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { useMemo } from 'react';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const SNAP_SPRING_CONFIG = {
  damping: 20,
  stiffness: 220,
  mass: 0.8,
};

export interface UseFloatingDragOptions {
  boxWidth?: number;
  boxHeight?: number;
  edgeMargin?: number;
  initialX?: number;
  initialY?: number;
  minY?: number;
  maxY?: number;
}

export interface UseFloatingDragResult {
  panGesture: ReturnType<typeof Gesture.Pan>;
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
}

export function useFloatingDrag({
  boxWidth = 56,
  boxHeight = 56,
  edgeMargin = 16,
  initialX = SCREEN_WIDTH - 56 - 16,
  initialY = SCREEN_HEIGHT * 0.65,
  minY = 0,
  maxY = SCREEN_HEIGHT - 80,
}: UseFloatingDragOptions = {}): UseFloatingDragResult {
  const posX = useSharedValue(initialX);
  const posY = useSharedValue(initialY);

  const startX = useSharedValue(initialX);
  const startY = useSharedValue(initialY);

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(() => {
          startX.value = posX.value;
          startY.value = posY.value;
        })
        .onChange((e) => {
          posX.value = startX.value + e.translationX;
          posY.value = Math.max(
            minY,
            Math.min(maxY - boxHeight, startY.value + e.translationY),
          );
        })
        .onEnd(() => {
          const centerX = posX.value + boxWidth / 2;
          const snapX =
            centerX < SCREEN_WIDTH / 2
              ? edgeMargin
              : SCREEN_WIDTH - boxWidth - edgeMargin;

          posX.value = withSpring(snapX, SNAP_SPRING_CONFIG);
          posY.value = withSpring(
            Math.max(minY, Math.min(maxY - boxHeight, posY.value)),
            SNAP_SPRING_CONFIG,
          );
        }),
    // Gesture is created once; shared values are accessed via .value inside worklets
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const animatedStyle = useAnimatedStyle(() => ({
    left: posX.value,
    top: posY.value,
  }));

  return { panGesture, animatedStyle };
}
