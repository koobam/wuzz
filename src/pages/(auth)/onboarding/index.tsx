import React, { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  VStack,
  HStack,
  Text,
  Button,
  theme,
  Box,
} from '@components/atoms';
import { PaperclipSvg } from '@assets/index';
import { FlashList } from '@shopify/flash-list';
import useOnLayout from '@hooks/utils/useOnLayout';
import { onboardingSlides } from '@features/auth/onboarding/helpers';
import { useOnboardingNavigation } from '@features/auth/onboarding/hooks';
import { SlideItem, Paginator } from '@features/auth/onboarding/components';

const Onboarding = memo(() => {
  const { top, bottom } = useSafeAreaInsets();
  const [layout, onLayout] = useOnLayout();

  // Navigation and scroll logic
  const {
    flatListRef,
    currentIndex,
    scrollX,
    handleScroll,
    handleNext,
    handleSkip,
    handleCreateAccount,
    keyExtractor,
  } = useOnboardingNavigation({ slides: onboardingSlides });

  // Render slide item
  const renderSlideItem = useCallback(
    ({ item }: { item: typeof onboardingSlides[0] }) => (
      <SlideItem item={item} scrollX={scrollX} layout={layout} slides={onboardingSlides} />
    ),
    [scrollX, layout],
  );

  return (
    <VStack fill padding={{ paddingTop: top }}>
      {/* Skip Button */}
      <HStack
        padding={{
          paddingHorizontal: theme.spacing.large,
        }}
        items="center"
        justify="space-between"
      >
        {/* Logo on the left */}
        <PaperclipSvg />

        {/* Skip Button on the right */}
        <Button rounded variant="secondary" size="sm" onPress={handleSkip} items="center" justify="center" gap={theme.spacing.small}>
          <Text type="b2" weight="medium" color={theme.pallate.neutral['01']}>
            Bahasa
          </Text>
          <Box borderRadius={15} width={30} height={30} backgroundColor={theme.pallate.neutral['01']} />
        </Button>
      </HStack>

      {/* Slides */}
      <VStack onLayout={onLayout} fill>
        <FlashList
          ref={flatListRef}
          data={onboardingSlides}
          renderItem={renderSlideItem}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
        />
      </VStack>

      {/* Footer */}
      <VStack
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingBottom: bottom + theme.spacing.large,
        }}
        gap={theme.spacing.large}
      >
        {/* Pagination Dots */}
        <Paginator scrollX={scrollX} slides={onboardingSlides} />

        {/* Action Buttons */}
        <HStack gap={theme.spacing.small} justify="center">
          <Button fill variant="primary" size="lg" rounded onPress={handleNext}>
            <Text type="b2" weight="semibold" color={theme.pallate.neutral['05']}>
              {currentIndex === onboardingSlides.length - 1
                ? 'Begin Journey!'
                : 'Continue to the Next Step!'
              }
            </Text>
          </Button>

          {currentIndex === onboardingSlides.length - 1 && (
            <Button
              fill
              variant="secondary"
              size="lg"
              rounded
              onPress={handleCreateAccount}
            >
              <Text
                type="b2"
                weight="semibold"
                color={theme.pallate.neutral['01']}
              >
                Create Account
              </Text>
            </Button>
          )}
        </HStack>
        <Text
          type="b2"
          color={theme.pallate.neutral['02']}
          style={styles.termsText}
        >
          By continuing to{' '}
          <Text type="b2" color={theme.pallate.neutral['01']}>
            login
          </Text>{' '}
          or{' '}
          <Text type="b2" color={theme.pallate.neutral['01']}>
            register
          </Text>
          , you agree to our{' '}
          <Text
            type="b2"
            color={theme.pallate.neutral['01']}
            style={styles.linkText}
          >
            Terms of Service
          </Text>{' '}
          and{' '}
          <Text
            type="b2"
            color={theme.pallate.neutral['01']}
            style={styles.linkText}
          >
            Privacy Policy
          </Text>
          .
        </Text>
      </VStack>
    </VStack>
  );
});

Onboarding.displayName = 'Onboarding';

const styles = StyleSheet.create({
  termsText: {
    textAlign: 'center',
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});

export default Onboarding;
