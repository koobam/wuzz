import { SharedValue } from 'react-native-reanimated';

export interface TabBarLineProps {
  tabNames: string[];
  onPress: (name: string) => void;
  activeIndex: SharedValue<number>;
}

export interface TabItemLineProps {
  name: string;
  onPress: (name: string) => void;
  activeIndex: SharedValue<number>;
  currentIndex: number;
}
