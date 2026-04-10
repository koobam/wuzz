import React, { memo } from 'react';
import {
  Dimensions,
  StyleSheet,
  type LayoutRectangle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import {
  VStackAnimated,
  VStack,
  Text,
  theme,
} from '@components/atoms';
import Image from '@components/atoms/image';
import { OnboardingSlide } from '../helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Layout extends LayoutRectangle {}

interface SlideItemProps {
  item: OnboardingSlide;
  scrollX: SharedValue<number>;
  layout: Layout;
  slides: OnboardingSlide[];
}

export const SlideItem = memo(
  ({ item, scrollX, layout, slides }: SlideItemProps) => {
    const index = slides.findIndex(slide => slide.id === item.id);

    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ];

      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.3, 1, 0.3],
        Extrapolation.CLAMP,
      );

      const scale = interpolate(
        scrollX.value,
        inputRange,
        [0.8, 1, 0.8],
        Extrapolation.CLAMP,
      );

      const translateY = interpolate(
        scrollX.value,
        inputRange,
        [50, 0, 50],
        Extrapolation.CLAMP,
      );

      return {
        opacity,
        width: layout.width,
        height: layout.height,
        transform: [{ scale }, { translateY }],
      };
    });

    return (
      <VStackAnimated
        padding={{
          paddingBottom: theme.spacing.large,
        }}
        items="center"
        justify="center"
        spacing={theme.spacing.large}
        style={animatedStyle}
      >
        <VStack fill>
          <Image
            uri={item.image}
            resizeMode="contain"
            style={styles.image}
          />
        </VStack>
        <VStack>
          <Text
            align="center"
            type="h3"
            weight="bold"
            color={theme.pallate.neutral['01']}
          >
            {item.title}
          </Text>
          <Text align="center" type="b1" color={theme.pallate.neutral['01']}>
            {item.description}
          </Text>
        </VStack>
      </VStackAnimated>
    );
  },
);

SlideItem.displayName = 'SlideItem';

const styles = StyleSheet.create({
  image: {
    height: '100%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
});

