import { HStack, Pressable, Text, theme } from '@components/atoms';
import { ArrowCircleLeft, ArrowLeft } from 'iconsax-react-native';
import { memo, type ReactNode } from 'react';
import { IconChevronLeft } from 'tabler-icons-react-native';

type AddressHeaderProps = {
  title: string;
  onBack: () => void;
  topInset: number;
  /** Aksi kanan opsional (mis. tombol tambah). */
  right?: ReactNode;
};

/** Header dengan tombol back (pola pill) + judul, konsisten dengan header app. */
export const AddressHeader = memo(
  ({ title, onBack, topInset, right }: AddressHeaderProps) => (
    <HStack
      padding={{
        paddingTop: topInset + theme.spacing.standard,
        paddingBottom: theme.spacing.standard,
        paddingHorizontal: theme.spacing.large,
      }}
      items="center"
      backgroundColor={theme.pallate.neutral['01']}
      spacing={theme.spacing.standard}
    >
      <Pressable
        padding={{
          paddingVertical: theme.spacing.standard,
          paddingHorizontal: theme.spacing.medium,
        }}
        onPress={onBack}
        self="flex-start"
        borderWidth={1}
        borderColor={theme.pallate.neutral['02']}
        items="center"
        spacing={theme.spacing.small}
        borderRadius={999}
        backgroundColor={theme.pallate.neutral['01']}
      >
        <IconChevronLeft size={20} color={theme.pallate.neutral['05']} />
        <Text weight="semibold" type="b2" color={theme.pallate.neutral['05']}>
          Delivery Address
        </Text>
      </Pressable>
    </HStack>
  ),
);

AddressHeader.displayName = 'AddressHeader';
