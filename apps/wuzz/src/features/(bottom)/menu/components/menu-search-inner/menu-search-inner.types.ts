import type { View } from 'react-native';
import type Animated from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

export type MenuSearchInnerProps = {
  top: number;
  listPaddingTop: number;
  listContainerStyle: React.ComponentProps<typeof View>['style'];
  searchBarAnimatedStyle: React.ComponentProps<typeof Animated.View>['style'];
  scrollY: SharedValue<number>;
  onClose: () => void;
  onQueryChange: (hasQuery: boolean) => void;
  children?: React.ReactNode;
};
