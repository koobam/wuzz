import { HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { memo } from 'react';

export interface BusinessCardProps {
  onContactPress: () => void;
}

/** Ajakan untuk pelanggan bisnis (kos, salon, usaha kecil): volume besar dilayani lewat kontak, bukan pesan biasa. */
export const BusinessCard = memo(function BusinessCard({
  onContactPress,
}: BusinessCardProps) {
  return (
    <HStack
      items="center"
      gap={theme.spacing.standard}
      margin={{ marginHorizontal: theme.spacing.large }}
      padding={theme.spacing.large}
      borderRadius={20}
      backgroundColor={theme.pallate.neutral['05']}
    >
      <Text
        fill
        type="b2"
        weight="semibold"
        color={theme.pallate.neutral['01']}
      >
        Cuci dalam jumlah besar untuk kos, salon, atau usahamu?
      </Text>
      <Pressable
        onPress={onContactPress}
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingVertical: theme.spacing.standard,
        }}
        borderRadius={999}
        backgroundColor={theme.pallate.neutral['01']}
      >
        <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
          Kontak kami
        </Text>
      </Pressable>
    </HStack>
  );
});
