import { HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import { memo, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { PICKUP_DAYS, PICKUP_LEAD_MINUTES, PICKUP_SLOTS } from '../../types';
import { buildPickupDays, toDateKey, zoneLabel } from '../../utils/schedule';
import type { PickupTimeSectionProps } from './pickup-time-section.types';

/** Day and window for the pickup: a strip of the next days, then the windows. */
export const PickupTimeSection = memo(function PickupTimeSection({
  date,
  slotId,
  onSelectDate,
  onSelectSlot,
  bleed = theme.spacing.medium,
  timeLabel = 'Pilih jam jemput',
}: PickupTimeSectionProps) {
  // Read once per mount: the strip does not need to roll over at midnight while
  // the screen is open.
  const now = useMemo(() => new Date(), []);
  const days = useMemo(() => buildPickupDays(now), [now]);
  const zone = useMemo(() => zoneLabel(now), [now]);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const isToday = date === toDateKey(now);

  return (
    <VStack
      padding={{ paddingVertical: theme.spacing.medium }}
      gap={theme.spacing.medium}
    >
      <ScrollView
        horizontal
        contentInsetAdjustmentBehavior="never"
        showsHorizontalScrollIndicator={false}
        // Runs out to the card's edges, so a day that is scrolled off is cut by the
        // card itself, not by an invisible line inside its padding.
        style={{ marginHorizontal: -bleed }}
        contentContainerStyle={[styles.days, { paddingHorizontal: bleed }]}
      >
        {days.map(d => {
          const selected = d.key === date;
          const color = selected
            ? theme.pallate.neutral['01']
            : theme.pallate.neutral['05'];
          return (
            <Pressable
              key={d.key}
              onPress={() => onSelectDate(d.key)}
              direction="column"
              items="center"
              justify="center"
              style={[styles.day, selected && styles.daySelected]}
            >
              <Text type="l2" color={color}>
                {d.top}
              </Text>
              <Text type="l1" weight="semibold" color={color}>
                {`${d.day} ${d.month}`}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <HStack items="center" justify="space-between">
        <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
          {timeLabel}
        </Text>
        <Text type="l1" color={theme.pallate.neutral['04']}>
          {`Waktu ${zone}`}
        </Text>
      </HStack>
      <View style={styles.slots}>
        {PICKUP_SLOTS.map(slot => {
          const unavailable =
            isToday && slot.startHour * 60 < nowMinutes + PICKUP_LEAD_MINUTES;
          const selected = !unavailable && slot.id === slotId;
          return (
            <Pressable
              key={slot.id}
              onPress={unavailable ? undefined : () => onSelectSlot(slot.id)}
              items="center"
              justify="center"
              style={[
                styles.slot,
                selected && styles.slotSelected,
                unavailable && styles.slotUnavailable,
              ]}
            >
              <Text
                type="l1"
                weight="semibold"
                color={
                  selected
                    ? theme.pallate.neutral['01']
                    : unavailable
                    ? theme.pallate.neutral['04']
                    : theme.pallate.neutral['05']
                }
              >
                {slot.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </VStack>
  );
});

export type { PickupTimeSectionProps } from './pickup-time-section.types';

const styles = StyleSheet.create({
  days: {
    gap: theme.spacing.small,
  },
  day: {
    width: 64,
    paddingVertical: theme.spacing.small + 2,
    borderRadius: 14,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: theme.pallate.neutral['03'],
    backgroundColor: theme.pallate.neutral['01'],
  },
  daySelected: {
    backgroundColor: theme.pallate.primary['03'],
    borderColor: theme.pallate.primary['03'],
  },
  // Three equal cells a row, so the windows line up instead of wrapping ragged.
  slots: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.small },
  slot: {
    flexBasis: '31.5%',
    paddingVertical: theme.spacing.small + 2,
    borderRadius: 12,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: theme.pallate.neutral['03'],
    backgroundColor: theme.pallate.neutral['01'],
  },
  slotSelected: {
    backgroundColor: theme.pallate.primary['03'],
    borderColor: theme.pallate.primary['03'],
  },
  slotUnavailable: { backgroundColor: theme.pallate.neutral['02'] },
});
