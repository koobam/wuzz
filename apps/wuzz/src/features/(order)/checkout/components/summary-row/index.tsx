import { HStack, Text, theme } from '@components/atoms';
import { memo } from 'react';

export interface SummaryRowProps {
  label: string;
  value: string;
  /** Untuk total: label dan angka sama-sama tebal. */
  bold?: boolean;
}

export const SummaryRow = memo(function SummaryRow({
  label,
  value,
  bold,
}: SummaryRowProps) {
  const weight = bold ? 'bold' : 'regular';
  return (
    <HStack items="center" justify="space-between" gap={theme.spacing.standard}>
      <Text type="b2" weight={weight} color={theme.pallate.neutral['05']} fill>
        {label}
      </Text>
      <Text type="b2" weight={weight} color={theme.pallate.neutral['05']}>
        {value}
      </Text>
    </HStack>
  );
});
