import { memo } from 'react';
import Svg, { Path } from 'react-native-svg';

export type ServiceTierId = 'express' | 'kilat' | 'reguler';

export type TierIconSvgProps = {
  tier: ServiceTierId;
  size?: number;
  color?: string;
};

const VIEW_BOX = '0 0 24 24';

/** Express: lightning bolt. Customize by editing the path d. */
const ExpressPath = ({ color }: { color: string }) => (
  <Path d="M13 2L3 14h6l-2 8 10-12h-6l2-8z" fill={color} />
);

/** Kilat: timer. Customize by editing the paths. */
const KilatPath = ({ color }: { color: string }) => (
  <>
    <Path
      d="M12 6v6l4 2"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      fill="none"
    />
    <Path
      d="M12 22a8 8 0 100-16 8 8 0 000 16z"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
  </>
);

/** Reguler: calendar. Customize by editing the paths. */
const RegulerPath = ({ color }: { color: string }) => (
  <>
    <Path
      d="M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z"
      stroke={color}
      strokeWidth={2}
      fill="none"
    />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke={color} strokeWidth={2} fill="none" />
  </>
);

const TIER_PATHS: Record<
  ServiceTierId,
  (props: { color: string }) => React.ReactNode
> = {
  express: ExpressPath,
  kilat: KilatPath,
  reguler: RegulerPath,
};

export const TierIconSvg = memo(
  ({ tier, size = 24, color = '#000000' }: TierIconSvgProps) => {
    const PathContent = TIER_PATHS[tier];
    if (PathContent == null) return null;
    return (
      <Svg width={size} height={size} viewBox={VIEW_BOX} fill="none">
        {PathContent({ color })}
      </Svg>
    );
  },
);

TierIconSvg.displayName = 'TierIconSvg';
