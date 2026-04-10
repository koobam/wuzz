import { Text, theme, VStack } from '@components/atoms';
import { memo } from 'react';
import Dash from 'react-native-dash';
import { StyleSheet } from 'react-native';

const dashFullWidth = StyleSheet.create({
  fullWidth: { width: '100%' },
});

export const WuzzerPreferenceCard = memo(function WuzzerPreferenceCard() {
  return (
    <VStack
      margin={{
        marginHorizontal: theme.spacing.large,
        marginVertical: theme.spacing.large,
      }}
      padding={theme.spacing.large}
      borderWidth={1}
      borderColor={theme.pallate.neutral['02']}
      borderRadius={14}
      spacing={theme.spacing.medium}
    >
      <VStack>
        <Text weight="medium" type="b1">
          Preferensi Wuzzer
        </Text>
        <Text type="l1">
          Kami menghargai kenyamanan dan privasi setiap pelanggan.
        </Text>
      </VStack>
      <Dash
        dashGap={4}
        dashColor={theme.pallate.neutral['02']}
        dashLength={6}
        dashThickness={1}
        style={dashFullWidth.fullWidth}
      />
    </VStack>
  );
});
