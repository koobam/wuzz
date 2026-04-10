import { theme, VStack } from '@components/atoms';
import { memo } from 'react';
import type { IllustrationSectionProps } from './illustration-section.types';

export const IllustrationSection = memo(
  ({ backgroundColor = theme.pallate.neutral['02'] }: IllustrationSectionProps) => (
    <VStack fill backgroundColor={backgroundColor} />
  ),
);

IllustrationSection.displayName = 'IllustrationSection';
