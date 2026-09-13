/** Jenis label alamat → menentukan ikon custom-nya. */
export type AddressLabelType = 'home' | 'office' | 'other';

export interface DeliveryAddress {
  id: string;
  /** Label bebas: "Rumah", "Kantor", "Kos Ani", dll. */
  label: string;
  /** Menentukan ikon custom kartu. */
  labelType: AddressLabelType;
  /** Alamat utama (baris jalan). */
  address: string;
  /** Detail / patokan (nomor rumah, RT/RW, lantai, warna pagar). */
  detail?: string;
  /** Nama penerima. */
  recipientName: string;
  /** Nomor HP penerima. */
  phone: string;
  /** Catatan untuk kurir. */
  notes?: string;
  lat: number;
  lng: number;
  /** Jarak dari outlet (km) — untuk ditampilkan. */
  distanceKm?: number;
  /** Alamat default. */
  isDefault?: boolean;
}

/** Draft form saat menambah alamat (belum punya id). */
export type DeliveryAddressDraft = Omit<DeliveryAddress, 'id'>;
