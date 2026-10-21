import {
  Box,
  Button,
  HStack,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import { Calendar, Flash, Shop, TruckFast } from 'iconsax-react-native';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import {
  ORDER_METHOD_OPTIONS,
  ORDER_TIMING_OPTIONS,
  type OrderMethod,
  type OrderTiming,
} from '../../types';

/** The card's corner radius, and how far it rides up over the map. One number, so
 *  the notches are cut out of the map rather than out of the white page. */
export const METHOD_RADIUS = 28;
const METHOD_PILL_LIFT = 14;
const PILL_TILT_DEG = 3;

export interface MethodCardProps {
  value: OrderMethod;
  /** Replaces the method's stock description, e.g. with the outlet pickup will
   *  use. */
  detail?: string;
  /** Now or later, as two rounded choices under the method. */
  timing: OrderTiming;
  /** What "Jadwalkan" says under its name once a window is picked. */
  scheduleSummary?: string | null;
  onTimingChange: (timing: OrderTiming) => void;
  /** Opens the sheet that changes the method. */
  onChangePress: () => void;
  /** Room to reserve at the bottom for the address card that overlaps this one.
   *  A prop because only the page knows how tall that card measured. */
  bottomClearance: number;
}

/**
 * How the order changes hands: the black card under the map, with the two ways
 * side by side. Stated first so somebody reaching checkout knows what happens
 * *before* they pay. The address card then overlaps its bottom edge, so the two
 * read as one block.
 */
export const MethodCard = memo(function MethodCard({
  value,
  detail,
  timing,
  scheduleSummary,
  onTimingChange,
  onChangePress,
  bottomClearance,
}: MethodCardProps) {
  const current =
    ORDER_METHOD_OPTIONS.find(o => o.value === value) ??
    ORDER_METHOD_OPTIONS[0];
  return (
    <VStack style={styles.card}>
      {/* Lifted off the card onto the map above. In the flow with a negative
          margin, not positioned outside the card: a child hanging past its parent
          is clipped inside a ScrollView on Android. */}
      <Box
        self="flex-start"
        zIndex={2}
        margin={{
          marginLeft: theme.spacing.large,
          marginTop: -METHOD_PILL_LIFT,
        }}
        borderRadius={999}
        backgroundColor={theme.pallate.neutral['01']}
        padding={{
          paddingHorizontal: theme.spacing.standard,
          paddingVertical: theme.spacing.tiny,
        }}
        borderWidth={1}
        style={styles.pill}
      >
        <Text
          type="b2"
          weight="bold"
          color={theme.pallate.neutral['05']}
          text="Metode Pemesanan"
        />
      </Box>

      <VStack
        gap={theme.spacing.standard}
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingTop: theme.spacing.standard,
          paddingBottom: bottomClearance,
        }}
      >
        <HStack items="center" gap={theme.spacing.standard}>
          {value === 'delivery' ? (
            <TruckFast
              size={26}
              variant="Bulk"
              color={theme.pallate.neutral['01']}
            />
          ) : (
            <Shop
              size={26}
              variant="Bulk"
              color={theme.pallate.neutral['01']}
            />
          )}
          <VStack fill>
            <Text
              type="b1"
              weight="bold"
              color={theme.pallate.neutral['01']}
              text={current.label}
            />
            <Text
              type="l1"
              color={theme.pallate.neutral['03']}
              text={detail ?? current.description}
            />
          </VStack>
          <Button rounded size="sm" variant="light" onPress={onChangePress}>
            <Text
              type="b2"
              weight="bold"
              color={theme.pallate.neutral['05']}
              text="Ubah"
            />
          </Button>
        </HStack>
        {/* Now or later: one rounded pill showing what is picked; tapping it opens
          the sheet that changes it. */}
        <HStack gap={theme.spacing.small}>
          {ORDER_TIMING_OPTIONS.map(option => {
            const selected = option.value === timing;
            const Icon = option.value === 'instant' ? Flash : Calendar;
            return (
              <Pressable
                key={option.value}
                onPress={() => onTimingChange(option.value)}
                fill
                direction="row"
                items="center"
                gap={theme.spacing.small}
                style={selected ? styles.timingOn : styles.timingOff}
              >
                <Icon
                  size={22}
                  variant="Bold"
                  color={
                    selected
                      ? theme.pallate.neutral['05']
                      : theme.pallate.neutral['04']
                  }
                />
                <VStack fill>
                  <Text
                    type="b2"
                    weight="bold"
                    color={
                      selected
                        ? theme.pallate.neutral['05']
                        : theme.pallate.neutral['03']
                    }
                  >
                    {option.label}
                  </Text>
                  <Text
                    type="l2"
                    numberOfLines={1}
                    color={
                      selected
                        ? theme.pallate.neutral['04']
                        : theme.pallate.neutral['04']
                    }
                  >
                    {option.eta ??
                      (selected ? scheduleSummary : null) ??
                      'Pilih tanggal & jam'}
                  </Text>
                </VStack>
              </Pressable>
            );
          })}
        </HStack>
      </VStack>
    </VStack>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.pallate.neutral['05'],
    marginTop: -METHOD_RADIUS,
    borderTopLeftRadius: METHOD_RADIUS,
    borderTopRightRadius: METHOD_RADIUS,
    borderCurve: 'continuous',
  },
  // Tilted like a sticker. Rotating the container, not the text, keeps the
  // rounded background square with the label.
  pill: { transform: [{ rotate: `-${PILL_TILT_DEG}deg` }] },
  // Rounded choices side by side: the picked one light grey, not pure white.
  // The picked one is a solid light pill with dark text; the other is a dim,
  // see-through pill with grey text and no edge, so there is no mistaking which
  // is chosen.
  timingOn: {
    paddingVertical: theme.spacing.small + 2,
    paddingHorizontal: theme.spacing.medium,
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: theme.pallate.neutral['01'],
  },
  timingOff: {
    paddingVertical: theme.spacing.small + 2,
    paddingHorizontal: theme.spacing.medium,
    borderRadius: 16,
    borderCurve: 'continuous',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
});
