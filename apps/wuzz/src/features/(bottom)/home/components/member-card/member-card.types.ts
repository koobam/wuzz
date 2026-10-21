import type { MemberSummary } from '@core/api';

export type MemberCardProps = {
  isAuthenticated: boolean;
  summary?: MemberSummary | null;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  /** Guest: take the user to sign in. */
  onLoginPress: () => void;
  /** Tapping the member card (when signed in). Home leaves this unset until there is a membership screen. */
  onPress?: () => void;
};
