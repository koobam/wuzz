/**
 * Helper untuk hasil scan mesin laundry: washer vs dryer dan harga (koin).
 * 1 koin = 1 rupiah.
 */

export type MachineType = 'washer' | 'dryer';

/** Harga per penggunaan dalam koin (1 koin = Rp 1). */
export const PRICE_WASHER_COINS = 5_000;
export const PRICE_DRYER_COINS = 4_000;

export const COIN_TO_RUPIAH = 1;

/**
 * Dari nilai QR yang di-scan, deteksi apakah mesin cuci (washer) atau pengering (dryer).
 * Contoh isi QR: "washer-01", "dryer-A2", "MESIN_CUCI_1", dll.
 */
export function getMachineTypeFromScannedValue(value: string): MachineType {
  const lower = value.trim().toLowerCase();
  if (lower.includes('dryer') || lower.includes('pengering')) return 'dryer';
  return 'washer';
}

export function getPriceCoins(machineType: MachineType): number {
  return machineType === 'washer' ? PRICE_WASHER_COINS : PRICE_DRYER_COINS;
}

export function coinsToRupiah(coins: number): number {
  return coins * COIN_TO_RUPIAH;
}
