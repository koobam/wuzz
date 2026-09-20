import { createFileRoute } from '@tanstack/react-router';
import { useLogout } from '@/services/hooks/apis/auth';

export const Route = createFileRoute('/_authed/')({
  component: RouteComponent,
});

function RouteComponent() {
  const logout = useLogout();

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
      <button
        onClick={() => logout.mutate()}
        className="mt-4 rounded-md border border-input px-3 py-1.5 text-sm"
      >
        Sign out
      </button>
    </div>
  );
}
