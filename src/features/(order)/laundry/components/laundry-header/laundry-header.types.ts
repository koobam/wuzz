import type { StyleProp } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';

export type LaundryHeaderProps = {
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  title: string;
  onBackPress?: () => void;
  onHelpPress?: () => void;
};
