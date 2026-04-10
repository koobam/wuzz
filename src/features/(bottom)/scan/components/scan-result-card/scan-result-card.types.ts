import type { MachineType } from '../../utils';

export type ScanResultCardProps = {
  machineType: MachineType;
  priceCoins: number;
  onScanAgain: () => void;
  /** Dummy process scanned result (e.g. "Gunakan mesin"). */
  onProcessScanned?: () => void;
};
