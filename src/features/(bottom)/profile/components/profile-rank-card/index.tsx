import { memo } from 'react';
import { StyleSheet } from 'react-native';
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import { IconChevronRight } from 'tabler-icons-react-native';
import type { ProfileRankCardProps } from './profile-rank-card.types';

const cardPadding = {
  paddingHorizontal: theme.spacing.large,
  paddingVertical: theme.spacing.medium,
};

const styles = StyleSheet.create({
  line: {
    height: 1,
    width: '100%',
    backgroundColor: theme.pallate.neutral['03'],
  },
});

export const ProfileRankCard = memo(function ProfileRankCard({
  onDetailPress,
  progress = 0,
  progressMax = 100,
}: ProfileRankCardProps) {
  const filledPct =
    progressMax > 0 ? Math.min(100, (progress / progressMax) * 100) : 0;
  const remaining = Math.max(0, progressMax - progress);
  return (
    <VStack
      margin={{
        marginHorizontal: 0,
        marginTop: -70,
      }}
      borderRadius={16}
      borderWidth={1}
      borderColor={theme.pallate.neutral['03']}
      fill
    >
      <HStack
        items="center"
        padding={cardPadding}
        backgroundColor={theme.pallate.neutral['01']}
        gap={theme.spacing.standard}
      >
        <Text
          fill
          numberOfLines={2}
          type="l2"
          color={theme.pallate.neutral['05']}
        >
          Level selanjutnya dapatkan dengan mengumpulkan poin dari laundry &
          coffee.
        </Text>
        <Button
          onPress={onDetailPress}
          size="sm"
          rounded
          variant="default"
          gap={theme.spacing.tiny}
        >
          <Text type="l2" weight="semibold" color={theme.pallate.neutral['04']}>
            Rank Detail
          </Text>
          <IconChevronRight size={14} color={theme.pallate.neutral['04']} />
        </Button>
      </HStack>
      <VStack style={styles.line} />
      <HStack
        padding={cardPadding}
        justify="center"
        items="center"
        gap={theme.spacing.small}
      >
        <HStack items="center" gap={theme.spacing.small}>
          <Icon icon="bronze" size={24} />
          <Text type="l1" weight="medium" color={theme.pallate.neutral['05']}>
            Bronze
          </Text>
        </HStack>
        <Flex
          fill
          height={6}
          borderRadius={8}
          backgroundColor={theme.pallate.neutral['03']}
        >
          <Flex
            borderRadius={{
              borderTopLeftRadius: 8,
              borderBottomLeftRadius: 8,
            }}
            items="center"
            height={6}
            width={`${filledPct}%`}
            backgroundColor={theme.pallate.primary['03']}
          >
            <Box
              padding={{
                paddingHorizontal: theme.spacing.small,
                paddingVertical: theme.spacing.tiny,
              }}
              borderRadius={50}
              backgroundColor={theme.pallate.primary['03']}
              zIndex={1}
              position={{ right: 0 }}
            >
              <Text
                type="l2"
                weight="semibold"
                text={`${remaining} xp`}
                color={theme.pallate.neutral['01']}
              />
            </Box>
          </Flex>
        </Flex>
        <HStack items="center" gap={theme.spacing.small}>
          <Icon icon="silver" size={24} />
          <Text type="l1" weight="medium" color={theme.pallate.neutral['05']}>
            Silver
          </Text>
        </HStack>
      </HStack>
    </VStack>
  );
});

export type { ProfileRankCardProps } from './profile-rank-card.types';
