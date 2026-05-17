import { HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { Location } from 'iconsax-react-native';
import { memo, useCallback } from 'react';
import { IconChevronLeft } from 'tabler-icons-react-native';
import { OrderStatusLocationCard } from '../order-status-location-card';
import type { OrderStatusHeaderProps } from './order-status-header.types';

const locationIcon = (
  <Location
    size={24}
    color={theme.pallate.secondary['03']}
    variant="Bulk"
  />
);

export const OrderStatusHeader = memo(
  ({ onBackPress, topInset, onBantuanPress }: OrderStatusHeaderProps) => {
    const handleBackPress = useCallback(() => {
      onBackPress();
    }, [onBackPress]);

    const handleBantuanPress = useCallback(() => {
      onBantuanPress?.();
    }, [onBantuanPress]);

    return (
      <VStack
        position={{
          top: topInset,
          left: 0,
          right: 0,
        }}
        zIndex={1}
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingTop: theme.spacing.small,
        }}
        gap={theme.spacing.medium}
      >
        <HStack justify="space-between" items="center">
          <Pressable
            onPress={handleBackPress}
            padding={{
              paddingVertical: theme.spacing.standard,
              paddingHorizontal: theme.spacing.medium,
            }}
            items="center"
            gap={theme.spacing.small}
            borderRadius={999}
            backgroundColor={theme.pallate.neutral['01']}
          >
            <IconChevronLeft size={24} color={theme.pallate.neutral['05']} />
            <Text type="b2" weight="medium" color={theme.pallate.neutral['05']}>
              Kembali
            </Text>
          </Pressable>
          <Pressable
            onPress={handleBantuanPress}
            padding={{
              paddingVertical: theme.spacing.standard,
              paddingHorizontal: theme.spacing.medium,
            }}
            items="center"
            justify="center"
            gap={theme.spacing.small}
            borderRadius={999}
            backgroundColor={theme.pallate.neutral['01']}
          >
            <IconChevronLeft size={24} color={theme.pallate.neutral['05']} />
            <Text type="b2" weight="medium" color={theme.pallate.neutral['05']}>
              Bantuan
            </Text>
          </Pressable>
        </HStack>
        <VStack gap={theme.spacing.standard}>
          <OrderStatusLocationCard
            title="Outlet"
            description="Wuzz 1090 Supermall Karawaci"
            icon={locationIcon}
          />
          <OrderStatusLocationCard
            title="Lokasi kamu"
            description="Lokasi kamu"
            icon={locationIcon}
          />
        </VStack>
      </VStack>
    );
  },
);

OrderStatusHeader.displayName = 'OrderStatusHeader';
