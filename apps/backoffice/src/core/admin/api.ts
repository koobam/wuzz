import { api, patch, post } from '@/core/api/http';

export type Page<T> = { items: T[]; total: number };

export type User = {
  id: string;
  username: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive' | 'banned';
  roles: string[];
  points: number;
  streak: number;
  xp: number;
  created_at: string;
};

export type Outlet = { id: number; name: string; address: string; phone: string; latitude: number; longitude: number; active: boolean };
export type Service = { id: number; name: string; unit: 'kg' | 'pcs'; price: number; active: boolean };

export type OrderStatus = 'created' | 'processing' | 'ready' | 'fulfilled' | 'cancelled';
export type Order = {
  id: string;
  outlet_id: number;
  customer_name: string;
  customer_phone: string;
  lines: { item_id: number; name: string; unit: string; price: number; qty: number }[];
  total: number;
  status: OrderStatus;
  created_at: string;
};

const qs = (params: Record<string, string | number | undefined>) => {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== '') q.set(k, String(v));
  const s = q.toString();
  return s ? `?${s}` : '';
};

export const listUsers = (p: { query?: string; status?: string; limit?: number; offset?: number }) =>
  api<Page<User>>(`/users${qs(p)}`);
export const setUserStatus = (id: string, status: User['status']) => patch<User>(`/users/${id}/status`, { status });

export const listOutlets = () => api<Outlet[]>('/outlets');
export const createOutlet = (o: Omit<Outlet, 'id' | 'active'>) => post<Outlet>('/outlets', o);
export const updateOutlet = (id: number, o: Omit<Outlet, 'id'>) => patch<Outlet>(`/outlets/${id}`, o);

export const listServices = () => api<Service[]>('/services');
export const createService = (s: Omit<Service, 'id' | 'active'>) => post<Service>('/services', s);
export const updateService = (id: number, s: Omit<Service, 'id'>) => patch<Service>(`/services/${id}`, s);

export const listOrders = (p: { status?: string; outlet_id?: number; limit?: number; offset?: number }) =>
  api<Page<Order>>(`/orders${qs(p)}`);
export const setOrderStatus = (id: string, status: OrderStatus) => patch<Order>(`/orders/${id}/status`, { status });
