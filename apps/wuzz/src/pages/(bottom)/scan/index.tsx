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
import { Pressable, theme } from '@components/atoms';
import { IconX } from 'tabler-icons-react-native';

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  closeButton: {
    position: 'absolute',
    left: theme.spacing.large,
  },
  resultOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: theme.spacing.large,
    paddingBottom: theme.spacing.large,
  },
});

const Scan = memo(({ navigation }: ScanScreenProps) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const { top: safeTop, bottom: safeBottom } = useSafeAreaInsets();
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
      <Pressable
        onPress={navigation.goBack}
        accessibilityLabel="Tutup"
        items="center"
        justify="center"
        width={44}
        height={44}
        borderRadius={14}
        borderWidth={1}
        borderColor={theme.pallate.neutral['03']}
        backgroundColor={theme.pallate.neutral['01']}
        style={[styles.closeButton, { top: safeTop + theme.spacing.standard }]}
      >
        <IconX size={22} color={theme.pallate.neutral['05']} />
      </Pressable>
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
                text2: `${
                  scannedResult.machineType === 'washer'
                    ? 'Mesin cuci'
                    : 'Mesin pengering'
                } — ${scannedResult.priceCoins} koin (dummy)`,
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
