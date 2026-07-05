import { LaundryService } from '@core/api';

export type CategoryCardProps = {
  item: LaundryService;
  backgroundColor: string;
  /** Tilt in degrees applied to the card. Default 0. */
  rotation?: number;
  /** Fixed card width (px). */
  width: number;
  /** How much this card overlaps the previous one (px). */
  overlap: number;
  /** Position in the row; drives overlap offset and stacking order. */
  index: number;
  onPress: () => void;
};
