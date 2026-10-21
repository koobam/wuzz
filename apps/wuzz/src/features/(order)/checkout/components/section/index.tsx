import { HStack, Text, theme, VStack } from '@components/atoms';
import { memo, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';

export interface SectionProps {
  title: string;
  children: ReactNode;
  /** Drawn at the heading's right end, on its line: "Hapus Semua". */
  action?: ReactNode;
}

/** Judul dengan kartu di bawahnya: bentuk yang dipakai setiap blok di layar ini. */
export const Section = memo(function Section({
  title,
  children,
  action,
}: SectionProps) {
  return (
    <VStack
      padding={{ paddingHorizontal: theme.spacing.large }}
      gap={theme.spacing.standard}
    >
      <HStack items="center" justify="space-between">
        <Text type="s2" weight="bold" color={theme.pallate.neutral['05']}>
          {title}
        </Text>
        {action}
      </HStack>
      <VStack style={styles.card}>{children}</VStack>
    </VStack>
  );
});

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: theme.spacing.medium,
    borderRadius: 20,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: theme.pallate.neutral['03'],
    overflow: 'hidden',
  },
});
