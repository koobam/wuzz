import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '@/app';
import { ErrorBoundary, initSentry } from '@/core/sentry';
import '@/styles/entry.css';

initSentry();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* A render error shows this instead of a blank page, and is reported. */}
    <ErrorBoundary
      fallback={
        <div className="p-6 text-sm">
          Terjadi kesalahan. Muat ulang halaman; jika berulang, hubungi admin.
        </div>
      }
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
