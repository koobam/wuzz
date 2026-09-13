import { HStack, Pressable, Text, theme } from '@components/atoms';
import { Copy } from 'iconsax-react-native';
import { memo, useCallback } from 'react';
import type { TransactionIdRowProps } from './transaction-id-row.types';

export const TransactionIdRow = memo(
  ({ dateFormatted, transactionId, onCopyPress }: TransactionIdRowProps) => {
    const handleCopyPress = useCallback(() => {
      onCopyPress?.(transactionId);
    }, [onCopyPress, transactionId]);

    return (
      <HStack items="center" justify="space-between">
        <Text type="l1" color={theme.pallate.neutral['04']}>
          {dateFormatted}
        </Text>
        <Pressable
          padding={{
            paddingHorizontal: theme.spacing.standard,
            paddingVertical: theme.spacing.small,
          }}
          borderRadius={8}
          items="center"
          gap={theme.spacing.small}
          backgroundColor={theme.pallate.neutral['02']}
          onPress={handleCopyPress}
        >
          <Text type="l2" color={theme.pallate.neutral['04']}>
            {transactionId}
          </Text>
          <Copy
            color={theme.pallate.neutral['04']}
            size={16}
            variant="Bulk"
          />
        </Pressable>
      </HStack>
    );
  }
);

TransactionIdRow.displayName = 'TransactionIdRow';
