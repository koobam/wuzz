import {
  BottomNavigationParamList,
  RootStackParamList,
} from '@navigation/root/root.types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type HomeType = CompositeScreenProps<
  BottomTabScreenProps<BottomNavigationParamList, 'home'>,
  NativeStackScreenProps<RootStackParamList>
>;
