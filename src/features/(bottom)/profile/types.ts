import {
  BottomNavigationParamList,
  RootStackParamList,
} from '@navigation/root/root.types';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type ProfileType = CompositeScreenProps<
  BottomTabScreenProps<BottomNavigationParamList, 'profile'>,
  NativeStackScreenProps<RootStackParamList>
>;

/** Status tampilan streak di modal: aktif, hancur, atau bertambah */
export type StreakStatus = 'active' | 'broken' | 'increased';

/** Satu entry di daftar referral (orang yang mendaftar pakai kode user). */
export interface ReferralItem {
  id: string;
  name: string;
  joinedAt: string;
  /** Optional: status seperti 'active' | 'pending' untuk reward. */
  status?: 'active' | 'pending';
}
