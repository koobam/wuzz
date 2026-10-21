import { QueryProvider } from '@/components/providers/query-provider';
import { RouterWithAuth } from '@/components/providers/router-with-auth';

export function App() {
  return (
    <QueryProvider>
      <RouterWithAuth />
    </QueryProvider>
  );
}
