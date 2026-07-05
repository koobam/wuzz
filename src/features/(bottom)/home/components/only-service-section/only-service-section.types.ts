import type { OnlyServiceItem } from '../../utils';

export type OnlyServiceSectionProps = {
  onServicePress: (item: OnlyServiceItem) => void;
  /** Override items (e.g. with onPress per item). Default: ONLY_SERVICE_ITEMS */
  items: OnlyServiceItem[];
};

export type OnlyServiceCardProps = {
  item: OnlyServiceItem;
  onPress: () => void;
};
