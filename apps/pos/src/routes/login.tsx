import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { z } from 'zod';
import { isAuthenticatedIn, useSendCode, useVerifyCode } from '@/services/hooks/apis/auth';

const LoginSearchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute('/login')({
  validateSearch: LoginSearchSchema,
  beforeLoad: ({ context, search }) => {
    if (isAuthenticatedIn(context.queryClient)) {
      throw redirect({ to: search.redirect ?? '/' });
    }
  },
  component: RouteComponent,
});

const input = 'w-full rounded-md border border-input px-3 py-2 text-sm';

function RouteComponent() {
  const { redirect: redirectTo } = Route.useSearch();
  const navigate = useNavigate();
  const sendCode = useSendCode();
  const verify = useVerifyCode();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendCode.mutate(phone, { onSuccess: () => setSent(true) });
  };
  const onVerify = (e: React.FormEvent) => {
    e.preventDefault();
    verify.mutate({ phone, code }, { onSuccess: () => navigate({ to: redirectTo ?? '/' }) });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <form
        onSubmit={sent ? onVerify : onSend}
        className="w-full max-w-sm space-y-4 rounded-lg border border-border bg-card p-6"
      >
        <h1 className="text-lg font-semibold text-foreground">Wuzz POS</h1>
        <input
          className={input}
          type="tel"
          inputMode="tel"
          placeholder="Phone number"
          value={phone}
          disabled={sent}
          onChange={(e) => setPhone(e.target.value)}
          autoFocus
        />
        {sent && (
          <>
            <input
              className={input}
              inputMode="numeric"
              placeholder="Code from SMS"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoFocus
            />
            <button type="button" className="text-xs text-muted-foreground underline" onClick={() => setSent(false)}>
              Use a different number
            </button>
          </>
        )}
        {(sendCode.isError || verify.isError) && (
          <p className="text-sm text-destructive">
            {((verify.error ?? sendCode.error) as Error).message}
          </p>
        )}
        <button
          type="submit"
          disabled={sendCode.isPending || verify.isPending || !phone}
          className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {sent ? (verify.isPending ? 'Verifying…' : 'Sign in') : sendCode.isPending ? 'Sending…' : 'Send code'}
        </button>
        <p className="text-xs text-muted-foreground">For outlet staff. Ask an administrator to add your number.</p>
      </form>
    </div>
  );
}
