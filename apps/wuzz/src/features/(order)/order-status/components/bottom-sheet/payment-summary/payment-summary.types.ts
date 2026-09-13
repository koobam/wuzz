export type PaymentSummaryRowType =
  | 'subtotal'
  | 'voucher'
  | 'point'
  | 'total';

export type PaymentSummaryRow = {
  id: string;
  rowType: PaymentSummaryRowType;
  label: string;
  /** Nilai: number (10000, -10000) diformat di frontend, atau string (subtotal/total dari BE) */
  value: number | string;
  /** Kode/nama voucher (e.g. "DISKON10"); hanya untuk row voucher/point */
  discountValue?: string;
  isTotal?: boolean;
};

export type PaymentSummaryRowItemProps = {
  item: PaymentSummaryRow;
  /** Ditampilkan di samping Total Pembayaran (logo + label, e.g. [Logo] OVO) */
  paymentMethod?: string;
};

export type PaymentSummarySectionProps = {
  rows: PaymentSummaryRow[];
  /** Ditampilkan di samping Total Pembayaran (e.g. OVO, QRIS) */
  paymentMethod?: string;
};
