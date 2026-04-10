/**
 * Scan (bottom) feature.
 * Screen lives in @pages/(bottom)/scan.
 */

export { ScanOverlay, ScanResultCard, ScanView } from './components';
export type { ScanViewProps } from './components';
export { useCameraPermission, useCodeScanner } from './hooks';
export type { UseCodeScannerOptions } from './hooks';
export type { ScanScreenProps, ScannedCodeResult } from './types';
export {
  getMachineTypeFromScannedValue,
  getPriceCoins,
  coinsToRupiah,
  PRICE_WASHER_COINS,
  PRICE_DRYER_COINS,
  COIN_TO_RUPIAH,
} from './utils';
export type { MachineType } from './utils';
