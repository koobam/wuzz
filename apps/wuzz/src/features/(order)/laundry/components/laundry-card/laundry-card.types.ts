export type LaundryCardProps = {
  title?: string;
  description?: string;
  /** Untuk multiple (kiloan). Diabaikan jika priceLabel diisi. */
  basePricePerKg?: number;
  /** Jika diisi (e.g. single = selected options + service), tampilkan ini. */
  priceLabel?: string;
  /** Unit untuk harga (e.g. "kg", "item"). Ditampilkan sebagai suffix "/{unit}" saat base price. */
  priceUnit?: string;
  /** When true (default), show "/kg" after price when priceUnit tidak diisi. Hanya dipakai jika priceLabel tidak diisi. */
  showKgLabel?: boolean;
};
