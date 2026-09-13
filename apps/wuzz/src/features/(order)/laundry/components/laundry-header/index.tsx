import {
  HStackAnimated,
  Pressable,
  Text,
  theme,
} from '@components/atoms';
import { memo } from 'react';
import { IconChevronLeft, IconHelp } from 'tabler-icons-react-native';
import type { LaundryHeaderProps } from './laundry-header.types';

const buttonPadding = {
  paddingVertical: theme.spacing.standard,
  paddingHorizontal: theme.spacing.medium,
};

const buttonCommon = {
  items: 'center' as const,
  spacing: theme.spacing.small,
  borderRadius: 999,
  borderWidth: 1,
  borderColor: theme.pallate.neutral['03'],
  backgroundColor: theme.pallate.neutral['01'],
};

export const LaundryHeader = memo(function LaundryHeader({
  style,
  title,
  onBackPress,
  onHelpPress,
}: LaundryHeaderProps) {
  return (
    <HStackAnimated
      style={style}
      justify="space-between"
    >
      <Pressable
        onPress={onBackPress}
        padding={buttonPadding}
        {...buttonCommon}
      >
        <IconChevronLeft size={20} color={theme.pallate.neutral['05']} />
        <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
          {title}
        </Text>
      </Pressable>
      <Pressable
        onPress={onHelpPress}
        padding={buttonPadding}
        {...buttonCommon}
      >
        <IconHelp size={20} color={theme.pallate.neutral['05']} />
        <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
          Bantuan
        </Text>
      </Pressable>
    </HStackAnimated>
  );
});

export type { LaundryHeaderProps } from './laundry-header.types';
