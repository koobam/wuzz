import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/root/root.types';

export type LeaderboardEntry = {
  rank: number;
  userId: string;
  displayName: string;
  xp: number;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  isCurrentUser?: boolean;
  locked?: boolean;
};

export type LeaderboardScreenProps = NativeStackScreenProps<RootStackParamList, 'leaderboard'>;
