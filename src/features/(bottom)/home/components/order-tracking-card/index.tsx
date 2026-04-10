import { memo, useCallback } from 'react';
import {
  Box,
  Flex,
  HStack,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import { Copy } from 'iconsax-react-native';
import { FlashList } from '@shopify/flash-list';
import { Dimensions } from 'react-native';
import { OrderTrackingItemSeparator } from '../order-tracking-item-separator';
import type { OrderTrackingListProps } from './order-tracking-card.types';
import GesturePressable from '@components/atoms/gesture-pressable';

const ORDER_TRACKING_PLACEHOLDER = ['1', '2', '3'];

export const OrderTrackingList = memo(({ onOrderPress }: OrderTrackingListProps) => {
  const screenWidth = Dimensions.get('screen').width;

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <GesturePressable
        direction="column"
        shrink
        width={screenWidth * 0.85}
        spacing={theme.spacing.standard}
        padding={theme.spacing.large}
        borderWidth={1}
        borderColor={theme.pallate.neutral['02']}
        borderRadius={30}
        onPress={() => onOrderPress?.(item)}
      >
            <VStack>
              <Text weight="semibold">Driver Menuju Lokasimu</Text>
              <HStack spacing={theme.spacing.tiny} items="center">
                <Text color={theme.pallate.neutral['04']} type="l1">
                  Wuzz 1090 Supermall Karawaci
                </Text>
                <Box
                  width={3}
                  height={3}
                  borderRadius={20}
                  backgroundColor={theme.pallate.neutral['04']}
                />
                <Text color={theme.pallate.neutral['04']} type="l1">
                  Delivery
                </Text>
              </HStack>
            </VStack>
          <HStack items="center" spacing={theme.spacing.small}>
            <Box
              width={25}
              height={25}
              borderRadius={20}
              backgroundColor={theme.pallate.primary['03']}
            />
            <Flex
              fill
              height={5}
              backgroundColor={theme.pallate.primary['03']}
            />
            <Box
              width={25}
              height={25}
              borderRadius={20}
              backgroundColor={theme.pallate.primary['03']}
            />
            <Flex
              fill
              height={5}
              backgroundColor={theme.pallate.primary['03']}
            />
            <Box
              width={25}
              height={25}
              borderRadius={20}
              backgroundColor={theme.pallate.primary['03']}
            />
            <Flex
              fill
              height={5}
              backgroundColor={theme.pallate.primary['03']}
            />
            <Box
              width={25}
              height={25}
              borderRadius={20}
              backgroundColor={theme.pallate.primary['03']}
            />
          </HStack>
          <HStack justify="space-between">
            <VStack>
              <Text type="b2" weight="medium">
                Laundry Kiloan
              </Text>
              <Text color={theme.pallate.neutral['04']} type="l1">
                3Kg Pakaian
              </Text>
            </VStack>
            <VStack items="flex-end">
              <Text type="l2" weight="medium">
                Total Harga
              </Text>
              <Text color={theme.pallate.neutral['05']} type="b2">
                Rp 40.000
              </Text>
            </VStack>
          </HStack>
          <HStack items="center" justify="space-between">
            <Text color={theme.pallate.neutral['04']} type="l1">
              9 Okt 2025
            </Text>
            <Pressable
              padding={{
                paddingHorizontal: theme.spacing.standard,
                paddingVertical: theme.spacing.small,
              }}
              items="center"
              spacing={theme.spacing.tiny}
              borderRadius={10}
              backgroundColor={theme.pallate.neutral['03']}
            >
              <Text type="l2" color={theme.pallate.neutral['04']}>
                TRX-20251009-8F3A9C2B
              </Text>
              <Copy
                color={theme.pallate.neutral['04']}
                size={20}
                variant="Bulk"
              />
            </Pressable>
          </HStack>
      </GesturePressable>
    ),
    [onOrderPress, screenWidth],
  );

  const keyExtractor = useCallback((item: string) => item, []);

  return (
    <FlashList
      data={ORDER_TRACKING_PLACEHOLDER}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: theme.spacing.large,
        paddingBottom: theme.spacing.large,
      }}
      ItemSeparatorComponent={OrderTrackingItemSeparator}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
});

OrderTrackingList.displayName = 'OrderTrackingList';
