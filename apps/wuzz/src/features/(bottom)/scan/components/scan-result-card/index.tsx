import { Pressable, Text, theme, VStack } from '@components/atoms';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import type { MachineType } from '../../utils';
import { coinsToRupiah } from '../../utils';
import type { ScanResultCardProps } from './scan-result-card.types';

const MACHINE_LABEL: Record<MachineType, string> = {
  washer: 'Mesin Cuci',
  dryer: 'Mesin Pengering',
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.spacing.large,
    borderWidth: 1,
    borderColor: theme.pallate.neutral['02'],
    backgroundColor: theme.pallate.neutral['01'],
  },
  priceRow: {
    marginTop: theme.spacing.tiny,
  },
  button: {
    borderRadius: 999,
    backgroundColor: theme.pallate.primary['03'],
  },
  buttonOutlined: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.pallate.primary['03'],
  },
});

export const ScanResultCard = memo(function ScanResultCard({
  machineType,
  priceCoins,
  onScanAgain,
  onProcessScanned,
}: ScanResultCardProps) {
  const rupiah = coinsToRupiah(priceCoins);
  const coinsFormatted = priceCoins.toLocaleString('id-ID');
  const rupiahFormatted = `Rp ${rupiah.toLocaleString('id-ID')}`;

  return (
    <VStack
      style={styles.card}
      padding={theme.spacing.large}
      gap={theme.spacing.standard}
    >
      <Text type="s3" weight="semibold" color={theme.pallate.neutral['05']}>
        {MACHINE_LABEL[machineType]}
      </Text>
      <Text type="l1" color={theme.pallate.neutral['04']} style={styles.priceRow}>
        {coinsFormatted} koin = {rupiahFormatted}
      </Text>
      <VStack gap={theme.spacing.small} padding={{ paddingTop: theme.spacing.small }}>
        {onProcessScanned != null && (
          <Pressable
            onPress={onProcessScanned}
            padding={{
              paddingVertical: theme.spacing.standard,
              paddingHorizontal: theme.spacing.large,
            }}
            style={styles.button}
          >
            <Text type="b2" weight="semibold" color={theme.pallate.neutral['01']}>
              Gunakan mesin
            </Text>
          </Pressable>
        )}
        <Pressable
          onPress={onScanAgain}
          padding={{
            paddingVertical: theme.spacing.standard,
            paddingHorizontal: theme.spacing.large,
          }}
          style={onProcessScanned != null ? styles.buttonOutlined : styles.button}
        >
          <Text
            type="b2"
            weight="semibold"
            color={onProcessScanned != null ? theme.pallate.primary['03'] : theme.pallate.neutral['01']}
          >
            Scan lagi
          </Text>
        </Pressable>
      </VStack>
    </VStack>
  );
});
