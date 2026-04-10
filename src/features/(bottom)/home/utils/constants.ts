export const DOT_WIDTH_ACTIVE = 40;
export const DOT_WIDTH_INACTIVE = 10;

/** Banner image URLs from Unsplash (laundry / coffee / lifestyle, 800px width for hero). */
export const BANNER_IMAGES = [
  'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
];

export type ProductAddOnType = 'single' | 'multiple';

export type OnlyServiceItem = {
  id: string;
  name: string;
  icon?: string;
  promo?: string;
  /** Untuk navigasi ke layar laundry (dari API alacarte). */
  serviceType?: 'kiloan' | 'satuan';
  /** Jika diset, dipakai oleh kartu alih-alih onServicePress global. */
  onPress?: () => void;
};

export const ONLY_SERVICE_ITEMS: OnlyServiceItem[] = [];
