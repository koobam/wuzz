import type { MenuItem } from '../../types';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export type MenuSectionItem = {
  category: { id: string; name: string };
  items: MenuItem[];
};

/** Single flat list row: either a section header or one menu item. */
export type FlatMenuRow =
  | { type: 'section'; category: { id: string; name: string } }
  | { type: 'item'; item: MenuItem; isLastInSection: boolean };

export type MenuItemListProps = {
  items: MenuItem[];
  searchQuery: string;
  selectedCategoryId: string | null;
  categories: { id: string; name: string }[];
  /** Width reserved for category sidebar (0 when category list is hidden). */
  categoryListWidth?: number;
  onActiveCategoryChange?: (categoryId: string) => void;
  scrollToSectionRef?: React.MutableRefObject<
    ((categoryId: string) => void) | null
  >;
  /** Optional scroll handler (e.g. for header collapse). */
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** Called when scroll ends (finger lift or momentum end). */
  onScrollEnd?: () => void;
  scrollEventThrottle?: number;
  /** Room at the bottom for the floating tab bar, so the last row is not under it. */
  bottomInset?: number;
  /** When true, empty state shows error copy and Retry. */
  isError?: boolean;
  /** Called when user taps Refresh in empty/error state. */
  onRetry?: () => void;
  /** Called when user taps "Request a new menu" in empty state. */
  onRequestMenu?: () => void;
  /** Called when user taps "Clear search" in search-empty state (only used when searchQuery is set). */
  onClearSearch?: () => void;
};
