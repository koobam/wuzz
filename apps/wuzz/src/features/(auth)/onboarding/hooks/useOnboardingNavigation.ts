import { useCallback, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  Dimensions,
} from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import { FlashListRef } from '@shopify/flash-list';
import { RootStackParamList } from '@navigation/root/root.types';
import { OnboardingSlide } from '../helpers';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface UseOnboardingNavigationParams {
  slides: OnboardingSlide[];
}

export const useOnboardingNavigation = ({
  slides,
}: UseOnboardingNavigationParams) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const flatListRef = useRef<FlashListRef<OnboardingSlide>>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollX.value = event.nativeEvent.contentOffset.x;
      const index = Math.round(
        event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
      );
      setCurrentIndex(index);
    },
    [scrollX],
  );

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToOffset({
        offset: (currentIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      navigation.navigate('login');
    }
  }, [currentIndex, slides.length, navigation]);

  const handleSkip = useCallback(() => {
    navigation.navigate('login');
  }, [navigation]);

  const handleCreateAccount = useCallback(() => {
    navigation.navigate('register');
  }, [navigation]);

  const keyExtractor = useCallback((item: OnboardingSlide) => item.id, []);

  return {
    flatListRef,
    currentIndex,
    scrollX,
    handleScroll,
    handleNext,
    handleSkip,
    handleCreateAccount,
    keyExtractor,
  };
};

