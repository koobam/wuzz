import { LaundryService } from '@core/api';
import type { CategoryItem } from '../../utils';

export type CategoryGridProps = {
  onCategoryPress: (item: LaundryService) => void;
  /** Category items to display (e.g. from page-level fetch + CATEGORY_ITEMS). */
  items: CategoryItem[];
  /** When true, shows a loading state for the grid. */
  isLoading?: boolean;
  /** When true, shows an error message below the grid. */
  isError?: boolean;
  /** Error object or message; used when isError is true. */
  error?: Error | { message?: string } | null;
};
