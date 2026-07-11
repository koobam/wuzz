import { Box, Flex, HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { Location, Trash } from 'iconsax-react-native';
import { memo } from 'react';
import { formatDistanceKm } from '@features/(outlet)/outlet-list';
import { AddressIcon } from '../address-icon';
import type { DeliveryAddress } from '../../types';

type DeliveryAddressCardProps = {
  address: DeliveryAddress;
  onPress?: (address: DeliveryAddress) => void;
  onSetDefault?: (id: string) => void;
  onRemove?: (id: string) => void;
};

export const DeliveryAddressCard = memo(
  ({ address, onPress, onSetDefault, onRemove }: DeliveryAddressCardProps) => {
    const {
      id,
      label,
      labelType,
      address: line,
      detail,
      recipientName,
      phone,
      notes,
      distanceKm,
      isDefault,
    } = address;

    return (
      <Pressable
        onPress={onPress ? () => onPress(address) : undefined}
        direction="column"
        spacing={theme.spacing.medium}
        padding={theme.spacing.large}
        borderRadius={theme.spacing.large}
        borderWidth={1}
        borderColor={
          isDefault ? theme.pallate.primary['03'] : theme.pallate.neutral['02']
        }
        backgroundColor={theme.pallate.neutral['01']}
      >
        {/* Header: ikon + label + badge default */}
        <HStack items="center" spacing={theme.spacing.standard}>
          <Flex
            items="center"
            justify="center"
            width={50}
            height={50}
            borderRadius={theme.spacing.standard}
            backgroundColor={theme.pallate.primary['01']}
          >
            <AddressIcon labelType={labelType} size={24} />
          </Flex>
          <VStack fill>
            <HStack items="center" spacing={theme.spacing.small}>
              <Text weight="semibold" color={theme.pallate.neutral['05']}>
                {label}
              </Text>
            </HStack>
            {distanceKm != null && (
              <HStack items="center" spacing={theme.spacing.tiny}>
                <Location size={16} variant="Bulk" color={theme.pallate.neutral['04']} />
                <Text type="l1" color={theme.pallate.neutral['04']}>
                  {formatDistanceKm(distanceKm)}
                </Text>
              </HStack>
            )}
          </VStack>
          {onRemove && (
            <Pressable onPress={() => onRemove(id)} padding={theme.spacing.tiny}>
              <Trash size={20} variant="Linear" color={theme.pallate.danger['03']} />
            </Pressable>
          )}
        </HStack>

        {/* Alamat + detail */}
        <VStack spacing={theme.spacing.tiny}>
          <Text type="b2" color={theme.pallate.neutral['05']}>
            {line}
          </Text>
          {detail != null && detail !== '' && (
            <Text type="l1" color={theme.pallate.neutral['04']}>
              {detail}
            </Text>
          )}
        </VStack>

        {/* Penerima */}
        <HStack items="center" spacing={theme.spacing.small}>
          <Text type="b2" weight="medium" color={theme.pallate.neutral['05']}>
            {recipientName}
          </Text>
          <Box
            width={3}
            height={3}
            borderRadius={999}
            backgroundColor={theme.pallate.neutral['04']}
          />
          <Text type="b2" color={theme.pallate.neutral['04']}>
            {phone}
          </Text>
        </HStack>
      </Pressable>
    );
  },
);

DeliveryAddressCard.displayName = 'DeliveryAddressCard';
