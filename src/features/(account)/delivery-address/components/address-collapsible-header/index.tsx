import { HStackAnimated, Pressable, Text, theme } from '@components/atoms';
import { memo, type ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { AnimatedStyle } from 'react-native-reanimated';
import { IconChevronLeft } from 'tabler-icons-react-native';

type AddressCollapsibleHeaderProps = {
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  title: string;
  onBackPress: () => void;
  /** Aksi kanan opsional (mis. tombol tambah). */
  right?: ReactNode;
};

const buttonPadding = {
  paddingVertical: theme.spacing.standard,
  paddingHorizontal: theme.spacing.medium,
};

/** Header mengambang di atas banner; background memudar masuk saat scroll. */
export const AddressCollapsibleHeader = memo(function AddressCollapsibleHeader({
  style,
  title,
  onBackPress,
  right,
}: AddressCollapsibleHeaderProps) {
  return (
    <HStackAnimated style={style} items="center" justify="space-between">
      <Pressable
        onPress={onBackPress}
        padding={buttonPadding}
        items="center"
        spacing={theme.spacing.small}
        borderRadius={999}
        borderWidth={1}
        borderColor={theme.pallate.neutral['03']}
        backgroundColor={theme.pallate.neutral['01']}
      >
        <IconChevronLeft size={20} color={theme.pallate.neutral['05']} />
        <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
          {title}
        </Text>
      </Pressable>
      {right}
    </HStackAnimated>
  );
});

AddressCollapsibleHeader.displayName = 'AddressCollapsibleHeader';
