export type DeliveryAddressRowProps = {
  /** Label for delivery/pickup (e.g. "Home"). When empty, subtitle shows "Near you · Tap to change". */
  deliveryLocationLabel?: string;
  onSearchPress?: () => void;
};
