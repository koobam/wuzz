import type { OrderStatusType } from '../types';

/** Separator for joining item description chips (e.g. "Express • Pewangi Premium") */
export const DESCRIPTION_SEPARATOR = ' • ';

/** Service tier labels for order summary / detail (Express, Kilat, Reguler) */
export const SERVICE_TIER_LABEL: Record<
  'express' | 'kilat' | 'reguler',
  string
> = {
  express: 'Express',
  kilat: 'Kilat',
  reguler: 'Reguler',
};

export const ORDER_STATUSES: OrderStatusType[] = [
  'pending',
  'confirmed',
  'driver_pickup',
  'at_outlet',
  'delivery_to_customer',
  'completed',
];

const MAP_VISIBLE_STATUSES: OrderStatusType[] = [
  'driver_pickup',
  'delivery_to_customer',
];

export const shouldShowMap = (status: OrderStatusType | undefined): boolean => {
  if (!status) return false;
  return MAP_VISIBLE_STATUSES.includes(status);
};

export const ORDER_STATUS_LABELS: Record<OrderStatusType, string> = {
  pending: 'Menunggu konfirmasi',
  confirmed: 'Pesanan dikonfirmasi',
  driver_pickup: 'Driver menuju lokasi pickup',
  at_outlet: 'Driver di outlet',
  delivery_to_customer: 'Driver mengantar ke lokasimu',
  completed: 'Pesanan selesai',
};

export type OrderStatusStepConfig = {
  title: string;
  description: string;
};

export const ORDER_STATUS_STEP_CONFIG: Record<
  OrderStatusType,
  OrderStatusStepConfig
> = {
  pending: {
    title: 'Menunggu Pembayaran',
    description:
      'Pesanan kamu akan segera diproses setelah pembayaran kamu diverifikasi.',
  },
  confirmed: {
    title: 'Pesanan Dikonfirmasi',
    description: 'Outlet telah menerima pesanan. Menunggu driver pickup.',
  },
  driver_pickup: {
    title: 'Driver Menuju Outlet',
    description: 'Wuzzer sedang dalam perjalanan ke outlet untuk mengambil pesanan.',
  },
  at_outlet: {
    title: 'Driver di Outlet',
    description: 'Wuzzer sedang mengambil pesanan di outlet.',
  },
  delivery_to_customer: {
    title: 'Dalam Pengiriman',
    description: 'Pesanan sedang diantar ke lokasimu.',
  },
  completed: {
    title: 'Pesanan Selesai',
    description: 'Terima kasih! Pesanan sudah sampai.',
  },
};
