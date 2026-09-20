import { env } from '@/services/env/client';

export type Admin = {
  id: string;
  name: string;
  email: string;
};

// Stub: no wuzz-backend admin auth endpoint exists yet. Shape and error
// handling here are a best guess to get the routing/guard scaffold working;
// replace the body once the real endpoint contract is known.
export async function login(credentials: { email: string; password: string }): Promise<Admin> {
  const response = await fetch(`${env.VITE_API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
}

export async function fetchSession(): Promise<Admin | null> {
  const response = await fetch(`${env.VITE_API_URL}/admin/session`, {
    credentials: 'include',
  });
  if (!response.ok) return null;
  return response.json();
}

export async function logout(): Promise<void> {
  await fetch(`${env.VITE_API_URL}/admin/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
