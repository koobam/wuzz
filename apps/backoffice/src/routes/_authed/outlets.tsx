import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Badge, buttonClass, ErrorText, inputClass, Page, primaryButtonClass, Table, Td } from '@/components/ui/page';
import { createOutlet, listOutlets, type Outlet, updateOutlet } from '@/core/admin/api';

export const Route = createFileRoute('/_authed/outlets')({
  component: RouteComponent,
});

type Draft = { id?: number; name: string; address: string; phone: string; latitude: number; longitude: number; active: boolean };
const blank: Draft = { name: '', address: '', phone: '', latitude: 0, longitude: 0, active: true };

function RouteComponent() {
  const queryClient = useQueryClient();
  const outlets = useQuery({ queryKey: ['outlets'], queryFn: listOutlets });
  const [draft, setDraft] = useState<Draft | null>(null);

  const save = useMutation({
    mutationFn: (d: Draft) => {
      const { id, ...body } = d;
      return id ? updateOutlet(id, body) : createOutlet(body);
    },
    onSuccess: () => {
      setDraft(null);
      return queryClient.invalidateQueries({ queryKey: ['outlets'] });
    },
  });

  const edit = (o: Outlet) => setDraft({ ...o });

  return (
    <Page title="Outlets" actions={<button className={primaryButtonClass} onClick={() => setDraft(blank)}>Add outlet</button>}>
      <ErrorText error={outlets.error} />
      {draft && (
        <form
          className="grid gap-2 rounded-lg border border-border bg-card p-4 sm:grid-cols-2"
          onSubmit={(e) => { e.preventDefault(); save.mutate(draft); }}
        >
          <input className={inputClass} placeholder="Name" required value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          <input className={inputClass} placeholder="Phone" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
          <input className={`${inputClass} sm:col-span-2`} placeholder="Address" value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} />
          <input className={inputClass} type="number" step="any" placeholder="Latitude" value={draft.latitude} onChange={(e) => setDraft({ ...draft, latitude: Number(e.target.value) })} />
          <input className={inputClass} type="number" step="any" placeholder="Longitude" value={draft.longitude} onChange={(e) => setDraft({ ...draft, longitude: Number(e.target.value) })} />
          {draft.id && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.active} onChange={(e) => setDraft({ ...draft, active: e.target.checked })} /> Active
            </label>
          )}
          <div className="flex items-center gap-2 sm:col-span-2">
            <button className={primaryButtonClass} disabled={save.isPending}>{draft.id ? 'Save' : 'Create'}</button>
            <button type="button" className={buttonClass} onClick={() => setDraft(null)}>Cancel</button>
            <ErrorText error={save.error} />
          </div>
        </form>
      )}
      <Table head={['ID', 'Name', 'Address', 'Phone', 'Status', '']}>
        {outlets.data?.map((o) => (
          <tr key={o.id}>
            <Td>{o.id}</Td>
            <Td>{o.name}</Td>
            <Td>{o.address}</Td>
            <Td>{o.phone}</Td>
            <Td><Badge tone={o.active ? 'good' : 'warn'}>{o.active ? 'active' : 'inactive'}</Badge></Td>
            <Td><button className={buttonClass} onClick={() => edit(o)}>Edit</button></Td>
          </tr>
        ))}
      </Table>
      <p className="text-xs text-muted-foreground">Outlet staff are linked to an outlet by id: run <code>make staff PHONE=… ROLES=outlet:&lt;id&gt;</code>.</p>
    </Page>
  );
}
