import { Text, theme, VStack } from '@components/atoms';
import { memo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomNavHeight } from '@services/contexts/bottom-nav-height';

const Support = memo(() => {
  const { top } = useSafeAreaInsets();
  const { navHeight } = useBottomNavHeight();

  return (
    <VStack fill backgroundColor={theme.pallate.neutral['01']}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: top + theme.spacing.large,
            paddingBottom: theme.spacing.large + navHeight,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <VStack
          padding={{ paddingHorizontal: theme.spacing.large }}
          gap={theme.spacing.large}
        >
          <Text type="h3" weight="bold" color={theme.pallate.neutral['05']}>
            Support
          </Text>
          <Text type="l1" color={theme.pallate.neutral['04']}>
            Find answers to common questions and get support.
          </Text>
          <VStack gap={theme.spacing.medium}>
            <Text
              type="s2"
              weight="semibold"
              color={theme.pallate.neutral['05']}
            >
              Frequently asked questions
            </Text>
            <Text type="l2" color={theme.pallate.neutral['04']}>
              How do I place an order? — Choose your service, add items, and
              proceed to checkout.
            </Text>
            <Text type="l2" color={theme.pallate.neutral['04']}>
              How can I track my order? — Open the order from History or the
              order status screen.
            </Text>
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
});

Support.displayName = 'Support';

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: theme.spacing.large,
  },
});

export default Support;
