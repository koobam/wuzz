export type PickupTimeSectionProps = {
  /** The chosen day, as YYYY-MM-DD in the device's own time. */
  date: string;
  /** The chosen window's id, or null until one is picked. */
  slotId: string | null;
  onSelectDate: (date: string) => void;
  onSelectSlot: (slotId: string) => void;
  /** The padding of whatever holds this: the day strip runs out to its edges. */
  bleed?: number;
  /** The line above the windows. */
  timeLabel?: string;
};
