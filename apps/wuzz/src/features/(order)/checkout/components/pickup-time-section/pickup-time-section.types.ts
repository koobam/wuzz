import type { PickupOption } from '../../types';

export type PickupTimeSectionProps = {
  selectedPickup: PickupOption;
  onSelectPickup: (option: PickupOption) => void;
};
