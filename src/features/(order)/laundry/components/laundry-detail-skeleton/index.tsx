import { HStack, Shimmer, theme, VStack } from '@components/atoms';
import { memo } from 'react';
import { StyleSheet } from 'react-native';

const BANNER_LOADING_HEIGHT = 300;

const styles = StyleSheet.create({
  serviceCardShimmer: {
    flex: 1,
    aspectRatio: 1,
  },
});
const CARD_BORDER_RADIUS = theme.spacing.large;

export const LaundryDetailSkeleton = memo(function LaundryDetailSkeleton() {
  return (
    <VStack fill>
        <Shimmer
          width="100%"
          height={BANNER_LOADING_HEIGHT}
          borderRadius={0}
        />
      <VStack
        margin={{ marginTop: -theme.spacing.large * 2 }}
        gap={theme.spacing.large}
        padding={{ paddingBottom: theme.spacing.large }}
      >
        <HStack
          margin={{ marginHorizontal: theme.spacing.large }}
          padding={theme.spacing.large}
          borderRadius={CARD_BORDER_RADIUS}
          gap={theme.spacing.large}
          items="center"
          backgroundColor={theme.pallate.neutral['01']}
        >
          <VStack fill gap={theme.spacing.small}>
            <Shimmer width="70%" height={18} borderRadius={4} />
            <Shimmer width="90%" height={14} borderRadius={4} />
          </VStack>
          <VStack width={72} items="flex-end" gap={theme.spacing.tiny}>
            <Shimmer width="100%" height={16} borderRadius={4} />
            <Shimmer width={64} height={20} borderRadius={4} />
          </VStack>
        </HStack>

        <VStack padding={{ paddingHorizontal: theme.spacing.large }} gap={theme.spacing.standard}>
          <HStack gap={theme.spacing.standard} items="stretch">
            {['shimmer-1', 'shimmer-2', 'shimmer-3'].map((key) => (
              <Shimmer
                key={key}
                style={styles.serviceCardShimmer}
                borderRadius={theme.spacing.standard}
              />
            ))}
          </HStack>
        </VStack>

        <VStack gap={theme.spacing.standard}>
          <VStack padding={{ paddingHorizontal: theme.spacing.large }} gap={theme.spacing.small}>
            <Shimmer width={160} height={18} borderRadius={4} />
            <Shimmer width={220} height={14} borderRadius={4} />
          </VStack>
          {['shimmer-4', 'shimmer-5', 'shimmer-6'].map((key) => (
            <HStack
              key={key}
              padding={{ paddingHorizontal: theme.spacing.standard, paddingVertical: theme.spacing.standard }}
              gap={theme.spacing.standard}
              margin={{ marginHorizontal: theme.spacing.large }}
              items="center"
              borderRadius={10}
              borderWidth={1}
              borderColor={theme.pallate.neutral['02']}
              backgroundColor={theme.pallate.neutral['01']}
            >
              <Shimmer
                width={40}
                height={40}
                style={{ backgroundColor: theme.pallate.neutral['03'] }}
                borderRadius={theme.spacing.small}
              />
              <VStack fill gap={theme.spacing.tiny}>
                <Shimmer width="60%" height={15} borderRadius={4} />
                <Shimmer width="85%" height={18} borderRadius={4} />
              </VStack>
              <Shimmer width={56} height={20} borderRadius={4} />
            </HStack>
          ))}
        </VStack>
      </VStack>
    </VStack>
  );
});
