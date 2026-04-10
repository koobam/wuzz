import { Flex, HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { Bag, Location } from 'iconsax-react-native';
import { memo } from 'react';
import Dash from 'react-native-dash';
import { StyleSheet } from 'react-native';
import { CURRENT_OUTLET_ADDRESS, CURRENT_OUTLET_NAME } from '../../utils';
import type { OutletAddressBlockProps } from './outlet-address-block.types';

const dashVerticalStyles = StyleSheet.create({
  vertical: {
    height: 30,
    width: 1,
    flexDirection: 'column',
    alignSelf: 'center',
  },
});

export const OutletAddressBlock = memo(function OutletAddressBlock({
  showDelivery = false,
}: OutletAddressBlockProps) {
  return (
    <HStack
      padding={{
        paddingHorizontal: theme.spacing.large,
        paddingVertical: theme.spacing.standard,
      }}
      spacing={theme.spacing.standard}
    >
      <VStack items="center" justify="center">
        <Flex
          width={50}
          height={50}
          items="center"
          justify="center"
          borderRadius={25}
          borderWidth={1}
          borderColor={theme.pallate.neutral['02']}
        >
          <Bag
            size={24}
            color={theme.pallate.primary['03']}
            variant="Bulk"
          />
        </Flex>
        {showDelivery && (
          <>
            <Dash
              dashGap={4}
              dashColor={theme.pallate.neutral['02']}
              dashLength={4}
              dashThickness={1}
              style={dashVerticalStyles.vertical}
            />
            <Flex
              width={50}
              height={50}
              items="center"
              justify="center"
              borderRadius={25}
              borderWidth={1}
              borderColor={theme.pallate.neutral['02']}
            >
              <Location
                size={24}
                color={theme.pallate.secondary['03']}
                variant="Bulk"
              />
            </Flex>
          </>
        )}
      </VStack>
      <VStack fill justify="center" spacing={theme.spacing.small}>
        <Pressable
          direction="column"
          borderWidth={1}
          borderColor={theme.pallate.neutral['02']}
          borderRadius={999}
          padding={{
            paddingVertical: theme.spacing.medium,
            paddingHorizontal: theme.spacing.large,
          }}
        >
          <Text weight="medium" type="b2">
            {CURRENT_OUTLET_NAME}
          </Text>
          <Text type="l1">{CURRENT_OUTLET_ADDRESS}</Text>
        </Pressable>
        {showDelivery && (
          <Pressable
            direction="column"
            borderWidth={1}
            borderColor={theme.pallate.neutral['02']}
            borderRadius={999}
            padding={{
              paddingVertical: theme.spacing.medium,
              paddingHorizontal: theme.spacing.large,
            }}
          >
            <Text weight="medium" type="b2">
              {CURRENT_OUTLET_NAME}
            </Text>
            <Text type="l1">{CURRENT_OUTLET_ADDRESS}</Text>
          </Pressable>
        )}
      </VStack>
    </HStack>
  );
});

export type { OutletAddressBlockProps } from './outlet-address-block.types';
