import {
  getMachineTypeFromScannedValue,
  getPriceCoins,
  ScanResultCard,
  ScanView,
  useCameraPermission,
  useCodeScanner,
  type ScanScreenProps,
} from '@features/(bottom)/scan';
import { memo, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { theme } from '@components/atoms';

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  resultOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.large,
  },
});

const Scan = memo((_props: ScanScreenProps) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const { bottom: safeBottom } = useSafeAreaInsets();
  const [scannedResult, setScannedResult] = useState<{
    machineType: 'washer' | 'dryer';
    priceCoins: number;
  } | null>(null);

  const handleScan = useCallback((value: string) => {
    const machineType = getMachineTypeFromScannedValue(value);
    const priceCoins = getPriceCoins(machineType);
    setScannedResult({ machineType, priceCoins });
  }, []);

  const codeScanner = useCodeScanner({
    onScan: handleScan,
    enabled: hasPermission === true && scannedResult === null,
  });

  return (
    <View style={styles.wrapper}>
      <ScanView
        hasPermission={hasPermission}
        onRequestPermission={requestPermission}
        codeScanner={codeScanner}
        isActive={scannedResult === null}
      />
      {scannedResult !== null && (
        <View
          style={[
            styles.resultOverlay,
            { paddingBottom: theme.spacing.large + safeBottom },
          ]}
        >
          <ScanResultCard
            machineType={scannedResult.machineType}
            priceCoins={scannedResult.priceCoins}
            onScanAgain={() => setScannedResult(null)}
            onProcessScanned={() => {
              Toast.show({
                type: 'success',
                text1: 'Memproses scan',
                text2: `${scannedResult.machineType === 'washer' ? 'Mesin cuci' : 'Mesin pengering'} — ${scannedResult.priceCoins} koin (dummy)`,
              });
            }}
          />
        </View>
      )}
    </View>
  );
});

Scan.displayName = 'Scan';
export default Scan;
