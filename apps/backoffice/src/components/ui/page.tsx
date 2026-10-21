import type { ReactNode } from 'react';

export const inputClass = 'rounded-md border border-input bg-background px-3 py-1.5 text-sm';
export const buttonClass =
  'rounded-md border border-input px-3 py-1.5 text-sm hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50';
export const primaryButtonClass =
  'rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50';

export function Page({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {actions}
      </div>
      {children}
    </div>
  );
}

export function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty?: string }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-border text-xs text-muted-foreground">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-3 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">{children}</tbody>
      </table>
      {empty && <p className="p-4 text-sm text-muted-foreground">{empty}</p>}
    </div>
  );
}

export const Td = ({ children, className = '' }: { children?: ReactNode; className?: string }) => (
  <td className={`px-3 py-2 ${className}`}>{children}</td>
);

export function Badge({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'good' | 'bad' | 'warn' }) {
  const tones = {
    muted: 'bg-secondary text-secondary-foreground',
    good: 'bg-green-100 text-green-800',
    bad: 'bg-destructive text-destructive-foreground',
    warn: 'bg-amber-100 text-amber-800',
  };
  return <span className={`rounded px-2 py-0.5 text-xs ${tones[tone]}`}>{children}</span>;
}

export const ErrorText = ({ error }: { error: unknown }) =>
  error ? <p className="text-sm text-destructive">{(error as Error).message}</p> : null;

export const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
