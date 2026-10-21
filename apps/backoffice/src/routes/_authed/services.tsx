import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Badge, buttonClass, ErrorText, inputClass, Page, primaryButtonClass, rupiah, Table, Td } from '@/components/ui/page';
import { createService, listServices, type Service, updateService } from '@/core/admin/api';

export const Route = createFileRoute('/_authed/services')({
  component: RouteComponent,
});

type Draft = { id?: number; name: string; unit: 'kg' | 'pcs'; price: number; active: boolean };
const blank: Draft = { name: '', unit: 'kg', price: 0, active: true };

function RouteComponent() {
  const queryClient = useQueryClient();
  const services = useQuery({ queryKey: ['services'], queryFn: listServices });
  const [draft, setDraft] = useState<Draft | null>(null);

  const save = useMutation({
    mutationFn: (d: Draft) => {
      const { id, ...body } = d;
      return id ? updateService(id, body) : createService(body);
    },
    onSuccess: () => {
      setDraft(null);
      return queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });

  return (
    <Page title="Services" actions={<button className={primaryButtonClass} onClick={() => setDraft(blank)}>Add service</button>}>
      <ErrorText error={services.error} />
      {draft && (
        <form
          className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-4"
          onSubmit={(e) => { e.preventDefault(); save.mutate(draft); }}
        >
          <input className={inputClass} placeholder="Name" required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <select className={inputClass} value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value as Draft['unit'] })}>
            <option>kg</option>
            <option>pcs</option>
          </select>
          <input className={`${inputClass} w-32`} type="number" min={0} step={500} placeholder="Price (Rp)" value={draft.price} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} />
          {draft.id && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} /> Active
            </label>
          )}
          <button className={primaryButtonClass} disabled={save.isPending}>{draft.id ? 'Save' : 'Create'}</button>
          <button type="button" className={buttonClass} onClick={() => setDraft(null)}>Cancel</button>
          <ErrorText error={save.error} />
        </form>
      )}
      <Table head={['ID', 'Name', 'Unit', 'Price', 'Status', '']}>
        {services.data?.map((s: Service) => (
          <tr key={s.id}>
            <Td>{s.id}</Td>
            <Td>{s.name}</Td>
            <Td>{s.unit}</Td>
            <Td>{rupiah(s.price)}</Td>
            <Td><Badge tone={s.active ? 'good' : 'warn'}>{s.active ? 'active' : 'inactive'}</Badge></Td>
            <Td><button className={buttonClass} onClick={() => setDraft({ ...s })}>Edit</button></Td>
          </tr>
        ))}
      </Table>
      <p className="text-xs text-muted-foreground">Price changes apply to new orders; existing orders keep the price they were sold at.</p>
    </Page>
  );
}
