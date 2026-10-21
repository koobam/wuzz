import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Badge, ErrorText, inputClass, Page, rupiah, Table, Td, buttonClass } from '@/components/ui/page';
import { listOrders, type OrderStatus, setOrderStatus } from '@/core/admin/api';

export const Route = createFileRoute('/_authed/')({
  component: RouteComponent,
});

const STATUSES: OrderStatus[] = ['created', 'processing', 'ready', 'fulfilled', 'cancelled'];
const NEXT: Partial<Record<OrderStatus, OrderStatus[]>> = {
  created: ['processing', 'cancelled'],
  processing: ['ready', 'cancelled'],
  ready: ['fulfilled'],
};
const tone = (s: OrderStatus) => (s === 'fulfilled' ? 'good' : s === 'cancelled' ? 'bad' : s === 'created' ? 'warn' : 'muted');
const PAGE = 20;

function RouteComponent() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('');
  const [offset, setOffset] = useState(0);

  const orders = useQuery({
    queryKey: ['orders', status, offset],
    queryFn: () => listOrders({ status, limit: PAGE, offset }),
    refetchInterval: 15_000,
  });
  const move = useMutation({
    mutationFn: ({ id, to }: { id: string; to: OrderStatus }) => setOrderStatus(id, to),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });

  const total = orders.data?.total ?? 0;

  return (
    <Page
      title="Orders"
      actions={
        <select className={inputClass} value={status} onChange={(e) => { setStatus(e.target.value); setOffset(0); }}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      }
    >
      <ErrorText error={orders.error ?? move.error} />
      <Table head={['Order', 'Customer', 'Outlet', 'Items', 'Total', 'Status', 'Created', '']} empty={orders.data?.items.length === 0 ? 'No orders.' : undefined}>
        {orders.data?.items.map((o) => (
          <tr key={o.id}>
            <Td className="font-mono text-xs">{o.id.slice(0, 8)}</Td>
            <Td>
              {o.customer_name}
              <div className="text-xs text-muted-foreground">{o.customer_phone}</div>
            </Td>
            <Td>#{o.outlet_id}</Td>
            <Td>{o.lines.map((l) => `${l.name} ×${l.qty}`).join(', ')}</Td>
            <Td>{rupiah(o.total)}</Td>
            <Td><Badge tone={tone(o.status)}>{o.status}</Badge></Td>
            <Td className="whitespace-nowrap text-xs">{new Date(o.created_at).toLocaleString('id-ID')}</Td>
            <Td className="whitespace-nowrap">
              {NEXT[o.status]?.map((to) => (
                <button key={to} className={`${buttonClass} mr-1`} disabled={move.isPending} onClick={() => move.mutate({ id: o.id, to })}>
                  → {to}
                </button>
              ))}
            </Td>
          </tr>
        ))}
      </Table>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{total} orders</span>
        <span className="space-x-2">
          <button className={buttonClass} disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - PAGE))}>Prev</button>
          <button className={buttonClass} disabled={offset + PAGE >= total} onClick={() => setOffset(offset + PAGE)}>Next</button>
        </span>
      </div>
    </Page>
  );
}
