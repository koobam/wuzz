/** How the order changes hands: a Wuzzer comes to the door (delivery), or the
 *  customer brings and collects it at an outlet themselves (pickup). */
export type OrderMethod = 'delivery' | 'pickup';

export const ORDER_METHOD_OPTIONS: {
  value: OrderMethod;
  label: string;
  description: string;
}[] = [
  {
    value: 'delivery',
    label: 'Delivery',
    description: 'Wuzzer menjemput dan mengantar ke rumahmu',
  },
  {
    value: 'pickup',
    label: 'Pickup',
    description: 'Kamu ambil sendiri di outlet terdekat',
  },
];

/** When the Wuzzer comes: right away, or at a day and window the customer picks. */
export type OrderTiming = 'instant' | 'scheduled';

/**
 * "Instan" costs extra because a Wuzzer has to be pulled off whatever they were
 * doing. The amount is a placeholder (the old Fast Track price) until pricing is
 * set; change it here.
 */
export const ORDER_TIMING_OPTIONS: {
  value: OrderTiming;
  label: string;
  description: string;
  fee: number;
  /** How long until the Wuzzer is at the door, shown beside the label. */
  eta?: string;
}[] = [
  {
    value: 'instant',
    label: 'Instan',
    description: 'Wuzzer berangkat sekarang',
    eta: '30–35 menit',
    fee: 6000,
  },
  {
    value: 'scheduled',
    label: 'Jadwalkan',
    description: 'Pilih tanggal dan jam',
    fee: 0,
  },
];

/** Which Wuzzer the customer is most comfortable with coming to the door. */
export type WuzzerPreference = 'any' | 'female' | 'male';

/**
 * What each choice adds to the order, in rupiah. Asking for a particular Wuzzer
 * narrows who can be sent, so it costs a little extra. The amounts are a
 * placeholder until pricing is set; change them here.
 */
export const WUZZER_PREFERENCES: {
  value: WuzzerPreference;
  label: string;
  fee: number;
}[] = [
  {
    value: 'any',
    label: 'Bebas',
    fee: 0,
  },
  {
    value: 'female',
    label: 'Perempuan',
    fee: 5000,
  },
  {
    value: 'male',
    label: 'Laki-laki',
    fee: 5000,
  },
];

/**
 * The windows a pickup can be booked in. A placeholder for the real opening
 * hours, which are not in any backend yet: change them here when they are.
 */
export const PICKUP_SLOTS: { id: string; startHour: number; label: string }[] =
  [
    { id: '08-10', startHour: 8, label: '08:00 – 10:00' },
    { id: '10-12', startHour: 10, label: '10:00 – 12:00' },
    { id: '13-15', startHour: 13, label: '13:00 – 15:00' },
    { id: '15-17', startHour: 15, label: '15:00 – 17:00' },
    { id: '17-19', startHour: 17, label: '17:00 – 19:00' },
  ];

/** How many days ahead a pickup can be booked, today included. */
export const PICKUP_DAYS = 7;

/** A slot must start at least this long from now to be bookable today. */
export const PICKUP_LEAD_MINUTES = 60;

export interface CheckoutScreenProps {
  navigation: {
    goBack: () => void;
  };
}
