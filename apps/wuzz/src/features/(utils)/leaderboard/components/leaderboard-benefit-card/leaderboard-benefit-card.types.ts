import type { Tier } from '../../utils/constants';

export interface LeaderboardBenefitCardProps {
  tier: Tier;
  benefits: string[];
  xpMin: number;
  xpMax: number | null;
}
