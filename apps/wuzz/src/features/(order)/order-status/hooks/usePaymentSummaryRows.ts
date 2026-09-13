import { useMemo } from 'react';
import type { PaymentSummaryRow } from '../components/bottom-sheet/payment-summary';
import type { OrderStatusDetail } from '../types';

export function usePaymentSummaryRows(
  order: OrderStatusDetail,
): PaymentSummaryRow[] {
  return useMemo((): PaymentSummaryRow[] => {
    const rows: PaymentSummaryRow[] = [
      {
        id: 'subtotal',
        rowType: 'subtotal',
        label: 'Subtotal',
        value: order.subtotalFormatted ?? order.totalFormatted,
      },
    ];
    if (
      order.voucherLabel != null ||
      order.voucherDiscountAmount != null ||
      order.voucherDiscountFormatted != null
    ) {
      const voucherValue =
        typeof order.voucherDiscountAmount === 'number'
          ? order.voucherDiscountAmount
          : (order.voucherDiscountFormatted ?? '');
      rows.push({
        id: 'voucher',
        rowType: 'voucher',
        label: 'Voucher',
        value: voucherValue,
        discountValue: order.voucherLabel ?? undefined,
      });
    }
    rows.push({
      id: 'total',
      rowType: 'total',
      label: 'Total Pembayaran',
      value: order.totalFormatted,
      isTotal: true,
    });
    return rows;
  }, [
    order.subtotalFormatted,
    order.totalFormatted,
    order.voucherLabel,
    order.voucherDiscountAmount,
    order.voucherDiscountFormatted,
  ]);
}
