import {
  Button,
  Flex,
  HStack,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import Image from '@components/atoms/image';
import { Call, Message2 } from 'iconsax-react-native';
import { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import type { WuzzerReview } from '../../../types';
import type { WuzzerCardProps } from './wuzzer-card.types';
import { WuzzerReviewCard } from '../wuzzer-review-card';
import Dash from 'react-native-dash';
import { IconStarFilled } from 'tabler-icons-react-native';
import { FlashList } from '@shopify/flash-list';

const AVATAR_SIZE = 48;

const styles = StyleSheet.create({
  avatarWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  avatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  reviewsListContent: {
    paddingRight: theme.spacing.standard,
  },
  reviewSeparator: {
    width: theme.spacing.standard,
  },
});

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const ReviewSeparator = () => <Flex style={styles.reviewSeparator} />;

export const WuzzerCard = memo(
  ({ wuzzer, onCallPress, onChatPress }: WuzzerCardProps) => {
    const reviews = wuzzer.reviews ?? [];
    const renderReviewItem = useCallback(
      ({ item }: { item: WuzzerReview }) => <WuzzerReviewCard review={item} />,
      [],
    );
    const keyExtractorReview = useCallback((item: WuzzerReview) => item.id, []);

    const handleCallPress = useCallback(() => {
      onCallPress?.(wuzzer.phoneNumber);
    }, [onCallPress, wuzzer.phoneNumber]);

    const handleChatPress = useCallback(() => {
      onChatPress?.(wuzzer.id);
    }, [onChatPress, wuzzer.id]);

    const initials = getInitials(wuzzer.name);

    return (
      <VStack gap={theme.spacing.standard}>
        <Text type="s2" weight="medium" color={theme.pallate.neutral['05']}>
          Wuzzer yang menjemput
        </Text>
        <VStack
          padding={theme.spacing.standard}
          borderWidth={1}
          borderColor={theme.pallate.neutral['02']}
          borderRadius={30}
          gap={theme.spacing.standard}
        >
          <HStack items="center" gap={theme.spacing.standard}>
            <Flex
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              items="center"
              justify="center"
              borderRadius={AVATAR_SIZE / 2}
              backgroundColor={theme.pallate.primary['01']}
            >
              {wuzzer.photoUri ? (
                <Image
                  uri={wuzzer.photoUri}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Text
                  type="b2"
                  weight="semibold"
                  color={theme.pallate.primary['04']}
                >
                  {initials}
                </Text>
              )}
            </Flex>
            <VStack fill>
              <Text
                type="b2"
                weight="semibold"
                color={theme.pallate.neutral['05']}
              >
                {wuzzer.name}
              </Text>
              <Text type="l1" color={theme.pallate.neutral['04']}>
                {wuzzer.vehicle}
              </Text>
            </VStack>
            <HStack gap={theme.spacing.small}>
              <Button
                rounded
                size="fixed"
                variant="primary"
                onPress={handleCallPress}
              >
                <Call
                  size={22}
                  color={theme.pallate.neutral['01']}
                  variant="Bold"
                />
              </Button>
              <Button
                rounded
                size="fixed"
                variant="primary"
                onPress={handleChatPress}
              >
                <Message2
                  size={22}
                  color={theme.pallate.neutral['01']}
                  variant="Bold"
                />
              </Button>
            </HStack>
          </HStack>
          {/* Dash */}
          <Dash
            dashGap={4}
            dashColor={theme.pallate.neutral['02']}
            dashLength={4}
            dashThickness={1}
          />
          <HStack items="center" justify="space-between" gap={theme.spacing.tiny}>
            <HStack items="center" gap={theme.spacing.tiny}>
            <IconStarFilled
              size={18}
              color={theme.pallate.secondary['03']}
            />
            <Text type="l1" color={theme.pallate.neutral['04']}>
              {wuzzer.rating?.toFixed(1)}
              {' '}
              (100 ulasan)
            </Text>
            </HStack>
            {/* Review Button */}
           <Button rounded size="sm" variant="primary" onPress={() => {}}>
            <Text weight="medium" type="l1" color={theme.pallate.neutral['01']}>
              Beri rating
            </Text>
           </Button>
          </HStack>
          {/* Reviews of this wuzzer */}
          {reviews.length > 0 && (
            <FlashList<WuzzerReview>
              data={reviews}
              renderItem={renderReviewItem}
              keyExtractor={keyExtractorReview}
              horizontal
              contentContainerStyle={styles.reviewsListContent}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={ReviewSeparator}
            />
          )}
        </VStack>
      </VStack>
    );
  },
);

WuzzerCard.displayName = 'WuzzerCard';
