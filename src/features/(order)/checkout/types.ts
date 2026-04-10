export const TAB_NAMES = ['Pickup', 'Delivery'] as const;
export type TabName = (typeof TAB_NAMES)[number];

export type PickupOption = 'fast-track' | 'today' | 'tomorrow';

export const PICKUP_OPTIONS: PickupOption[] = [
  'fast-track',
  'today',
  'tomorrow',
];

export interface CheckoutScreenProps {
  navigation: {
    goBack: () => void;
  };
}
