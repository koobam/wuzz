import type { StyleProp, ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';

export type LaundryBannerProps = {
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  imageUri: string | number;
  backgroundColor?: string;
};
