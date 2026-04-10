import { HStack, Text, theme, VStack } from '@components/atoms';
import { DocumentText } from 'iconsax-react-native';
import { memo } from 'react';
import type { CustomerNoteSectionProps } from './customer-note-section.types';

export const CustomerNoteSection = memo(({ note }: CustomerNoteSectionProps) => {
  if (!note?.trim()) {
    return null;
  }

  return (
    <VStack
      padding={{
        paddingVertical: theme.spacing.standard,
      }}
      spacing={theme.spacing.small}
    >
      <HStack spacing={theme.spacing.small} items="center">
        <DocumentText
          size={20}
          variant="Linear"
          color={theme.pallate.neutral['05']}
        />
        <Text
          type="b2"
          weight="medium"
          color={theme.pallate.neutral['05']}
        >
          Catatan Pelanggan
        </Text>
      </HStack>
      <Text type="l1" color={theme.pallate.neutral['05']}>
        {note}
      </Text>
    </VStack>
  );
});

CustomerNoteSection.displayName = 'CustomerNoteSection';
