import { Flex, Pressable, Text, theme, VStack } from '@components/atoms';
import { memo } from 'react';
import { PICKUP_OPTIONS } from '../../types';
import type { PickupTimeSectionProps } from './pickup-time-section.types';

export const PickupTimeSection = memo(function PickupTimeSection({
  selectedPickup,
  onSelectPickup,
}: PickupTimeSectionProps) {
  return (
    <VStack
      padding={{
        paddingHorizontal: theme.spacing.large,
        paddingVertical: theme.spacing.standard,
      }}
      spacing={theme.spacing.medium}
    >
      <Text weight="medium" type="s3">
        Waktu Penjemputan
      </Text>
      {PICKUP_OPTIONS.map((option) => (
        <Pressable
          key={option}
          onPress={() => onSelectPickup(option)}
          items="center"
          fill
          spacing={theme.spacing.standard}
        >
          <Flex
            width={25}
            height={25}
            borderRadius={15}
            borderWidth={2}
            borderColor={
              selectedPickup === option
                ? theme.pallate.primary['03']
                : theme.pallate.neutral['02']
            }
            items="center"
            justify="center"
          >
            {selectedPickup === option && (
              <Flex
                width={15}
                height={15}
                borderRadius={15}
                backgroundColor={theme.pallate.primary['03']}
              />
            )}
          </Flex>
          <VStack fill>
            <Text weight="medium" type="b2">
              Fast Track
            </Text>
            <Text type="l1" color={theme.pallate.neutral['04']}>
              60-Menit Penjemputan
            </Text>
          </VStack>
          <Text type="b1" weight="medium">
            +6.000
          </Text>
        </Pressable>
      ))}
    </VStack>
  );
});

export type { PickupTimeSectionProps } from './pickup-time-section.types';
