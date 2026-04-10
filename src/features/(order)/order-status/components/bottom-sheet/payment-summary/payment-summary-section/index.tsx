import { Flex, HStack, Text, theme, VStack } from '@components/atoms';
import { Coin1, TicketDiscount } from 'iconsax-react-native';
import { FlashList } from '@shopify/flash-list';
import { memo, useCallback } from 'react';
import Dash from 'react-native-dash';
import {
  formatPaymentValue,
  getPaymentRowDisplay,
} from '../../../../utils';
import type {
  PaymentSummaryRow,
  PaymentSummaryRowItemProps,
  PaymentSummarySectionProps,
} from '../payment-summary.types';
import { PaymentSummarySeparator } from '../payment-summary-separator';

export const PaymentSummaryRowItem = memo(
  ({ item, paymentMethod }: PaymentSummaryRowItemProps) => {
    const { valueColor, showIcon, hasDiscountValue, isTotal } =
      getPaymentRowDisplay(item);
    const showPaymentMethod =
      isTotal && paymentMethod != null && paymentMethod.length > 0;

    return (
      <VStack spacing={theme.spacing.standard}>
        {isTotal && (
          <Dash
            dashColor={theme.pallate.neutral['03']}
            dashGap={4}
            dashLength={4}
            dashThickness={1}
          />
        )}
        <HStack
          justify="space-between"
          items="flex-end"
          spacing={theme.spacing.standard}
        >
          <VStack spacing={theme.spacing.small}>
            {showPaymentMethod && (
              <HStack fill items="center" spacing={theme.spacing.small}>
                <Flex
                  width={50}
                  height={30}
                  backgroundColor={theme.pallate.neutral['03']}
                />
                <Text type="b2" color={theme.pallate.neutral['05']}>
                  {paymentMethod}
                </Text>
              </HStack>
            )}
            <Text
              type="l1"
              weight={isTotal ? 'semibold' : undefined}
              color={theme.pallate.neutral['05']}
            >
              {item.label}
            </Text>
          </VStack>

          <VStack items="flex-end" spacing={theme.spacing.tiny}>
            <HStack items="center" spacing={theme.spacing.tiny}>
              {showIcon &&
                (item.rowType === 'voucher' ? (
                  <TicketDiscount size={20} variant="Bulk" color={valueColor} />
                ) : (
                  <Coin1 size={20} variant="Bulk" color={valueColor} />
                ))}
              {hasDiscountValue && (
                <Text type="l1" weight="semibold" color={valueColor}>
                  {item.discountValue}
                </Text>
              )}
              <Text
                type={isTotal ? 'b2' : 'l1'}
                weight={isTotal ? 'semibold' : undefined}
                color={valueColor}
              >
                {formatPaymentValue(item.value)}
              </Text>
            </HStack>
          </VStack>
        </HStack>
      </VStack>
    );
  },
);

PaymentSummaryRowItem.displayName = 'PaymentSummaryRowItem';

export const PaymentSummarySection = memo(
  ({ rows, paymentMethod }: PaymentSummarySectionProps) => {
    const renderRow = useCallback(
      ({ item }: { item: PaymentSummaryRow }) => (
        <PaymentSummaryRowItem
          item={item}
          paymentMethod={item.isTotal ? paymentMethod : undefined}
        />
      ),
      [paymentMethod],
    );

    const keyExtractor = useCallback((item: PaymentSummaryRow) => item.id, []);

    return (
      <VStack spacing={theme.spacing.standard}>
        <Text type="s3" weight="medium" color={theme.pallate.neutral['05']}>
          Ringkasan Pembayaran
        </Text>
        <FlashList<PaymentSummaryRow>
          data={rows}
          renderItem={renderRow}
          ItemSeparatorComponent={PaymentSummarySeparator}
          keyExtractor={keyExtractor}
          scrollEnabled={false}
        />
      </VStack>
    );
  },
);

PaymentSummarySection.displayName = 'PaymentSummarySection';
