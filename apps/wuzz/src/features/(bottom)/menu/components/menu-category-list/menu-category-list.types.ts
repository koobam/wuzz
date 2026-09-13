import type { MenuCategory } from '../../types';
import type { FlashListRef } from '@shopify/flash-list';

export type MenuCategoryListProps = {
  categories: MenuCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  /** Ref to scroll the list (e.g. scrollToIndex when selection changes). */
  listRef?: React.RefObject<FlashListRef<MenuCategory> | null>;
};
