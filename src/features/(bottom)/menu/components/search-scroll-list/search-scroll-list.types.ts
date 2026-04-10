import type { SharedValue } from 'react-native-reanimated';

export type SearchScrollListProps = {
  query: string;
  scrollY: SharedValue<number>;
  listPaddingTop: number;
};
