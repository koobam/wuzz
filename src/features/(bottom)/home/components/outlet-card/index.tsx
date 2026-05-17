import { memo, useCallback, useMemo } from 'react';
import { Box, Flex, HStack, Text, VStack, theme } from '@components/atoms';
import { Shimmer } from 'wuzz-shimmer';
import {
  BatteryCharging,
  BatteryEmpty,
  BatteryFull,
  Box as BoxIcon,
  Location,
  Truck,
} from 'iconsax-react-native';
import { IconChevronDown } from 'tabler-icons-react-native';
import {
  formatDistanceKm,
  getDistanceStyles,
  getStatusStyles,
  OutletServiceBadge,
} from '@features/(outlet)/outlet-list';
import type { OutletStatus } from '@features/(outlet)/outlet-list';
import { StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { OutletCardProps, OutletCardTagItem } from './outlet-card.types';
import GesturePressable from '@components/atoms/gesture-pressable';

const CARD_BORDER_RADIUS = 20;
const TAG_ICON_SIZE = 16;
const TAG_DOT_SIZE = 2;

const STATUS_LABELS: Record<OutletStatus, string> = {
  busy: 'Busy',
  moderate: 'Moderate',
  quiet: 'Quiet',
};

const OutletCardSkeleton = memo(() => (
  <Box
    margin={{
      marginHorizontal: theme.spacing.standard,
      marginVertical: theme.spacing.standard,
    }}
    borderRadius={CARD_BORDER_RADIUS}
    padding={theme.spacing.small}
    backgroundColor={theme.pallate.neutral['01']}
  >
    <Flex
      fill
      borderWidth={1}
      borderRadius={CARD_BORDER_RADIUS}
      borderColor={theme.pallate.neutral['03']}
      style={styles.cardInner}
    >
      <HStack
        padding={{
          paddingHorizontal: theme.spacing.medium,
          paddingVertical: theme.spacing.standard,
        }}
        fill
        items="center"
        gap={theme.spacing.standard}
      >
        <VStack fill gap={theme.spacing.small}>
          <Shimmer width={160} height={14} borderRadius={6} />
          <Shimmer width={100} height={12} borderRadius={6} />
          <Shimmer width={120} height={12} borderRadius={6} />
        </VStack>
        <Shimmer width={24} height={24} borderRadius={6} />
      </HStack>
    </Flex>
  </Box>
));

OutletCardSkeleton.displayName = 'OutletCardSkeleton';

export const OutletCard = memo(({ onPress, isError, error, outlet }: OutletCardProps) => {
  const statusLabel = outlet?.status ? STATUS_LABELS[outlet.status] : undefined;
  const showBadge = (outlet?.services.length ?? 0) > 0;

  const tagItems = useMemo((): OutletCardTagItem[] => {
    if (!outlet) return [];
    const items: OutletCardTagItem[] = [];
    if (outlet.distanceKm != null) {
      items.push({
        type: 'distance',
        id: 'distance',
        label: formatDistanceKm(outlet.distanceKm),
        distanceKm: outlet.distanceKm,
      });
    }
    if (outlet.status && statusLabel) {
      items.push({
        type: 'status',
        id: 'status',
        label: statusLabel,
        statusValue: outlet.status,
      });
    }
    if (outlet.deliveryTypes && outlet.deliveryTypes.length > 0) {
      items.push({
        type: 'delivery-type',
        id: 'delivery-types',
        deliveryTypes: outlet.deliveryTypes,
      });
    }
    return items;
  }, [outlet, statusLabel]);

  const renderTagItem = useCallback(
    ({ item }: { item: OutletCardTagItem }) => {
      if (item.type === 'distance') {
        const distStyles = getDistanceStyles(item.distanceKm);
        return (
          <HStack items="center" gap={theme.spacing.tiny}>
            <Location size={TAG_ICON_SIZE} variant="Bulk" color={distStyles.color} />
            <Text type="l2" weight="medium" color={distStyles.color}>
              {item.label}
            </Text>
          </HStack>
        );
      }
      if (item.type === 'delivery-type') {
        const label = item.deliveryTypes
          .map((dt) => (dt === 'pickup' ? 'Pickup' : dt === 'delivery' ? 'Delivery' : dt))
          .join(' & ');
        const DeliveryIcon = item.deliveryTypes.includes('pickup') ? BoxIcon : Truck;
        return (
          <HStack items="center" gap={theme.spacing.tiny}>
            <DeliveryIcon size={TAG_ICON_SIZE} variant="Bulk" color={theme.pallate.neutral['04']} />
            <Text type="l2" weight="medium" color={theme.pallate.neutral['04']}>{label}</Text>
          </HStack>
        );
      }
      const statusStyles = getStatusStyles(item.statusValue);
      const StatusIcon =
        item.statusValue === 'busy'
          ? BatteryFull
          : item.statusValue === 'moderate'
            ? BatteryCharging
            : BatteryEmpty;
      return (
        <HStack items="center" gap={theme.spacing.tiny}>
          <StatusIcon size={TAG_ICON_SIZE} variant="Bulk" color={statusStyles.color} />
          <Text type="l2" weight="medium" color={statusStyles.color}>
            {item.label}
          </Text>
        </HStack>
      );
    },
    [],
  );

  const tagSeparator = useCallback(() => <Box style={styles.tagDot} />, []);
  const tagKeyExtractor = useCallback((item: OutletCardTagItem) => item.id, []);

  if (!outlet) return <OutletCardSkeleton />;

  return (
    <GesturePressable
      margin={{
        marginHorizontal: theme.spacing.standard,
        marginVertical: theme.spacing.standard,
      }}
      onPress={onPress}
      borderRadius={CARD_BORDER_RADIUS}
      removeClippedSubviews
      padding={theme.spacing.small}
      shrink={false}
      backgroundColor={theme.pallate.neutral['01']}
    >
      <Flex
        fill
        borderWidth={1}
        borderRadius={CARD_BORDER_RADIUS}
        borderColor={theme.pallate.primary['03']}
        style={styles.cardInner}
      >
        <HStack
          padding={{
            paddingHorizontal: theme.spacing.medium,
            paddingVertical: theme.spacing.standard,
          }}
          fill
          items="center"
          gap={theme.spacing.standard}
        >
          <VStack fill style={styles.content} gap={theme.spacing.small}>
            <HStack items="center" gap={theme.spacing.small} fill>
              {showBadge && (
                <OutletServiceBadge
                  services={outlet.services}
                  selectedBackgroundColor={theme.pallate.primary['01']}
                  selectedContentColor={theme.pallate.primary['03']}
                  isSelected
                  iconOnly
                />
              )}
              <VStack fill>
                <Text type="l1" weight="semibold" numberOfLines={1} fill>
                  {outlet.name}
                </Text>
                {outlet.address != null && outlet.address !== '' && (
                  <Text type="l2" color={theme.pallate.neutral['04']} numberOfLines={1}>
                    {outlet.address}
                  </Text>
                )}
              </VStack>
            </HStack>
            {tagItems.length > 0 && (
              <FlashList
                data={tagItems}
                renderItem={renderTagItem}
                keyExtractor={tagKeyExtractor}
                horizontal
                ItemSeparatorComponent={tagSeparator}
                scrollEnabled={false}
                contentContainerStyle={styles.tagListContent}
              />
            )}
          </VStack>
          <IconChevronDown color={theme.pallate.neutral['05']} size={24} />
        </HStack>
      </Flex>
    </GesturePressable>
  );
});

const styles = StyleSheet.create({
  cardInner: {
    overflow: 'hidden',
  },
  content: {
    minWidth: 0,
  },
  tagListContent: {
    paddingRight: theme.spacing.tiny,
  },
  tagDot: {
    width: TAG_DOT_SIZE,
    height: TAG_DOT_SIZE,
    borderRadius: TAG_DOT_SIZE / 2,
    backgroundColor: theme.pallate.neutral['05'],
    marginHorizontal: theme.spacing.small,
    alignSelf: 'center',
  },
  hoursBadge: {
    backgroundColor: theme.pallate.neutral['02'],
    borderRadius: 999,
    paddingHorizontal: theme.spacing.small,
    paddingVertical: 2,
    flexShrink: 1,
  },
});

OutletCard.displayName = 'OutletCard';
