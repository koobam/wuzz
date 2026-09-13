import { HStack, Text, theme, VStack } from '@components/atoms';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { IconStarFilled } from 'tabler-icons-react-native';
import type { WuzzerReviewCardProps } from './wuzzer-review-card.types';

const REVIEW_CARD_WIDTH = 200;

const styles = StyleSheet.create({
  card: {
    width: REVIEW_CARD_WIDTH,
    padding: theme.spacing.standard,
    borderWidth: 1,
    borderColor: theme.pallate.neutral['02'],
    borderRadius: 12,
  },
});

export const WuzzerReviewCard = memo(({ review }: WuzzerReviewCardProps) => (
  <VStack style={styles.card} gap={theme.spacing.tiny}>
    <HStack items="center" justify="space-between">
      <Text
        type="l1"
        weight="semibold"
        color={theme.pallate.neutral['05']}
        numberOfLines={1}
      >
        {review.authorName}
      </Text>
      {review.dateFormatted != null && (
        <Text
          type="l2"
          color={theme.pallate.neutral['04']}
          numberOfLines={1}
        >
          {review.dateFormatted}
        </Text>
      )}
    </HStack>
    <HStack items="center" gap={theme.spacing.tiny}>
      <IconStarFilled size={14} color={theme.pallate.secondary['03']} />
      <Text type="l2" color={theme.pallate.neutral['04']}>
        {review.rating.toFixed(1)}
      </Text>
    </HStack>
    <Text
      type="l2"
      color={theme.pallate.neutral['05']}
      numberOfLines={2}
    >
      {review.comment}
    </Text>
  </VStack>
));

WuzzerReviewCard.displayName = 'WuzzerReviewCard';
