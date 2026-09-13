import { BottomNavigationParamList, RootStackParamList } from '@navigation/root/root.types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type ClipListType = CompositeScreenProps<
  BottomTabScreenProps<BottomNavigationParamList, 'clip-list'>,
  NativeStackScreenProps<RootStackParamList>
>;

export interface StoryItemProps {
  item: string;
  index: number;
}

export interface PostItemProps {
  item: {
    color: string;
  };
}

export interface ListHeaderProps {
  top: number;
  logoAnimatedStyle: any;
}

