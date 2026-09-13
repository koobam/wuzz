import { Pressable, Text, theme, VStack } from '@components/atoms';
import { Add } from 'iconsax-react-native';
import { memo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AddAddressFooterProps = {
  onPress: () => void;
  label?: string;
};

/** Footer fixed dengan tombol tambah alamat (aware safe-area bawah). */
export const AddAddressFooter = memo(function AddAddressFooter({
  onPress,
  label = 'Tambah Alamat',
}: AddAddressFooterProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <VStack
      padding={{
        paddingHorizontal: theme.spacing.large,
        paddingTop: theme.spacing.large,
        paddingBottom: bottom
          ? bottom + theme.spacing.standard
          : theme.spacing.large,
      }}
      borderRadius={{
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
      }}
      backgroundColor={theme.pallate.neutral['01']}
      borderColor={theme.pallate.neutral['02']}
      borderWidth={{ borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1 }}
    >
      <Pressable
        onPress={onPress}
        items="center"
        justify="center"
        gap={theme.spacing.small}
        padding={theme.spacing.large}
        borderRadius={999}
        backgroundColor={theme.pallate.primary['03']}
      >
        <Text weight="semibold" color={theme.pallate.neutral['01']}>
          {label}
        </Text>
      </Pressable>
    </VStack>
  );
});

AddAddressFooter.displayName = 'AddAddressFooter';
