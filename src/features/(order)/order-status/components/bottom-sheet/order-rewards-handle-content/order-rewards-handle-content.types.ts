import type { LoyaltyTierId } from '../../../utils';

export type OrderRewardsHandleContentProps = {
  currentTier: LoyaltyTierId;
  /** Benefit copy for next tier (from API). Falls back to config default when not provided. */
  nextTierBenefit?: string;
  xpBeforeOrder?: number;
  xpToNextTier?: number;
  xpEarnedFromOrder?: number;
};
