import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Box,
  Button,
  HStack,
  Icon,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import BottomSheet, {
  BottomSheetFlashList,
  BottomSheetFlatList,
} from '@gorhom/bottom-sheet';
import type BottomSheetType from '@gorhom/bottom-sheet';
import {
  LeaderboardHeader,
  LeaderboardTabs,
  LeaderboardHandleContent,
  LeaguePodium,
  LEADERBOARD_BY_TIER,
  LOCKED_TIERS,
  PROMOTION_ZONE_SIZE,
  DEGRADATION_ZONE_SIZE,
  ZONE_LABEL,
  ZONE_DESCRIPTION,
  TIER_LABEL,
  TIERS,
  useLeaderboardPager,
  TIER_COLOR_BG,
  type LeaderboardEntry,
  type LeaderboardScreenProps,
  type Tier,
  type Zone,
} from '@features/(utils)/leaderboard';

const SNAP_POINTS = ['40%', '90%'];

// ─── Sheet item types ────────────────────────────────────────────────────────────

type SheetItem =
  | { type: 'entry'; entry: LeaderboardEntry; zone: Zone }
  | { type: 'zone'; zone: Zone }
  | { type: 'locked' };

// ─── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: theme.pallate.neutral['01'] },
  handle: { backgroundColor: theme.pallate.neutral['03'] },
  listContent: {
    paddingTop: theme.spacing.small,
    paddingBottom: 300,
  },
  lockedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  separator: { height: theme.spacing.small },
  rankWidth: { width: 28 },
  dividerLine: { flex: 1 },
});

// ─── Row ─────────────────────────────────────────────────────────────────────────

const LeaderboardRow = memo(function LeaderboardRow({
  entry,
  zone,
}: {
  entry: LeaderboardEntry;
  index: number;
  zone: Zone;
}) {
  const rankColor =
    zone === 'promotion'
      ? theme.pallate[entry.tier]['04']
      : zone === 'degradation'
      ? theme.pallate.danger['03']
      : theme.pallate.neutral['05'];

  return (
    <Pressable
      items="center"
      spacing={theme.spacing.small}
      padding={{
        paddingHorizontal: theme.spacing.large,
        paddingVertical: theme.spacing.standard,
      }}
    >
      <Text type="s3" weight="bold" color={rankColor} style={styles.rankWidth}>
        {entry.rank}.
      </Text>
      <Box
        width={45}
        height={45}
        borderRadius={25}
        backgroundColor={theme.pallate.neutral['03']}
      />
      <Text
        fill
        type="b2"
        weight={entry.isCurrentUser ? 'semibold' : 'regular'}
        color={theme.pallate.neutral['05']}
      >
        {entry.displayName}
      </Text>
      <Text type="b2" color={theme.pallate.neutral['05']}>
        {entry.xp.toLocaleString()} XP
      </Text>
    </Pressable>
  );
});

// ─── Locked background content ───────────────────────────────────────────────────

const LockedBackground = memo(function LockedBackground({
  tier,
  onHowToPress,
}: {
  tier: Tier;
  onHowToPress: () => void;
}) {
  return (
    <VStack fill gap={theme.spacing.standard} justify="center" items="center">
      <Icon icon="rank-lock" size={56} color={theme.pallate.neutral['03']} />
      <VStack items="center" spacing={theme.spacing.tiny}>
        <Text type="b2" weight="semibold" color={theme.pallate.neutral['05']}>
          Tier {TIER_LABEL[tier]} terkunci
        </Text>
        <Text type="l2" color={theme.pallate.neutral['05']} align="center">
          Kumpulkan lebih banyak XP untuk membuka tier ini
        </Text>
      </VStack>
      <HStack gap={theme.spacing.small}>
        <Button rounded={true} size="sm" variant="secondary" onPress={onHowToPress}>
          <Text type="l1" weight="semibold" color={theme.pallate.neutral['04']}>
            Cara Mendapatkan XP ?
          </Text>
        </Button>
        <Button rounded={true} size="sm" variant="primary">
          <Text type="l1" weight="semibold" color={theme.pallate.neutral['01']}>
            Benefits
          </Text>
        </Button>
      </HStack>
    </VStack>
  );
});

// ─── Zone divider ─────────────────────────────────────────────────────────────────

const ZoneDivider = memo(function ZoneDivider({
  zone,
  tier,
}: {
  zone: Zone;
  tier: Tier;
}) {
  const isPromotion = zone === 'promotion';
  const isDegradation = zone === 'degradation';
  const color = isPromotion
    ? theme.pallate[tier]['04']
    : isDegradation
    ? theme.pallate.danger['03']
    : theme.pallate.neutral['04'];

  return (
    <HStack
      items="center"
      spacing={theme.spacing.small}
      padding={{
        paddingHorizontal: theme.spacing.large,
        paddingVertical: theme.spacing.standard,
      }}
    >
      <Box
        height={1}
        style={styles.dividerLine}
        backgroundColor={color}
        opacity={0.3}
      />
      <VStack items="center" spacing={2}>
        <Text type="b2" weight="bold" color={color}>
          {ZONE_LABEL[zone]}
        </Text>
        <Text type="l1" color={color} opacity={0.7}>
          {ZONE_DESCRIPTION[zone]}
        </Text>
      </VStack>
      <Box
        height={1}
        style={styles.dividerLine}
        backgroundColor={color}
        opacity={0.3}
      />
    </HStack>
  );
});

