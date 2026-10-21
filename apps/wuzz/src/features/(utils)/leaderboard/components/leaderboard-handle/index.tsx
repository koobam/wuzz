import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Box, HStack, Icon, Text, theme, VStack } from '@components/atoms';
import { IconClock } from 'tabler-icons-react-native';
import {
  TIER_COLOR,
  TIER_COLOR_BG,
  TIER_COLOR_LIGHT,
  TIER_LABEL,
} from '../../utils/constants';
import type { LeaderboardHandleContentProps } from './leaderboard-handle.types';

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 24,
    borderCurve: 'continuous',
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    borderCurve: 'continuous',
    alignSelf: 'center',
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.standard,
  },
  timeBadge: {
    borderRadius: 999,
    borderCurve: 'continuous',
    borderWidth: 1,
  },
  rankBadge: {
    borderRadius: 999,
    borderCurve: 'continuous',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: theme.pallate.neutral['03'],
  },
});

export const LeaderboardHandleContent = memo(function LeaderboardHandleContent({
  tier,
  timeLeft,
  rank,
  totalParticipants,
}: LeaderboardHandleContentProps) {
  const color = TIER_COLOR[tier];
  const lightColor = TIER_COLOR_LIGHT[tier];

  return (
    <HStack
      borderWidth={1}
      margin={{
        marginHorizontal: theme.spacing.large,
      }}
      backgroundColor={theme.pallate.neutral['01']}
      borderColor={theme.pallate.neutral['03']}
      borderRadius={theme.spacing.large}
      padding={{
        paddingHorizontal: theme.spacing.large,
        paddingVertical: theme.spacing.large,
      }}
    >
      {/* Left: tier icon + league name */}
      <HStack fill items="center" gap={theme.spacing.small}>
        <Box borderRadius={999} backgroundColor={lightColor}>
          <Icon icon={tier} size={32} color={color} />
        </Box>

        <Text type="b2" weight="bold" color={theme.pallate[tier]['04']}>
          {TIER_LABEL[tier]} League
        </Text>
      </HStack>
      <VStack items="flex-end">
        <Text type="l2" weight="semibold" color={theme.pallate.neutral['04']}>
          Peringkat
        </Text>
        <HStack items="center" gap={theme.spacing.tiny}>
          <Text type="s2" weight="bold" color={theme.pallate[tier]['04']}>
            #{rank}
          </Text>
          {totalParticipants != null && (
            <Text type="l1" color={theme.pallate.neutral['04']}>
              / {totalParticipants.toLocaleString()}
            </Text>
          )}
        </HStack>
      </VStack>
    </HStack>
  );
});

export type { LeaderboardHandleContentProps } from './leaderboard-handle.types';
