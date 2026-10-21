import { memo } from 'react';
import { HStack, Pressable, Text, theme } from '@components/atoms';
import { IconChevronLeft } from 'tabler-icons-react-native';
import type { LeaderboardHeaderProps } from './leaderboard-header.types';

const buttonPadding = {
  paddingVertical: theme.spacing.standard,
  paddingHorizontal: theme.spacing.medium,
};

const buttonStyle = {
  items: 'center' as const,
  spacing: theme.spacing.small,
  borderRadius: 999,
  borderCurve: 'continuous',
  borderWidth: 1,
  borderColor: theme.pallate.neutral['03'],
  backgroundColor: theme.pallate.neutral['01'],
};

export const LeaderboardHeader = memo(function LeaderboardHeader({
  topInset = 0,
  onBackPress,
}: LeaderboardHeaderProps) {
  return (
    <HStack
      width="100%"
      padding={{
        paddingHorizontal: theme.spacing.large,
        paddingTop: topInset + theme.spacing.small,
        paddingBottom: theme.spacing.small,
      }}
      items="center"
      backgroundColor={theme.pallate.neutral['01']}
    >
      <Pressable onPress={onBackPress} padding={buttonPadding} {...buttonStyle}>
        <IconChevronLeft size={20} color={theme.pallate.neutral['05']} />
        <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
          Leaderboard
        </Text>
      </Pressable>
    </HStack>
  );
});

export type { LeaderboardHeaderProps } from './leaderboard-header.types';
