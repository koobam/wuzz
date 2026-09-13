/** Format amount in Rupiah for display (e.g. "Rp 25.000") */
export function formatPriceRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

/**
 * Format service type price for subtitle (dari extraPerKg / extraSatuan).
 * forSatuan true = satuan (per order), false = kiloan (per kg).
 */
export function formatServicePriceSubtitle(
  extraPerKg: number | undefined,
  extraSatuan: number | undefined,
  forSatuan: boolean,
): string | undefined {
  if (forSatuan) {
    const value = extraSatuan ?? 0;
    if (value <= 0) return undefined;
    return `+${formatPriceRupiah(value)}`;
  }
  const value = extraPerKg ?? 0;
  if (value <= 0) return undefined;
  return `+${value.toLocaleString('id-ID')}/kg`;
}

/** Format add-on price per kg for display (e.g. "+Rp 3.000/kg"). */
export function formatAddOnPriceSubtitle(extraPerKg: number): string {
  return `+${formatPriceRupiah(extraPerKg)}/kg`;
}
