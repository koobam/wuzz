export type TransactionIdRowProps = {
  dateFormatted: string;
  transactionId: string;
  onCopyPress?: (transactionId: string) => void;
};
