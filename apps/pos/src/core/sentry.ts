import * as Sentry from '@sentry/react';
import { env } from '@/services/env/client';

/**
 * Starts error reporting when VITE_SENTRY_DSN is set; with no DSN it does nothing.
 * Only errors are sent: no performance traces, no session replay, no user data.
 */
export function initSentry() {
  if (!env.VITE_SENTRY_DSN) return;
  Sentry.init({
    dsn: env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
  });
}

export const ErrorBoundary = Sentry.ErrorBoundary;
