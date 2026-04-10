import { Text, theme, VStack } from '@components/atoms';
import { memo } from 'react';
import { CustomerNoteSection } from '../customer-note-section';
import { DetailBadgesRow } from '../detail-badges-row';
import { PriceBreakdownSection } from '../price-breakdown-section';
import { TermsAndPrivacySection } from '../terms-and-privacy-section';
import { WhatWeDoSection } from '../what-we-do-section';
import type { OrderStatusItemDetailSheetContentProps } from './order-status-item-detail-sheet-content.types';

export const OrderStatusItemDetailSheetContent = memo(
  ({ item }: OrderStatusItemDetailSheetContentProps) => {
    if (item == null) {
      return null;
    }

    const showBadges =
      (item.laundryKg != null && item.laundryKg > 0) ||
      item.serviceTier != null;

    return (
      <VStack
        spacing={theme.spacing.large}
        padding={{ paddingBottom: theme.spacing.large }}
      >
        <VStack
          padding={{ paddingHorizontal: theme.spacing.large }}
          spacing={theme.spacing.standard}
        >
          {showBadges && <DetailBadgesRow item={item} />}

          <Text type="s3" weight="medium" color={theme.pallate.neutral['05']}>
            Ringkasan Harga Layanan
          </Text>
          <PriceBreakdownSection prices={item.prices} total={item.total} />
          <CustomerNoteSection note={item.note ?? ''} />
        </VStack>

        <WhatWeDoSection steps={item.whatWeDo} />
        <TermsAndPrivacySection />
      </VStack>
    );
  },
);

OrderStatusItemDetailSheetContent.displayName =
  'OrderStatusItemDetailSheetContent';
