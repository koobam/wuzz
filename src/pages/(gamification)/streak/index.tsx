import React, { memo, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { ArrowLeft2 } from 'iconsax-react-native';
import { StreakContent } from '@features/(bottom)/profile';
import type { StreakStatus } from '@features/(bottom)/profile';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/root/root.types';

type StreakScreenProps = NativeStackScreenProps<RootStackParamList, 'streak'>;

const DEFAULT_STREAK = 7;
const DEFAULT_STREAK_STATUS: StreakStatus = 'active';

const StreakScreen = memo(function StreakScreen({
  navigation,
}: StreakScreenProps) {
  const { top } = useSafeAreaInsets();

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <VStack fill backgroundColor={theme.pallate.neutral['01']}>
      <HStack
        padding={{
          paddingTop: top + theme.spacing.standard,
          paddingBottom: theme.spacing.standard,
          paddingHorizontal: theme.spacing.large,
        }}
        items="center"
        spacing={theme.spacing.standard}
      >
        <Pressable
          onPress={handleBackPress}
          padding={{
            paddingVertical: theme.spacing.small,
            paddingHorizontal: theme.spacing.small,
          }}
          accessibilityRole="button"
          accessibilityLabel="Kembali"
        >
          <ArrowLeft2
            size={24}
            color={theme.pallate.neutral['05']}
            variant="Linear"
          />
        </Pressable>
        <Text
          type="s2"
          weight="bold"
          color={theme.pallate.neutral['05']}
          text="Current Streak"
        />
      </HStack>
      <VStack
        fill
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingBottom: theme.spacing.extraLarge * 2,
        }}
        as={<ScrollView />}
      >
        <StreakContent
          currentStreak={DEFAULT_STREAK}
          status={DEFAULT_STREAK_STATUS}
        />
      </VStack>
    </VStack>
  );
});

export default StreakScreen;
