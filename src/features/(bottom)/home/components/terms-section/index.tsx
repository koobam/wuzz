import { memo } from 'react';
import { HStack, Text, theme, VStack } from '@components/atoms';
import { DocumentText, TickCircle } from 'iconsax-react-native';

export const TermsSection = memo(() => (
  <VStack
    padding={{
      paddingHorizontal: theme.spacing.large,
      paddingBottom: theme.spacing.large,
    }}
    gap={theme.spacing.large}
  >
    <VStack>
      <Text type="s2" weight="semibold">
        Ketentuan Layanan
      </Text>
      <Text type="l1" color={theme.pallate.neutral['04']}>
        Satu mesin satu customer. Pesanan kamu diproses terpisah dan aman.
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
            Satu mesin cuci khusus untuk pesanan kamu—tidak dicampur dengan
            pelanggan lain.
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
        <TickCircle
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
            Proses Terpisah
          </Text>
          <Text type="l2">
            Peralatan dan area kerja dibersihkan sebelum menangani pesanan
            kamu.
          </Text>
        </VStack>
      </VStack>
    </HStack>
  </VStack>
));

TermsSection.displayName = 'TermsSection';
