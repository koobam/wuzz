import {
  Box,
  Divider,
  HStack,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import { FlashList } from '@shopify/flash-list';
import { memo, useCallback } from 'react';
import type { PurchaseItem } from './purchase-list-section.types';

const ListSeparator = memo(function ListSeparator() {
  return <Divider thickness={theme.spacing.medium} />;
});

export const PurchaseListSection = memo(function PurchaseListSection() {
  const handleEdit = useCallback((_item: PurchaseItem) => {
    // TODO: navigate to edit or open edit modal
  }, []);

  const handleDelete = useCallback((_item: PurchaseItem) => {
    // TODO: remove item or show confirm
  }, []);

  const renderItem = useCallback(({ item }: { item: PurchaseItem }) => {
    return (
      <HStack gap={theme.spacing.standard} items="center">
        <Box
          width={60}
          height={60}
          borderRadius={theme.spacing.standard}
          backgroundColor={theme.pallate.neutral['02']}
        />
        <VStack fill>
            <Text numberOfLines={1} type="b2" weight="medium">
              {item.name}
            </Text>
            <HStack items="center" gap={theme.spacing.small}>
              <Text type="l1" color={theme.pallate.neutral['04']}>
                {item.type}
              </Text>
              <Box
                borderRadius={999}
                width={3}
                height={3}
                backgroundColor={theme.pallate.neutral['04']}
              />
              <Text
                numberOfLines={1}
                fill
                type="l1"
                color={theme.pallate.neutral['04']}
              >
                {item.addOns}
              </Text>
            </HStack>
        </VStack>
      </HStack>
    );
  }, []);

  const keyExtractor = useCallback((item: PurchaseItem) => item.id, []);

  return (
    <VStack
      margin={{
        marginHorizontal: theme.spacing.large,
      }}
      gap={theme.spacing.medium}
    >
      <Text weight="medium" type="s3">
        Daftar Pembelian
      </Text>
      <FlashList
        data={[
          {
            id: '1',
            name: 'Laundry Kiloan',
            type: 'Express',
            addOns: 'Lipat, Setrika, Pakaian putih',
            price: 100000,
            quantity: 1,
          },
          {
            id: '2',
            name: 'Laundry Kiloan',
            type: 'Express',
            addOns: 'Lipat, Setrika, Pakaian putih',
            price: 100000,
            quantity: 1,
          },
          {
            id: '3',
            name: 'Laundry Kiloan',
            type: 'Express',
            addOns: 'Lipat, Setrika, Pakaian putih',
            price: 100000,
            quantity: 1,
          },
        ]}
        ItemSeparatorComponent={ListSeparator}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </VStack>
  );
});

export type { PurchaseItem } from './purchase-list-section.types';
