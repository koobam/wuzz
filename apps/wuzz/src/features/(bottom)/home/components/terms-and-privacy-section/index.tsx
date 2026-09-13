import { memo } from 'react';
import { HStack, Text, theme, VStack } from '@components/atoms';
import { DocumentText, Lock } from 'iconsax-react-native';

export const TermsAndPrivacySection = memo(() => (
  <VStack
    padding={{
      paddingHorizontal: theme.spacing.large,
      paddingBottom: theme.spacing.large,
    }}
    gap={theme.spacing.large}
  >
    <VStack>
      <Text type="s2" weight="semibold">
        Ketentuan & Privasi
      </Text>
      <Text type="l1" color={theme.pallate.neutral['04']}>
        Satu mesin satu customer. Cucianmu aman dan privasi terjaga.
      </Text>
    </VStack>
    <HStack gap={theme.spacing.small}>
      <VStack
        borderRadius={30}
        justify="space-between"
        padding={theme.spacing.large}
        backgroundColor={theme.pallate.neutral['02']}
        gap={theme.spacing.small}
        fill
      >
        <DocumentText
          size={48}
          variant="Bulk"
          color={theme.pallate.neutral['04']}
        />
        <VStack
          padding={{
            paddingTop: theme.spacing.large,
          }}
        >
          <Text type="b2" weight="semibold">
            1 Mesin 1 Customer
          </Text>
          <Text type="l2">
            Pesanan tidak dicampur dengan pelanggan lain. Proses terpisah dan
            peralatan dibersihkan.
          </Text>
        </VStack>
      </VStack>
      <VStack
        borderRadius={30}
        justify="space-between"
        padding={theme.spacing.large}
        backgroundColor={theme.pallate.neutral['02']}
        gap={theme.spacing.small}
        fill
      >
        <Lock
          size={48}
          variant="Bulk"
          color={theme.pallate.neutral['04']}
        />
        <VStack
          padding={{
            paddingTop: theme.spacing.large,
          }}
        >
          <Text type="b2" weight="semibold">
            Privasi Terjaga
          </Text>
          <Text type="l2">
            Data dan barang kamu hanya ditangani tim terpilih, tidak dibagikan ke
            pihak lain.
          </Text>
        </VStack>
      </VStack>
    </HStack>
  </VStack>
));

TermsAndPrivacySection.displayName = 'TermsAndPrivacySection';
