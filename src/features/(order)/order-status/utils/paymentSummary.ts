import { theme } from '@components/atoms';
import type { PaymentSummaryRow } from '../components/bottom-sheet/payment-summary/payment-summary.types';

export function formatPaymentValue(value: number | string): string {
  if (typeof value === 'number') {
    const abs = Math.abs(value);
    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(abs);
    return value < 0 ? `-${formatted}` : formatted;
  }
  return value;
}

export function getPaymentRowValueColor(item: PaymentSummaryRow): string {
  const isMinus =
    (typeof item.value === 'number' && item.value < 0) ||
    (typeof item.value === 'string' && item.value.trimStart().startsWith('-'));
  return isMinus ? theme.pallate.danger['04'] : theme.pallate.neutral['05'];
}

export type PaymentRowDisplay = {
  valueColor: string;
  showIcon: boolean;
  hasDiscountValue: boolean;
  isTotal: boolean;
};

export function getPaymentRowDisplay(
  item: PaymentSummaryRow,
): PaymentRowDisplay {
  return {
    valueColor: getPaymentRowValueColor(item),
    showIcon: item.rowType === 'voucher' || item.rowType === 'point',
    hasDiscountValue:
      item.discountValue != null && item.discountValue.length > 0,
    isTotal: item.isTotal === true,
  };
}
