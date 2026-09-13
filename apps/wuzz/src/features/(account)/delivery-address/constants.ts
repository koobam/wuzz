import type { AddressLabelType } from './types';

/** Pilihan label + ikon saat menambah/edit alamat. */
export const ADDRESS_LABEL_OPTIONS: {
  type: AddressLabelType;
  label: string;
}[] = [
  { type: 'home', label: 'Rumah' },
  { type: 'office', label: 'Kantor' },
  { type: 'other', label: 'Lainnya' },
];
