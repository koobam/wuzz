import { theme } from '@components/atoms';
import { useMemo } from 'react';
import {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { HEADER_SCROLL_THRESHOLD } from '../utils';

export interface UseLaundryHeaderScrollParams {
  /** Safe area top inset (e.g. from useSafeAreaInsets().top) */
  safeAreaTop: number;
}

export function useLaundryHeaderScroll({
  safeAreaTop,
}: UseLaundryHeaderScrollParams) {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const headerBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollY.value,
      [0, HEADER_SCROLL_THRESHOLD],
      ['transparent', theme.pallate.neutral['01']],
    ),
  }));

  const headerShadowStyle = useMemo(() => ({
    shadowColor: theme.pallate.neutral['05'],
    shadowRadius: theme.spacing.small,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
  }), []);

  const headerPositionStyle = useMemo(
    () => ({
      position: 'absolute' as const,
      left: 0,
      right: 0,
      zIndex: 1,
      paddingHorizontal: theme.spacing.large,
      paddingTop: theme.spacing.small + safeAreaTop,
      paddingBottom: theme.spacing.standard,
      elevation: 5,
    }),
    [safeAreaTop],
  );

  return {
    scrollY,
    scrollHandler,
    headerBackgroundStyle,
    headerShadowStyle,
    headerPositionStyle,
  };
}
