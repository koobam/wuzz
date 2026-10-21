export type CheckoutHeaderProps = {
  onBackPress: () => void;
  /** Opens help. Omitted, the pill still shows but does nothing yet. */
  onHelpPress?: () => void;
  topInset: number;
};
