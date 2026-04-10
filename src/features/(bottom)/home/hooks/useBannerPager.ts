import { useCallback, useRef } from 'react';
import {
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { FlashListRef } from '@shopify/flash-list';
import { useSharedValue } from 'react-native-reanimated';

export const useBannerPager = () => {
  const bannerListRef = useRef<FlashListRef<string>>(null);
  const scrollOffsetX = useSharedValue(0);

  const handleBannerScrollUpdate = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollOffsetX.value = event.nativeEvent.contentOffset.x;
    },
    [scrollOffsetX],
  );

  const handleDotPress = useCallback((index: number) => {
    bannerListRef.current?.scrollToIndex({ index, animated: true });
  }, []);

  return {
    bannerListRef,
    scrollOffsetX,
    handleBannerScrollUpdate,
    handleDotPress,
  };
};
