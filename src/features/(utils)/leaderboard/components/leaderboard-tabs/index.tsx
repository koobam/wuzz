import { memo, useCallback, useEffect, useRef } from 'react';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Icon, Pressable, Text, theme, VStack } from '@components/atoms';
import { LOCKED_TIERS, TIER_COLOR, TIERS, TIER_LABEL } from '../../utils';
import type { Tier } from '../../utils';
import type { LeaderboardTabsProps } from './leaderboard-tabs.types';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TAB_WIDTH = 120;
const INDICATOR_DURATION = 220;

const styles = StyleSheet.create({
  tabBar: {
    borderBottomWidth: 1,
    borderBottomColor: theme.pallate.neutral['03'],
    backgroundColor: theme.pallate.neutral['01'],
  },
  scrollContent: {
    position: 'relative',
  },
  indicator: {
    height: 3,
    borderRadius: 2,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: TAB_WIDTH,
  },
  tab: {
    width: TAB_WIDTH,
    paddingVertical: theme.spacing.standard,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.tiny,
  },
});

interface TabItemProps {
  tier: Tier;
  index: number;
  isActive: boolean;
  isLocked: boolean;
  onTabPress: (index: number) => void;
}

const TabItem = memo(function TabItem({ tier, index, isActive, isLocked, onTabPress }: TabItemProps) {
  const color = isLocked
    ? theme.pallate.neutral['04']
    : isActive
      ? theme.pallate[tier]['04']
      : theme.pallate.neutral['04'];
  const handlePress = useCallback(() => onTabPress(index), [onTabPress, index]);

  return (
    <Pressable style={{
      opacity: isActive ? 1 : 0.5,
    }} padding={theme.spacing.standard} direction="column" items="center" justify="center" gap={theme.spacing.tiny} width={TAB_WIDTH} onPress={handlePress}>
      {isLocked ? (
        <Icon icon="rank-lock" size={60} color={theme.pallate.neutral['03']} />
      ) : (
        <Icon icon={tier} size={60} color={isActive ? color : undefined} />
      )}
      <Text type="b2" weight={isActive ? 'semibold' : 'regular'} color={color}>
        {isLocked ? 'Locked' : TIER_LABEL[tier]}
      </Text>
    </Pressable>
  );
});

export const LeaderboardTabs = memo(function LeaderboardTabs({
  activeIndex,
  onTabPress,
}: LeaderboardTabsProps) {
  const scrollRef = useRef<ScrollView>(null);
  const indicatorPos = useSharedValue(activeIndex * TAB_WIDTH);

  useEffect(() => {
    indicatorPos.value = withTiming(activeIndex * TAB_WIDTH, {
      duration: INDICATOR_DURATION,
    });

    const targetX = activeIndex * TAB_WIDTH - (SCREEN_WIDTH / 2 - TAB_WIDTH / 2);
    scrollRef.current?.scrollTo({ x: Math.max(0, targetX), animated: true });
  }, [activeIndex, indicatorPos]);

  const indicatorStyle = useAnimatedStyle(() => {
    const activeTier = TIERS[activeIndex] ?? 'bronze';
    const locked = LOCKED_TIERS[activeTier];
    return {
      transform: [{ translateX: indicatorPos.value }],
      backgroundColor: locked
        ? theme.pallate.neutral['05']
        : theme.pallate[activeTier]['04'],
    };
  });

  return (
    <VStack style={styles.tabBar}>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TIERS.map((tier, index) => (
          <TabItem
            key={tier}
            tier={tier}
            index={index}
            isActive={index === activeIndex}
            isLocked={LOCKED_TIERS[tier]}
            onTabPress={onTabPress}
          />
        ))}
        <Reanimated.View style={[styles.indicator, indicatorStyle]} />
      </ScrollView>
    </VStack>
  );
});

export type { LeaderboardTabsProps } from './leaderboard-tabs.types';
