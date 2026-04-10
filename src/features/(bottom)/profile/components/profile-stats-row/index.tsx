import { memo } from 'react';
import { HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { Coin1, Flash, Receipt } from 'iconsax-react-native';
import type { ProfileStatItem, ProfileStatsRowProps } from './profile-stats-row.types';

const ICON_SIZE = 20;
const ICON_VARIANT = 'Bulk' as const;

const defaultStats = {
  streak: 7,
  pesananCount: 24,
  poin: 1250,
  level: 'Bronze',
};

const renderStatItem = (
  item: ProfileStatItem,
  onStreakPress?: () => void,
) => {
  const content = (
    <VStack borderRadius={12} spacing={theme.spacing.tiny}>
      <HStack items="center" spacing={theme.spacing.tiny}>
        {item.icon}
        <Text type="b2" weight="semibold" color={item.color}>
          {item.value}
        </Text>
      </HStack>
      <Text type="l2" color={theme.pallate.neutral['04']}>
        {item.label}
      </Text>
    </VStack>
  );

  if (item.label === 'Streak' && onStreakPress) {
    return (
      <Pressable
        key={item.label}
        width={80}
        onPress={onStreakPress}
        accessibilityRole="button"
        accessibilityLabel="Lihat detail streak"
      >
        {content}
      </Pressable>
    );
  }

  return (
    <VStack key={item.label} width={80}>
      {content}
    </VStack>
  );
};

export const ProfileStatsRow = memo<ProfileStatsRowProps>(
  function ProfileStatsRow({
    streak = defaultStats.streak,
    pesananCount = defaultStats.pesananCount,
    poin = defaultStats.poin,
    onStreakPress,
  }) {
    const stats: ProfileStatItem[] = [
      {
        value: streak,
        label: 'Streak',
        color: theme.pallate.warning['03'],
        icon: (
          <Flash
            size={ICON_SIZE}
            variant={ICON_VARIANT}
            color={theme.pallate.warning['03']}
          />
        ),
      },
      {
        value: pesananCount,
        label: 'Pesanan',
        color: theme.pallate.primary['03'],
        icon: (
          <Receipt
            size={ICON_SIZE}
            variant={ICON_VARIANT}
            color={theme.pallate.primary['03']}
          />
        ),
      },
      {
        value: poin.toLocaleString('id-ID'),
        label: 'Poin',
        color: theme.pallate.secondary['03'],
        icon: (
          <Coin1
            size={ICON_SIZE}
            variant={ICON_VARIANT}
            color={theme.pallate.secondary['03']}
          />
        ),
      },
    ];

    return (
      <HStack items="center">
        {stats.map((item) => renderStatItem(item, onStreakPress))}
      </HStack>
    );
  },
);

export type { ProfileStatItem, ProfileStatsRowProps } from './profile-stats-row.types';
