import { memo } from 'react';
import { HStack, Text, theme, VStack } from '@components/atoms';
import { Box1, Lock } from 'iconsax-react-native';

export const PrivacySection = memo(() => (
  <VStack
    padding={{
      paddingHorizontal: theme.spacing.large,
      paddingBottom: theme.spacing.large,
    }}
    spacing={theme.spacing.large}
  >
    <VStack>
      <Text type="s2" weight="semibold">
        Privasi Cucianmu Aman 100%
      </Text>
      <Text type="l1" color={theme.pallate.neutral['04']}>
        Kami Jaga Privasimu, Seperti Jaga Pakaian Sendiri.
      </Text>
    </VStack>
    <HStack spacing={theme.spacing.small}>
      <VStack
        borderRadius={30}
        justify="space-between"
        padding={theme.spacing.large}
        backgroundColor={theme.pallate.neutral['02']}
        spacing={theme.spacing.small}
        fill
      >
        <Box1
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
            Cucian Diproses Terpisah
          </Text>
          <Text type="l2">
            Pesanan tidak dicampur dengan pelanggan lain.
          </Text>
        </VStack>
      </VStack>
      <VStack
        borderRadius={30}
        justify="space-between"
        padding={theme.spacing.large}
        backgroundColor={theme.pallate.neutral['02']}
        spacing={theme.spacing.small}
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
            Staff khusus yang menangani pakaianmu, memastikan privasi tetap
            terjaga.
          </Text>
        </VStack>
      </VStack>
    </HStack>
  </VStack>
));

PrivacySection.displayName = 'PrivacySection';
