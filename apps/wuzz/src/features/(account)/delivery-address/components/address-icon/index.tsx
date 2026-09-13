import { theme } from '@components/atoms';
import { Home2, Buildings2, Location } from 'iconsax-react-native';
import { memo } from 'react';
import type { AddressLabelType } from '../../types';

type AddressIconProps = {
  labelType: AddressLabelType;
  size?: number;
  color?: string;
  variant?: 'Linear' | 'Bulk' | 'Bold';
};

/** Ikon custom sesuai jenis label alamat. */
export const AddressIcon = memo(
  ({
    labelType,
    size = 22,
    color = theme.pallate.primary['03'],
    variant = 'Bulk',
  }: AddressIconProps) => {
    if (labelType === 'home') {
      return <Home2 size={size} color={color} variant={variant} />;
    }
    if (labelType === 'office') {
      return <Buildings2 size={size} color={color} variant={variant} />;
    }
    return <Location size={size} color={color} variant={variant} />;
  },
);

AddressIcon.displayName = 'AddressIcon';
