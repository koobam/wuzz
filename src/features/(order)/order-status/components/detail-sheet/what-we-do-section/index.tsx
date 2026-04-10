import { Text, theme, VStack } from '@components/atoms';
import { FlashList } from '@shopify/flash-list';
import { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import type { WhatWeDoStep } from '../../../types';
import { WhatWeDoStepCard } from '../what-we-do-step-card';
import { StepListSeparator } from '../step-list-separator';
import type { WhatWeDoSectionProps } from './what-we-do-section.types';

const styles = StyleSheet.create({
  list: {
    height: 150,
  },
  listContent: {
    paddingHorizontal: theme.spacing.large,
  },
});

export const WhatWeDoSection = memo(({ steps }: WhatWeDoSectionProps) => {
  const renderStepItem = useCallback(
    ({ item: step, index }: { item: WhatWeDoStep; index: number }) => (
      <WhatWeDoStepCard step={step} index={index} />
    ),
    [],
  );

  const keyExtractorStep = useCallback(
    (step: WhatWeDoStep, index: number) => `${step.title}-${index}`,
    [],
  );

  return (
    <VStack spacing={theme.spacing.standard}>
      <Text
        type="s3"
        padding={{ paddingHorizontal: theme.spacing.large }}
        weight="medium"
        color={theme.pallate.neutral['05']}
      >
        Yang akan kami lakukan
      </Text>
      <FlashList
        data={steps}
        horizontal
        scrollEnabled
        contentContainerStyle={styles.listContent}
        style={styles.list}
        ItemSeparatorComponent={StepListSeparator}
        showsHorizontalScrollIndicator={false}
        renderItem={renderStepItem}
        keyExtractor={keyExtractorStep}
      />
    </VStack>
  );
});

WhatWeDoSection.displayName = 'WhatWeDoSection';
