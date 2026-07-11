import { theme } from '@components/atoms';
import { useMemo } from 'react';
import {
  interpolateColor,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

/** Jarak scroll (px) sampai background header penuh terisi. */
const HEADER_SCROLL_THRESHOLD = 120;

export interface UseAddressHeaderScrollParams {
  /** Safe area top inset (mis. dari useSafeAreaInsets().top) */
  safeAreaTop: number;
}

/** Header mengambang di atas banner; background memudar masuk saat scroll. */
export function useAddressHeaderScroll({
  safeAreaTop,
}: UseAddressHeaderScrollParams) {
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

  const headerPositionStyle = useMemo(
    () => ({
      position: 'absolute' as const,
      left: 0,
      right: 0,
      zIndex: 1,
      paddingHorizontal: theme.spacing.large,
      paddingTop: theme.spacing.tiny + safeAreaTop,
      paddingBottom: theme.spacing.small,
    }),
    [safeAreaTop],
  );

  return {
    scrollY,
    scrollHandler,
    headerBackgroundStyle,
    headerPositionStyle,
  };
}
