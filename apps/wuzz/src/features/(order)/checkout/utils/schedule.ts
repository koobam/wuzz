import { PICKUP_DAYS, PICKUP_SLOTS } from '../types';

const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

const pad = (n: number): string => String(n).padStart(2, '0');

/** YYYY-MM-DD in the device's own time. */
export const toDateKey = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Today's date key, for the page's first selection. */
export const todayKey = (): string => toDateKey(new Date());

export type PickupDay = {
  key: string;
  /** "Hari ini", "Besok", or the weekday. */
  top: string;
  day: string;
  month: string;
};

const topLabel = (offsetDays: number, d: Date): string =>
  offsetDays === 0
    ? 'Hari ini'
    : offsetDays === 1
    ? 'Besok'
    : WEEKDAYS[d.getDay()];

/** The days a pickup can be booked on, today first. */
export const buildPickupDays = (now: Date): PickupDay[] =>
  Array.from({ length: PICKUP_DAYS }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    return {
      key: toDateKey(d),
      top: topLabel(i, d),
      day: String(d.getDate()),
      month: MONTHS[d.getMonth()],
    };
  });

/**
 * Indonesia's zone abbreviation for the device clock: UTC+7 is WIB, +8 WITA, +9
 * WIT. The windows are in the customer's own time, so naming the zone says which
 * clock they mean. Anywhere else it falls back to the plain UTC offset.
 */
export const zoneLabel = (now: Date): string => {
  const hours = -now.getTimezoneOffset() / 60;
  if (hours === 7) return 'WIB';
  if (hours === 8) return 'WITA';
  if (hours === 9) return 'WIT';
  return `GMT${hours >= 0 ? '+' : '-'}${Math.abs(hours)}`;
};

/** "Hari ini, 19 Okt · 15:00 – 17:00 WIB", or null until a window is chosen. */
export const describeSchedule = (
  dateKey: string,
  slotId: string | null,
): string | null => {
  const slot = PICKUP_SLOTS.find(s => s.id === slotId);
  if (!slot) return null;
  const now = new Date();
  const day = buildPickupDays(now).find(d => d.key === dateKey);
  if (!day) return null;
  return `${day.top}, ${day.day} ${day.month} · ${slot.label} ${zoneLabel(
    now,
  )}`;
};
