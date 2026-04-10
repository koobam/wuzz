import { memo } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { useFloatingDrag } from '../../hooks/useFloatingDrag';
import type { FloatingDraggableProps } from './floating-draggable.types';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
  },
});

export const FloatingDraggable = memo(
  ({
    children,
    style,
    boxWidth,
    boxHeight,
    edgeMargin,
    initialX,
    initialY,
    minY,
    maxY,
  }: FloatingDraggableProps) => {
    const { panGesture, animatedStyle } = useFloatingDrag({
      boxWidth,
      boxHeight,
      edgeMargin,
      initialX,
      initialY,
      minY,
      maxY,
    });

    return (
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, animatedStyle, style]}>
          {children}
        </Animated.View>
      </GestureDetector>
    );
  },
);

FloatingDraggable.displayName = 'FloatingDraggable';
