import { Box, HStack, Pressable, Text, theme } from '@components/atoms';
import { ArrowDown2, Location, SearchNormal1 } from 'iconsax-react-native';
import { memo } from 'react';
import type { DeliveryAddressRowProps } from './delivery-address-row.types';

const getDeliverySubtitle = (deliveryLocationLabel?: string): string =>
  deliveryLocationLabel != null && deliveryLocationLabel !== ''
    ? `${deliveryLocationLabel} · Tap to change`
    : 'Near you · Tap to change';

export const DeliveryAddressRow = memo((props: DeliveryAddressRowProps) => {
  const { deliveryLocationLabel, onSearchPress } = props;
  const subtitle = getDeliverySubtitle(deliveryLocationLabel);

  return (
    <HStack
      padding={{
        paddingVertical: theme.spacing.standard,
        paddingHorizontal: theme.spacing.large,
      }}
      items="center"
      justify="space-between"
      gap={theme.spacing.tiny}
    >
      <Pressable items="center" gap={theme.spacing.standard}>
        <Location
          size={22}
          color={theme.pallate.secondary['03']}
          variant="Bulk"
        />
        <Box>
          <Text
            type="l2"
            weight="medium"
            text="Delivery address"
            color={theme.pallate.neutral['05']}
          />
          <Text
            type="l2"
            text={subtitle}
            color={theme.pallate.neutral['04']}
            margin={{ marginBottom: theme.spacing.tiny }}
          />
        </Box>
        <ArrowDown2 size={14} color={theme.pallate.neutral['05']} />
      </Pressable>
      <Pressable onPress={onSearchPress}>
        <SearchNormal1 size={20} color={theme.pallate.neutral['05']} />
      </Pressable>
    </HStack>
  );
});

DeliveryAddressRow.displayName = 'DeliveryAddressRow';

export type { DeliveryAddressRowProps } from './delivery-address-row.types';
