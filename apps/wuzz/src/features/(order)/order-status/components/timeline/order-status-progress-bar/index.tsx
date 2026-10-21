import { Flex, HStack, theme } from '@components/atoms';
import { memo, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { ORDER_STATUSES } from '../../../utils/constants';
import type { OrderStatusType } from '../../../types';
import type { OrderStatusProgressBarProps } from './order-status-progress-bar.types';

const statusIndex = (status: OrderStatusType): number =>
  ORDER_STATUSES.indexOf(status);

const BLINK_DURATION_MS = 600;
const BLINK_MIN_OPACITY = 0.35;

const segmentStyles = StyleSheet.create({
  segment: {
    flex: 1,
    height: 5,
    borderRadius: 25,
    borderCurve: 'continuous',
  },
});

export const OrderStatusProgressBar = memo(
  ({ currentStatus }: OrderStatusProgressBarProps) => {
    const currentIndex = statusIndex(currentStatus);
    const blinkOpacity = useSharedValue(1);
    const shouldBlink = currentStatus !== 'completed';

    useEffect(() => {
      if (!shouldBlink) {
        blinkOpacity.value = withTiming(1, { duration: 0 });
        return;
      }
      blinkOpacity.value = withRepeat(
        withTiming(BLINK_MIN_OPACITY, { duration: BLINK_DURATION_MS }),
        -1,
        true
      );
    }, [blinkOpacity, shouldBlink]);

    const blinkAnimatedStyle = useAnimatedStyle(() => ({
      opacity: blinkOpacity.value,
    }));

    return (
      <HStack items="center" gap={theme.spacing.small}>
        {ORDER_STATUSES.map((_, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;
          const backgroundColor =
            isCompleted || isActive
              ? theme.pallate.primary['03']
              : theme.pallate.neutral['02'];

          if (isActive && shouldBlink) {
            return (
              <Animated.View
                key={index}
                style={[segmentStyles.segment, blinkAnimatedStyle]}
              >
                <Flex
                  fill
                  height={5}
                  borderRadius={25}
                  backgroundColor={backgroundColor}
                />
              </Animated.View>
            );
          }

          return (
            <Flex
              key={index}
              fill
              height={5}
              borderRadius={25}
              backgroundColor={backgroundColor}
            />
          );
        })}
      </HStack>
    );
  }
);

OrderStatusProgressBar.displayName = 'OrderStatusProgressBar';
