import {
  Rank1White,
  Rank2White,
  Rank3White,
  Rank4White,
} from '@assets/index';
import type { ComponentType } from 'react';

export type LoyaltyTierId = 'bronze' | 'silver' | 'gold' | 'platinum';

export const TIER_ICON_SIZE = 30;
export const DEFAULT_XP_TO_NEXT = 100;
export const DEFAULT_XP_EARNED = 50;

export const LOYALTY_TIER_ORDER: LoyaltyTierId[] = [
  'bronze',
  'silver',
  'gold',
  'platinum',
];

type TierIconProps = { width?: number; height?: number };

export const LOYALTY_TIER_CONFIG: Record<
  LoyaltyTierId,
  {
    label: string;
    nextTier: LoyaltyTierId | null;
    Icon: ComponentType<TierIconProps>;
    progressColor: string;
    /** Benefit copy when this tier is the "next" (e.g. "Free delivery") */
    benefit: string;
  }
> = {
  bronze: { label: 'Bronze', nextTier: 'silver', Icon: Rank1White, progressColor: '#8B6F47', benefit: 'Jadi Silver dapat diskon 5% di order berikutnya' },
  silver: { label: 'Silver', nextTier: 'gold', Icon: Rank2White, progressColor: '#909090', benefit: 'Jadi Gold dapat gratis ongkir & prioritas order' },
  gold: { label: 'Gold', nextTier: 'platinum', Icon: Rank3White, progressColor: '#FF9500', benefit: 'Naik ke Platinum dapat benefit eksklusif & dukungan prioritas' },
  platinum: { label: 'Platinum', nextTier: null, Icon: Rank4White, progressColor: '#0D9488', benefit: 'Kamu sudah nikmati semua benefit tertinggi' },
};
