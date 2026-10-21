import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router';
import { isAuthenticatedIn, useLogout, useSession } from '@/services/hooks/apis/auth';

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

const nav = [
  { to: '/', label: 'Orders' },
  { to: '/users', label: 'Users' },
  { to: '/outlets', label: 'Outlets' },
  { to: '/services', label: 'Services' },
] as const;

function RouteComponent() {
  const logout = useLogout();
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-52 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-3 text-sidebar-foreground">
        <div className="mb-4 px-2 text-lg font-bold text-brand">Wuzz Admin</div>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === '/' }}
              className="rounded-md px-2 py-1.5 text-sm hover:bg-sidebar-accent"
              activeProps={{ className: 'bg-sidebar-accent font-medium' }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-sidebar-border px-2 pt-3 text-xs text-muted-foreground">
          <div className="truncate">{session?.user.name}</div>
          <button onClick={() => logout.mutate()} className="mt-1 underline">
            Sign out
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
