import type { LeaderboardEntry } from '../../types';
import type { Tier } from '../../utils/constants';

export interface LeaguePodiumProps {
  top3: LeaderboardEntry[];
  tier: Tier;
}
