import {
  HStack,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import { Star1 } from 'iconsax-react-native';
import { memo, useCallback, useState } from 'react';
import type { RateWuzzerSectionProps } from './rate-wuzzer-section.types';

const STAR_COUNT = 5;

export const RateWuzzerSection = memo(
  ({ wuzzerId, wuzzerName, onSubmit }: RateWuzzerSectionProps) => {
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [submitted, setSubmitted] = useState(false);

    const handleStarPress = useCallback((value: number) => {
      setSelectedRating(value);
    }, []);

    const handleSubmitPress = useCallback(() => {
      if (selectedRating < 1) return;
      onSubmit(wuzzerId, selectedRating);
      setSubmitted(true);
    }, [onSubmit, selectedRating, wuzzerId]);

    if (submitted) {
      return (
        <VStack
          padding={theme.spacing.standard}
          backgroundColor={theme.pallate.primary['01']}
          borderRadius={12}
          items="center"
        >
          <Text type="l1" color={theme.pallate.neutral['05']}>
            Terima kasih! Rating untuk {wuzzerName} telah dikirim.
          </Text>
        </VStack>
      );
    }

    return (
      <VStack
        spacing={theme.spacing.standard}
        padding={{
          paddingVertical: theme.spacing.standard,
          paddingHorizontal: theme.spacing.medium,
        }}
        backgroundColor={theme.pallate.neutral['02']}
        borderRadius={12}
      >
        <Text type="s2" weight="semibold" color={theme.pallate.neutral['05']}>
          Beri rating untuk {wuzzerName}
        </Text>
        <HStack items="center" spacing={theme.spacing.small}>
          {Array.from({ length: STAR_COUNT }, (_, i) => {
            const value = i + 1;
            const isFilled = value <= selectedRating;
            return (
              <Pressable
                key={value}
                onPress={() => handleStarPress(value)}
                padding={theme.spacing.tiny}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Star1
                  size={32}
                  color={theme.pallate.secondary['03']}
                  variant={isFilled ? 'Bold' : 'Linear'}
                />
              </Pressable>
            );
          })}
        </HStack>
        <Pressable
          onPress={handleSubmitPress}
          padding={{
            paddingVertical: theme.spacing.standard,
            paddingHorizontal: theme.spacing.medium,
          }}
          borderRadius={8}
          backgroundColor={
            selectedRating >= 1
              ? theme.pallate.primary['03']
              : theme.pallate.neutral['03']
          }
          items="center"
          justify="center"
          disabled={selectedRating < 1}
        >
          <Text
            type="b2"
            weight="semibold"
            color={
              selectedRating >= 1
                ? theme.pallate.neutral['01']
                : theme.pallate.neutral['04']
            }
          >
            Kirim rating
          </Text>
        </Pressable>
      </VStack>
    );
  }
);

RateWuzzerSection.displayName = 'RateWuzzerSection';
