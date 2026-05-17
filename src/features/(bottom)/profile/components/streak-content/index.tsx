import React, { memo, useMemo } from 'react';
import { HStack, Text, theme, VStack } from '@components/atoms';
import { Flash } from 'iconsax-react-native';
import type { StreakStatus } from '../../types';
import { STREAK_MODAL_TITLE, STREAK_STATUS_CONFIG } from '../../utils/constants';
import type { StreakContentProps } from './streak-content.types';

const FLAME_SIZE = 48;

const getStatusColor = (status: StreakStatus): string => {
  switch (status) {
    case 'active':
      return theme.pallate.warning['03'];
    case 'broken':
      return theme.pallate.danger['03'];
    case 'increased':
      return theme.pallate.success['03'];
    default:
      return theme.pallate.warning['03'];
  }
};

export const StreakContent = memo(function StreakContent({
  currentStreak,
  status,
}: StreakContentProps) {
  const statusColor = useMemo(() => getStatusColor(status), [status]);
  const config = useMemo(() => STREAK_STATUS_CONFIG[status], [status]);

  return (
    <VStack gap={theme.spacing.large} fill>
      <Text
        type="s1"
        weight="bold"
        color={theme.pallate.neutral['05']}
        text={STREAK_MODAL_TITLE}
      />
      <VStack
        padding={theme.spacing.large}
        borderRadius={16}
        backgroundColor={theme.pallate.neutral['01']}
        gap={theme.spacing.standard}
        items="center"
      >
        <HStack items="center" gap={theme.spacing.standard}>
          <VStack
            width={FLAME_SIZE + theme.spacing.standard}
            height={FLAME_SIZE + theme.spacing.standard}
            borderRadius={(FLAME_SIZE + theme.spacing.standard) / 2}
            backgroundColor={theme.pallate.warning['01']}
            items="center"
            justify="center"
          >
            <Flash size={FLAME_SIZE} variant="Bulk" color={statusColor} />
          </VStack>
          <Text
            type="h1"
            weight="bold"
            color={theme.pallate.neutral['05']}
            text={String(currentStreak)}
          />
          <Text type="b1" color={theme.pallate.neutral['04']} text="hari" />
        </HStack>
        <VStack gap={theme.spacing.small} fill>
          <Text
            type="b1"
            weight="semibold"
            color={statusColor}
            text={config.title}
          />
          <Text
            type="b2"
            color={theme.pallate.neutral['05']}
            text={config.description}
          />
          {config.tip ? (
            <VStack
              padding={theme.spacing.standard}
              borderRadius={12}
              backgroundColor={theme.pallate.neutral['02']}
            >
              <Text
                type="l1"
                color={theme.pallate.neutral['05']}
                text={config.tip}
              />
            </VStack>
          ) : null}
        </VStack>
      </VStack>
    </VStack>
  );
});

export type { StreakContentProps } from './streak-content.types';
