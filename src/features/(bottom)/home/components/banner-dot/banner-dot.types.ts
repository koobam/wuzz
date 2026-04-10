import type { SharedValue } from 'react-native-reanimated';

export type BannerDotProps = {
  index: number;
  scrollOffsetX: SharedValue<number>;
  screenWidth: number;
  onPress: (index: number) => void;
};
