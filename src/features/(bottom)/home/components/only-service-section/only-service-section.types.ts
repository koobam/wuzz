
export type OnlyServiceSectionProps = {
  onServicePress: (id: number) => void;
  /** Override items (e.g. with onPress per item). Default: ONLY_SERVICE_ITEMS */
  items?: OnlyServiceItem[];
};

export type OnlyServiceCardProps = {
  item: OnlyServiceItem;
  onPress: () => void;
};

export type OnlyServiceItem = {
  id: number;
  name: string;
  serviceType: string; // e.g. 'satuan', 'express', etc. (used for navigation param)
  icon: string; // icon name from Icon component (default: 'bag')
  promo?: string; // e.g. '20%' or 'Free' (optional)
};
