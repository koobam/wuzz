import React, { memo } from 'react';
import { HStack, theme } from '@components/atoms';
import { type SharedValue } from 'react-native-reanimated';
import { PaginatorDot } from './PaginatorDot';
import { OnboardingSlide } from '../helpers';

interface PaginatorProps {
  scrollX: SharedValue<number>;
  slides: OnboardingSlide[];
}

export const Paginator = memo(({ scrollX, slides }: PaginatorProps) => {
  return (
    <HStack items="center" justify="center" gap={theme.spacing.small}>
      {slides.map((_, index) => (
        <PaginatorDot key={index.toString()} index={index} scrollX={scrollX} />
      ))}
    </HStack>
  );
});

Paginator.displayName = 'Paginator';

