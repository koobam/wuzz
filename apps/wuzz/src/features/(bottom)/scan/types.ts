/**
 * Scan (bottom) feature types.
 * Screen lives in @pages/(bottom)/scan.
 */

export interface ScanScreenProps {
  navigation: {
    navigate: (params: { name: string; params?: object }) => void;
    goBack: () => void;
  };
}

export interface ScannedCodeResult {
  value: string;
  type?: string;
}
