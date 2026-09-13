import type { BottomSheetHandleProps } from '@gorhom/bottom-sheet';
import type { Tier } from '../../utils/constants';

export interface LeaderboardHandleContentProps
  extends Partial<BottomSheetHandleProps> {
  tier: Tier;
  /** e.g. "3 hari lagi" or "2j 30m" */
  timeLeft: string;
  rank?: number;
  totalParticipants?: number;
}
