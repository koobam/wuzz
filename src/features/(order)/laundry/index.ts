/**
 * Laundry (order) feature.
 * Screen lives in @pages/(order)/laundry.
 * Laundry product screen: kiloan, satuan, add-ons, service types.
 */

export {
  AddOnChecklist,
  LaundryBanner,
  LaundryCard,
  LaundryDetailSkeleton,
  LaundryFooter,
  LaundryHeader,
  ServiceTypeRow,
  WashAddOnRow,
  WeightEstimateSlider,
} from './components';
export {
  useLaundryForm,
  useLaundryHeaderScroll,
  useStretchyBannerStyle,
  useWeightEstimateSlider,
  MIN_KG,
  MAX_KG,
  THUMB_SIZE,
  TRACK_HEIGHT,
  TOOLTIP_WIDTH,
} from './hooks';
export {
  ADD_ON_OPTIONS,
  ADD_ON_OPTIONAL_LABEL,
  ADD_ON_SECTION_TITLE,
  ADD_ON_SELECTION_HINT_MULTIPLE,
  ADD_ON_SELECTION_HINT_SINGLE,
  BASE_PRICE_PER_KG,
  DEFAULT_PRICE_LABEL,
  formatPriceRupiah,
  getLaundryChecklistSections,
  HEADER_SCROLL_THRESHOLD,
  LAUNDRY_ERROR_DESCRIPTION_DEFAULT,
  LAUNDRY_ERROR_TITLE_DEFAULT,
  SERVICE_TYPE_OPTIONS_DATA,
  WASH_ADD_ON_OPTIONS,
  SATUAN_OPTIONS,
} from './utils';
export type { AddOnSelectionMode } from './utils';
export type {
  AddOnId,
  AddOnOption,
  ChecklistOption,
  LaundryChecklistSection,
  ServiceTypeId,
  ServiceTypeOption,
  WashAddOnId,
} from './types';
export type {
  UseLaundryFormParams,
  UseLaundryHeaderScrollParams,
  UseStretchyBannerStyleParams,
  UseWeightEstimateSliderParams,
} from './hooks';
