import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Badge, buttonClass, ErrorText, inputClass, Page, Table, Td } from '@/components/ui/page';
import { listUsers, setUserStatus, type User } from '@/core/admin/api';

export const Route = createFileRoute('/_authed/users')({
  component: RouteComponent,
});

const PAGE = 20;
const tone = (s: User['status']) => (s === 'active' ? 'good' : s === 'banned' ? 'bad' : 'warn');

function RouteComponent() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [offset, setOffset] = useState(0);

  const users = useQuery({
    queryKey: ['users', query, status, offset],
    queryFn: () => listUsers({ query, status, limit: PAGE, offset }),
    placeholderData: keepPreviousData,
  });
  const change = useMutation({
    mutationFn: ({ id, to }: { id: string; to: User['status'] }) => setUserStatus(id, to),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
  const total = users.data?.total ?? 0;

  return (
    <Page
      title="Users"
      actions={
        <div className="flex gap-2">
          <input className={inputClass} placeholder="Search name, username, phone" value={query} onChange={(e) => { setQuery(e.target.value); setOffset(0); }} />
          <select className={inputClass} value={status} onChange={(e) => { setStatus(e.target.value); setOffset(0); }}>
            <option value="">All</option>
            <option>active</option>
            <option>inactive</option>
            <option>banned</option>
          </select>
        </div>
      }
    >
      <ErrorText error={users.error ?? change.error} />
      <Table head={['User', 'Phone', 'Roles', 'Points', 'Streak', 'Status', 'Joined', '']}>
        {users.data?.items.map((u) => (
          <tr key={u.id}>
            <Td>
              {u.name}
              <div className="text-xs text-muted-foreground">@{u.username}</div>
            </Td>
            <Td>{u.phone}</Td>
            <Td>{u.roles.length ? u.roles.join(', ') : <span className="text-muted-foreground">customer</span>}</Td>
            <Td>{u.points}</Td>
            <Td>{u.streak}</Td>
            <Td><Badge tone={tone(u.status)}>{u.status}</Badge></Td>
            <Td className="whitespace-nowrap text-xs">{new Date(u.created_at).toLocaleDateString('id-ID')}</Td>
            <Td>
              {u.status === 'banned' ? (
                <button className={buttonClass} disabled={change.isPending} onClick={() => change.mutate({ id: u.id, to: 'active' })}>Unban</button>
              ) : (
                <button
                  className={buttonClass}
                  disabled={change.isPending}
                  onClick={() => confirm(`Ban ${u.name}? They will not be able to sign in.`) && change.mutate({ id: u.id, to: 'banned' })}
                >
                  Ban
                </button>
              )}
            </Td>
          </tr>
        ))}
      </Table>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{total} users</span>
        <span className="space-x-2">
          <button className={buttonClass} disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))}>Prev</button>
          <button className={buttonClass} disabled={offset + PAGE >= total} onClick={() => setOffset(offset + PAGE)}>Next</button>
        </span>
      </div>
    </Page>
  );
}
