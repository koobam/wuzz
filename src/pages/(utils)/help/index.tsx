import {
  HStack,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import { IconChevronLeft } from 'tabler-icons-react-native';
import { memo, useCallback } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Help = memo((props: { navigation: any }) => {
  const { navigation } = props;
  const { top } = useSafeAreaInsets();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <VStack fill backgroundColor={theme.pallate.neutral['06']}>
      <HStack
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingTop: top + theme.spacing.small,
          paddingBottom: theme.spacing.standard,
        }}
        items="center"
        justify="space-between"
      >
        <Pressable
          onPress={handleBack}
          padding={{
            paddingVertical: theme.spacing.standard,
            paddingHorizontal: theme.spacing.medium,
          }}
          items="center"
          spacing={theme.spacing.small}
          borderRadius={999}
          style={styles.backButton}
          backgroundColor={theme.pallate.neutral['01']}
        >
          <IconChevronLeft
            size={24}
            color={theme.pallate.neutral['05']}
          />
          <Text type="b2" weight="semibold" color={theme.pallate.neutral['05']}>
            Back
          </Text>
        </Pressable>
      </HStack>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: theme.spacing.standard }]}
        showsVerticalScrollIndicator={false}
      >
        <VStack padding={{ paddingHorizontal: theme.spacing.large }} spacing={theme.spacing.large}>
          <Text type="h3" weight="bold" color={theme.pallate.neutral['05']}>
            Help
          </Text>
          <Text type="l1" color={theme.pallate.neutral['04']}>
            Find answers to common questions and get support.
          </Text>
          <VStack spacing={theme.spacing.medium}>
            <Text type="s2" weight="semibold" color={theme.pallate.neutral['05']}>
              Frequently asked questions
            </Text>
            <Text type="l2" color={theme.pallate.neutral['04']}>
              How do I place an order? — Choose your service, add items, and proceed to checkout.
            </Text>
            <Text type="l2" color={theme.pallate.neutral['04']}>
              How can I track my order? — Open the order from History or the order status screen.
            </Text>
            <Text type="l2" color={theme.pallate.neutral['04']}>
              How do I contact support? — Use the chat in the app or email support.
            </Text>
          </VStack>
        </VStack>
      </ScrollView>
    </VStack>
  );
});

Help.displayName = 'Help';

const styles = StyleSheet.create({
  backButton: {
    ...theme.elevations[2],
  },
  scrollContent: {
    paddingBottom: theme.spacing.large,
  },
});

export default Help;
