import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  BottomNavigationParamList,
  RootStackParamList,
} from '@navigation/root/root.types';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type MenuSearchScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'menusearch'
>;

export type MenuScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomNavigationParamList, 'menu'>,
  NativeStackScreenProps<RootStackParamList>
>;

export type MenuCategory = {
  id: string;
  name: string;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUri?: string;
};
