import { SharedValue } from 'react-native-reanimated';

export interface TabBarPilPropsType {
  tabNames: string[];
  onPress: (name: string) => void;
  activeIndex: SharedValue<number>;
}

export interface TabItemPilProps {
  name: string;
  onPress: (name: string) => void;
  activeIndex: SharedValue<number>;
  currentIndex: number;
}
