import { useCallback, useRef } from 'react';
import { useCodeScanner as useVisionCodeScanner } from 'react-native-vision-camera';
import type { Code } from 'react-native-vision-camera';

const SCAN_INTERVAL_MS = 500;

export interface UseCodeScannerOptions {
  onScan: (value: string, type?: string) => void;
  enabled?: boolean;
}

/**
 * Wraps Vision Camera's useCodeScanner for QR (and optional barcode) scanning.
 * Debounces callbacks via scanInterval and forwards first code per batch to onScan.
 */
export const useCodeScanner = ({ onScan, enabled = true }: UseCodeScannerOptions) => {
  const lastScannedRef = useRef<string | null>(null);

  const handleCodeScanned = useCallback(
    (codes: Code[]) => {
      if (!enabled || codes.length === 0) return;
      const first = codes[0];
      const value = first?.value;
      if (value != null && value !== lastScannedRef.current) {
        lastScannedRef.current = value;
        onScan(value, first?.type);
      }
    },
    [onScan, enabled],
  );

  const codeScanner = useVisionCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: handleCodeScanned,
    scanInterval: SCAN_INTERVAL_MS,
  });

  return codeScanner;
};
