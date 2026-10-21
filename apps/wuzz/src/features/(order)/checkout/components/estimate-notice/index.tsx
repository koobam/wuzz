import { HStack, Text, theme } from '@components/atoms';
import { InfoCircle } from 'iconsax-react-native';
import { memo } from 'react';
import { StyleSheet } from 'react-native';

/**
 * A short note under a kiloan line: the price is an estimate, and how the gap is
 * settled once the laundry is weighed.
 */
export const EstimateNotice = memo(function EstimateNotice() {
  return (
    <HStack gap={theme.spacing.small} style={styles.note}>
      <InfoCircle
        size={16}
        variant="Bold"
        color={theme.pallate.secondary['03']}
      />
      <Text type="l2" color={theme.pallate.neutral['04']} fill>
        Harga final dihitung dari berat asli setelah cucian ditimbang. Kalau
        lebih, selisihnya dikembalikan. Kalau kurang, dibayar saat Wuzzer tiba.
      </Text>
    </HStack>
  );
});

const styles = StyleSheet.create({
  note: { alignItems: 'flex-start' },
});
