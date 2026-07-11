import { Flex, HStack, Pressable, Text, theme } from '@components/atoms';
import { memo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { ADDRESS_LABEL_OPTIONS } from '../../constants';
import type { AddressLabelType } from '../../types';
import { AddressIcon } from '../address-icon';

type AddressLabelRowProps = {
  selectedType: AddressLabelType;
  onSelect: (type: AddressLabelType, label: string) => void;
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: 'transparent',
  },
  selectedBorder: {
    borderColor: theme.pallate.primary['03'],
  },
});

/** Pemilih label alamat bergaya kartu tier (seperti ServiceTypeRow laundry). */
export const AddressLabelRow = memo(function AddressLabelRow({
  selectedType,
  onSelect,
}: AddressLabelRowProps) {
  const { width } = useWindowDimensions();
  const horizontalPadding = theme.spacing.large * 2;
  const gap = theme.spacing.standard;
  const cardWidth = (width - horizontalPadding - gap * 2) / 3;

  return (
    <HStack items="stretch" spacing={gap}>
      {ADDRESS_LABEL_OPTIONS.map(option => {
        const selected = selectedType === option.type;
        const activeColor = selected
          ? theme.pallate.primary['03']
          : theme.pallate.neutral['04'];
        return (
          <Pressable
            key={option.type}
            onPress={() => onSelect(option.type, option.label)}
            direction="column"
            items="center"
            padding={theme.spacing.standard}
            width={cardWidth}
            borderRadius={theme.spacing.standard}
            backgroundColor={theme.pallate.neutral['02']}
            style={[styles.card, selected && styles.selectedBorder]}
          >
            <Flex
              width={56}
              height={56}
              items="center"
              justify="center"
              margin={{ marginBottom: theme.spacing.small }}
              borderRadius={theme.spacing.standard}
              backgroundColor={theme.pallate.primary['01']}
            >
              <AddressIcon labelType={option.type} size={28} color={activeColor} />
            </Flex>
            <Text
              type="b2"
              weight="semibold"
              color={
                selected
                  ? theme.pallate.neutral['05']
                  : theme.pallate.neutral['04']
              }
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </HStack>
  );
});

AddressLabelRow.displayName = 'AddressLabelRow';
