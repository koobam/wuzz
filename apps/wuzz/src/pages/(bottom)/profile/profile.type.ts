import { BottomNavigationParamList } from '@navigation/root/root.types';
import { ProfileNavigationParamList } from '@navigation/profile-navigation/profile-navigation.types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type ProfileType = CompositeScreenProps<
    BottomTabScreenProps<BottomNavigationParamList, 'profile'>,
    NativeStackScreenProps<ProfileNavigationParamList>
>;
