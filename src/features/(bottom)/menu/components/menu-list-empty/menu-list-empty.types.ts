export type MenuListEmptyProps = {
  /** Empty because user searched and no results. */
  isSearchEmpty: boolean;
  /** Empty because of error (show error copy + retry). */
  isError?: boolean;
  onRetry?: () => void;
  onRequestMenu?: () => void;
  onClearSearch?: () => void;
};
