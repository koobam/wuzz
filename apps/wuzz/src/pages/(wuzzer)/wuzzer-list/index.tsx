import { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconChevronLeft } from 'tabler-icons-react-native';
import { SearchStatus } from 'iconsax-react-native';
import { HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { useNearbyWuzzers } from '@features/(bottom)/home/hooks';
import { WuzzerCard } from '@features/(bottom)/home/components/wuzzer-nearby/wuzzer-card';
import type { Wuzzer } from '@features/(bottom)/home/components/wuzzer-nearby/wuzzer-nearby.types';

const keyExtractor = (wuzzer: Wuzzer): string => wuzzer.id;

const Separator = memo(() => <VStack style={styles.separator} />);
Separator.displayName = 'Separator';

const EmptyState = memo(() => (
  <HStack
    items="center"
    justify="center"
    gap={theme.spacing.small}
    padding={theme.spacing.large}
  >
    <SearchStatus
      size={22}
      variant="Bulk"
      color={theme.pallate.neutral['04']}
    />
    <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
      Belum ada Wuzzer di dekatmu
    </Text>
  </HStack>
));
EmptyState.displayName = 'EmptyState';

/** Every Wuzzer near the customer, nearest first. */
const WuzzerList = memo(
  (props: {
    navigation: { goBack: () => void };
    route: { params?: { lat: number; long: number } };
  }) => {
    const { navigation, route } = props;
    const { top, bottom } = useSafeAreaInsets();
    // Handed over by Home, which already has the position.
    const wuzzers = useNearbyWuzzers(route.params) ?? [];

    const handleBack = useCallback(() => {
      navigation.goBack();
    }, [navigation]);

    const renderItem = useCallback(
      ({ item }: { item: Wuzzer }) => (
        <WuzzerCard wuzzer={item} selected={false} fullWidth />
      ),
      [],
    );

    return (
      <VStack fill backgroundColor={theme.pallate.neutral['01']}>
        <HStack
          items="center"
          gap={theme.spacing.standard}
          padding={{
            paddingTop: top + theme.spacing.small,
            paddingHorizontal: theme.spacing.large,
            paddingBottom: theme.spacing.standard,
          }}
        >
          <Pressable
            onPress={handleBack}
            items="center"
            justify="center"
            width={40}
            height={40}
            borderRadius={14}
            backgroundColor={theme.pallate.neutral['02']}
            accessibilityLabel="Kembali"
          >
            <IconChevronLeft size={22} color={theme.pallate.neutral['05']} />
          </Pressable>
          <VStack fill>
            <Text type="s2" weight="semibold">
              Semua Wuzzer
            </Text>
            <Text type="l1" color={theme.pallate.neutral['04']}>
              {wuzzers.length > 0
                ? `${wuzzers.length} Wuzzer di sekitarmu, terdekat dulu`
                : 'Wuzzer di sekitarmu'}
            </Text>
          </VStack>
        </HStack>
        <FlashList
          data={wuzzers}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={Separator}
          ListEmptyComponent={EmptyState}
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.large,
            paddingBottom: bottom + theme.spacing.large,
          }}
          showsVerticalScrollIndicator={false}
        />
      </VStack>
    );
  },
);
WuzzerList.displayName = 'WuzzerList';

export default WuzzerList;

const styles = StyleSheet.create({
  separator: { height: 1, backgroundColor: theme.pallate.neutral['03'] },
});
