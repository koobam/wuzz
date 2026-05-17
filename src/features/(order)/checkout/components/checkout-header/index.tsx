import {
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import { ArrowCircleLeft } from 'iconsax-react-native';
import { memo } from 'react';
import type { CheckoutHeaderProps } from './checkout-header.types';

export const CheckoutHeader = memo(function CheckoutHeader({
  onBackPress,
  topInset,
}: CheckoutHeaderProps) {
  return (
    <VStack
      padding={{
        paddingTop: topInset + theme.spacing.standard,
        paddingBottom: theme.spacing.standard,
        paddingHorizontal: theme.spacing.large,
      }}
      gap={theme.spacing.standard}
    >
      <Pressable
        padding={{
          paddingVertical: theme.spacing.standard,
          paddingHorizontal: theme.spacing.medium,
        }}
        onPress={onBackPress}
        self="flex-start"
        borderWidth={1}
        borderColor={theme.pallate.neutral['02']}
        items="center"
        gap={theme.spacing.small}
        borderRadius={999}
        backgroundColor={theme.pallate.neutral['01']}
      >
        <ArrowCircleLeft
          variant="Bulk"
          size={24}
          color={theme.pallate.neutral['04']}
        />
        <Text type="b2" weight="bold" color={theme.pallate.neutral['04']}>
          Checkout
        </Text>
      </Pressable>
    </VStack>
  );
});

export type { CheckoutHeaderProps } from './checkout-header.types';
