import { LaundryService } from '@core/api';

export type CategoryCardProps = {
  item: LaundryService;
  /** Fixed card width (px); the label wraps within it. */
  width: number;
  onPress: () => void;
};
