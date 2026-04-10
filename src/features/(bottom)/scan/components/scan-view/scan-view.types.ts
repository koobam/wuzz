import type { CodeScanner } from 'react-native-vision-camera';

export type ScanViewProps = {
  hasPermission: boolean | null;
  onRequestPermission: () => void;
  codeScanner: CodeScanner;
  isActive?: boolean;
};