// ─── Page ─────────────────────────────────────────────────────────────────────────

const Leaderboard = memo(function Leaderboard({
  navigation,
}: LeaderboardScreenProps) {
  const { top } = useSafeAreaInsets();

  const { activeIndex, handleTabPress } = useLeaderboardPager();

  const activeTier = TIERS[activeIndex] ?? 'bronze';
  const isLocked = LOCKED_TIERS[activeTier];
  const entries = LEADERBOARD_BY_TIER[activeTier];
  const top3 = entries.slice(0, 3);
  const restEntries = entries.slice(3);

  const sheetRef = useRef<BottomSheetType>(null);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  const handleHowToPress = useCallback(() => {
    navigation.navigate('webview', {
      uri: 'https://wuzz.id/cara-mendapatkan-xp',
      title: 'Cara Mendapatkan XP',
    });
  }, [navigation]);

  useEffect(() => {
    if (isLocked) {
      sheetRef.current?.close();
    } else {
      sheetRef.current?.snapToIndex(0);
    }
  }, [isLocked]);

  const listData = useMemo<SheetItem[]>(() => {
    const total = entries.length;
    const isFirstTier = activeIndex === 0;

    // Podium holds top-3 → in restEntries index 0 = rank 4
    const promoInList = Math.max(0, PROMOTION_ZONE_SIZE - 3); // = 2 (ranks 4-5)
    const degraStartRank = total - DEGRADATION_ZONE_SIZE + 1; // e.g. rank 16 of 20
    const degraStartIdx = degraStartRank - 4; // index in restEntries

    const result: SheetItem[] = [];
    let currentZone: Zone = 'promotion';

    restEntries.forEach((entry, idx) => {
      if (idx === 0) {
        result.push({ type: 'zone', zone: 'promotion' });
        currentZone = 'promotion';
      } else if (idx === promoInList) {
        result.push({ type: 'zone', zone: 'safe' });
        currentZone = 'safe';
      } else if (!isFirstTier && idx === degraStartIdx) {
        result.push({ type: 'zone', zone: 'degradation' });
        currentZone = 'degradation';
      }
      result.push({ type: 'entry', entry, zone: currentZone });
    });

    return result;
  }, [entries, restEntries, activeIndex]);

  const renderItem = useCallback(
    ({ item, index }: { item: SheetItem; index: number }) => {
      if (item.type === 'zone') {
        return <ZoneDivider zone={item.zone} tier={activeTier} />;
      }
      if (item.type === 'locked') return null;
      return (
        <LeaderboardRow entry={item.entry} index={index} zone={item.zone} />
      );
    },
    [activeTier],
  );

  const keyExtractor = useCallback((item: SheetItem, index: number) => {
    if (item.type === 'zone') return `zone-${item.zone}`;
    if (item.type === 'locked') return 'locked';
    return `${item.entry.userId}-${index}`;
  }, []);

  const renderMainSheetHandle = useCallback(
    () => (
      <LeaderboardHandleContent
        tier={activeTier}
        timeLeft="3 hari lagi"
        rank={42}
        totalParticipants={1240}
      />
    ),
    [activeTier],
  );

  return (
    <VStack fill>
      <LeaderboardHeader topInset={top} onBackPress={handleBack} />
      <LeaderboardTabs activeIndex={activeIndex} onTabPress={handleTabPress} />

      {/* Dark background + podium / locked placeholder */}
      <VStack
        fill
        backgroundColor={isLocked ? undefined : TIER_COLOR_BG[activeTier]}
      >
        {isLocked ? (
          <LockedBackground tier={activeTier} onHowToPress={handleHowToPress} />
        ) : (
          <LeaguePodium top3={top3} tier={activeTier} />
        )}
      </VStack>

      {/* Bottom sheet: zone list */}
      <BottomSheet
        ref={sheetRef}
        snapPoints={SNAP_POINTS}
        handleComponent={renderMainSheetHandle}
        enableDynamicSizing={false}
        topInset={top}
        backgroundStyle={{
          marginTop: 2 * theme.spacing.large,
        }}
      >
        <BottomSheetFlatList
          data={listData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          estimatedItemSize={200}
        />
      </BottomSheet>
    </VStack>
  );
});

Leaderboard.displayName = 'Leaderboard';
export default Leaderboard;
