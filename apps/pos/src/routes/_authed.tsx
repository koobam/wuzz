import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';
import { startSync } from '@/core/pos/outbox';
import { useOnline, useOrders } from '@/core/pos/hooks';
import { isAuthenticatedIn, useLogout } from '@/services/hooks/apis/auth';

/**
 * Pathless layout route: everything nested under `_authed/` requires a
 * session. The guard runs before any child loader, so protected data is
 * never fetched for an anonymous visitor.
 */
export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context, location }) => {
    if (!isAuthenticatedIn(context.queryClient)) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: RouteComponent,
});

const linkClass = 'rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-accent';

function RouteComponent() {
  const online = useOnline();
  const logout = useLogout();
  const { data: orders } = useOrders();
  const unsynced = orders?.filter((o) => o.sync !== 'synced').length ?? 0;

  useEffect(() => startSync(), []);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center gap-2 border-b border-border bg-card px-4 py-2">
        <span className="mr-4 font-semibold text-brand">Wuzz POS</span>
        <Link to="/" className={linkClass} activeProps={{ className: 'bg-accent text-foreground' }} activeOptions={{ exact: true }}>
          New order
        </Link>
        <Link to="/orders" className={linkClass} activeProps={{ className: 'bg-accent text-foreground' }}>
          Orders
        </Link>
        <Link to="/chat" className={linkClass} activeProps={{ className: 'bg-accent text-foreground' }}>
          Chat
        </Link>
        <span className="ml-auto flex items-center gap-3 text-xs">
          <span className={online ? 'text-green-600' : 'text-destructive'}>
            {online ? 'Online' : 'Offline — orders are saved on this device'}
          </span>
          {unsynced > 0 && <span className="text-muted-foreground">{unsynced} waiting to sync</span>}
          <button onClick={() => logout.mutate()} className="rounded-md border border-input px-2 py-1">
            Sign out
          </button>
        </span>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
