import type { ReactNode } from 'react';

/** Tier code dari API (mis. "reguler", "express", "kilat"). */
export type ServiceTypeId = string;

export type WashAddOnId = 'cuci_lipat_only' | 'setrika';

export type AddOnId =
  | 'lipat'
  | 'setrika'
  | 'white_clothes_treatment'
  | 'pewangi_premium'
  | 'pelindung_warna';

/** Satu blok checklist di halaman laundry (bisa banyak, dinamis). */
export interface LaundryChecklistSection {
  id: string;
  title?: string;
  options: ChecklistOption[];
  selectionMode: 'single' | 'multiple';
  canOptOut?: boolean;
}

/** Icon names supported for checklist options (IcoMoon + legacy). */
export type ChecklistOptionIcon =
  | 'fold'
  | 'iron'
  | 'white'
  | 'pewangi_premium'
  | 'pelindung_warna'
  | 'bag';

/** Generic option for checklist (add-ons kiloan or satuan items). */
export interface ChecklistOption {
  id: string;
  icon: ChecklistOptionIcon;
  label: string;
  description?: string;
  /** When true, no extra charge and auto-selected by default */
  free?: boolean;
  /** Harga tampilan (e.g. "Rp 25.000") */
  priceSubtitle?: string;
  /** Harga numerik untuk kalkulasi (satuan = per item, add-on = per kg pakai extraPerKg) */
  price?: number;
  /** Tambahan per kg (untuk add-on kiloan). Kalau tidak ada, pakai 0. */
  extraPerKg?: number;
}

export interface AddOnOption extends ChecklistOption {
  id: AddOnId;
}

export interface ServiceTypeOption {
  id: ServiceTypeId;
  title: string;
  /** Est. waktu selesai, e.g. "6 jam", "3 jam" */
  duration?: string;
  priceSubtitle?: string;
  /** Tambahan per kg (kiloan). Untuk kalkulasi harga. */
  extraPerKg?: number;
  /** Tambahan per pesanan (satuan). Untuk kalkulasi harga. */
  extraSatuan?: number;
  /** Wording shown below the row when this option is selected */
  selectedCopy?: string;
  /** When set, shows a badge at top right (e.g. "-10%", "Promo") */
  promo?: string;
  /** Dummy icon element; replace with real icon later */
  icon: ReactNode;
}

/** Service type option data without icon (e.g. for utils/constants) */
export type ServiceTypeOptionData = Omit<ServiceTypeOption, 'icon'>;
