import { HStack, Text, theme, VStack } from '@components/atoms';
import { DocumentText, Lock } from 'iconsax-react-native';
import { memo } from 'react';

const TERMS_CARDS = [
  {
    icon: DocumentText,
    title: '1 Mesin 1 Customer',
    description:
      'Satu mesin khusus pesanan kamu, tidak dicampur. Peralatan dibersihkan sebelum dipakai.',
  },
  {
    icon: Lock,
    title: 'Privasi Terjaga',
    description:
      'Data dan barang hanya ditangani tim terpilih, tidak dibagikan ke pihak lain.',
  },
] as const;

export const TermsAndPrivacySection = memo(() => (
  <VStack
    padding={{ paddingHorizontal: theme.spacing.large }}
    gap={theme.spacing.standard}
  >
    <Text type="s3" weight="medium" color={theme.pallate.neutral['05']}>
      Ketentuan & Privasi
    </Text>
    <HStack gap={theme.spacing.small}>
      {TERMS_CARDS.map((card) => {
        const Icon = card.icon;
        return (
          <VStack
            key={card.title}
            borderRadius={20}
            justify="space-between"
            padding={theme.spacing.large}
            backgroundColor={theme.pallate.neutral['02']}
            gap={theme.spacing.small}
            fill
            height={220}
          >
            <Icon
              size={40}
              variant="Bulk"
              color={theme.pallate.neutral['04']}
            />
            <VStack padding={{ paddingTop: theme.spacing.small }}>
              <Text
                type="b2"
                weight="semibold"
                color={theme.pallate.neutral['05']}
              >
                {card.title}
              </Text>
              <Text type="l2" color={theme.pallate.neutral['05']}>
                {card.description}
              </Text>
            </VStack>
          </VStack>
        );
      })}
    </HStack>
  </VStack>
));

TermsAndPrivacySection.displayName = 'TermsAndPrivacySection';
