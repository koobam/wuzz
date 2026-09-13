import { HStack, Pressable, Text, theme } from '@components/atoms';
import { memo, useCallback, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import type { WashAddOnId } from '../../types';
import { WASH_ADD_ON_OPTIONS } from '../../utils';
import type { WashAddOnRowProps } from './wash-add-on-row.types';

const styles = StyleSheet.create({
  option: {
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedBorder: {
    borderColor: theme.pallate.primary['03'],
  },
});

export const WashAddOnRow = memo(function WashAddOnRow({
  onSelect,
}: WashAddOnRowProps) {
  const { width } = useWindowDimensions();
  const [selectedId, setSelectedId] = useState<WashAddOnId>('cuci_lipat_only');

  const horizontalPadding = theme.spacing.large * 2;
  const gap = theme.spacing.standard;
  const optionWidth = (width - horizontalPadding - gap) / WASH_ADD_ON_OPTIONS.length;

  const handlePress = useCallback(
    (id: WashAddOnId) => {
      setSelectedId(id);
      onSelect?.(id);
    },
    [onSelect],
  );

  return (
    <HStack
      padding={{ paddingHorizontal: theme.spacing.large }}
      gap={theme.spacing.standard}
      items="stretch"
    >
      {WASH_ADD_ON_OPTIONS.map((opt) => (
        <Pressable
          key={opt.id}
          onPress={() => handlePress(opt.id)}
          direction="column"
          items="center"
          justify="center"
          padding={theme.spacing.standard}
          width={optionWidth}
          borderRadius={theme.spacing.large}
          backgroundColor={theme.pallate.neutral['02']}
          style={[styles.option, selectedId === opt.id && styles.selectedBorder]}
        >
          <Text type="b2" weight="semibold" color={theme.pallate.neutral['05']}>
            {opt.label}
          </Text>
        </Pressable>
      ))}
    </HStack>
  );
});

export type { WashAddOnRowProps } from './wash-add-on-row.types';
