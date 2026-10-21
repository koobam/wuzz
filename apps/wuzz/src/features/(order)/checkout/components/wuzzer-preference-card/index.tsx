import { HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { formatPriceRupiah } from '@features/(order)/laundry/utils/format';
import { Man, People, Woman } from 'iconsax-react-native';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { WUZZER_PREFERENCES, type WuzzerPreference } from '../../types';

export interface WuzzerPreferenceCardProps {
  value: WuzzerPreference;
  onChange: (value: WuzzerPreference) => void;
}

const ICON: Record<WuzzerPreference, typeof People> = {
  any: People,
  female: Woman,
  male: Man,
};

/** Which Wuzzer the customer would rather have at the door: three equal tiles,
 *  each with a bare glyph, its name and what it adds to the price. A preference, not a
 *  guarantee: the nearest available Wuzzer who fits is sent. */
export const WuzzerPreferenceCard = memo(function WuzzerPreferenceCard({
  value,
  onChange,
}: WuzzerPreferenceCardProps) {
  return (
    <VStack
      padding={{ paddingVertical: theme.spacing.medium }}
      gap={theme.spacing.standard}
    >
      <HStack gap={theme.spacing.small}>
        {WUZZER_PREFERENCES.map(option => {
          const selected = option.value === value;
          const Icon = ICON[option.value];
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              direction="column"
              items="center"
              gap={theme.spacing.tiny}
              style={[styles.tile, selected && styles.tileSelected]}
            >
              <Icon
                size={28}
                variant="Bold"
                color={
                  selected
                    ? theme.pallate.primary['03']
                    : theme.pallate.neutral['05']
                }
              />
              <Text type="b2" weight="bold" numberOfLines={1}>
                {option.label}
              </Text>
              <Text
                type="l2"
                weight={option.fee > 0 ? 'semibold' : 'regular'}
                color={
                  option.fee > 0
                    ? theme.pallate.primary['03']
                    : theme.pallate.neutral['04']
                }
              >
                {option.fee > 0
                  ? `+${formatPriceRupiah(option.fee)}`
                  : 'Gratis'}
              </Text>
            </Pressable>
          );
        })}
      </HStack>
      <Text type="l2" color={theme.pallate.neutral['04']}>
        Kami menghargai kenyamanan dan privasi setiap pelanggan. Wuzzer terdekat
        yang sesuai pilihanmu yang akan dikirim.
      </Text>
    </VStack>
  );
});
export type { WuzzerPreference } from '../../types';

const styles = StyleSheet.create({
  // Three equal tiles in a row.
  tile: {
    flex: 1,
    paddingVertical: theme.spacing.standard,
    paddingHorizontal: theme.spacing.small,
    borderRadius: 16,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: theme.pallate.neutral['03'],
    backgroundColor: theme.pallate.neutral['01'],
  },
  tileSelected: {
    borderColor: theme.pallate.primary['03'],
    backgroundColor: theme.pallate.primary['01'],
  },
});
