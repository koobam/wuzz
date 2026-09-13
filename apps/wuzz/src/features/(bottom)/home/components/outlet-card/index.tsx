import { memo, useCallback, useMemo } from 'react';
import { Box, Flex, HStack, Pressable, Text, VStack, theme } from '@components/atoms';
import { Shimmer } from 'wuzz-shimmer';
import {
  BatteryCharging,
  BatteryEmpty,
  BatteryFull,
  Gps,
  Location,
  SearchNormal1,
  Wifi,
  Box as BoxIcon,
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
import { isNetworkError } from '@http/errors';
import { Linking, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { OutletCardProps, OutletCardTagItem } from './outlet-card.types';
import GesturePressable from '@components/atoms/gesture-pressable';

const CARD_BORDER_RADIUS = 20;

type EmptyReason = 'location' | 'network' | 'error' | 'notfound';

const EMPTY_CONFIG: Record<
  EmptyReason,
  { title: string; description: string; buttonLabel: string }
> = {
  location: {
    title: 'Lokasi tidak aktif',
    description: 'Aktifkan GPS untuk menemukan outlet terdekat.',
    buttonLabel: 'Buka Pengaturan',
  },
  network: {
    title: 'Tidak ada koneksi internet',
    description: 'Periksa koneksi internetmu lalu coba lagi.',
    buttonLabel: 'Coba lagi',
  },
  error: {
    title: 'Gagal memuat outlet',
    description: 'Terjadi kesalahan. Coba lagi nanti.',
    buttonLabel: 'Coba lagi',
  },
  notfound: {
    title: 'Outlet tidak ditemukan',
    description: 'Belum ada outlet terdekat.',
    buttonLabel: 'Coba lagi',
  },
};
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

export const OutletCard = memo(
  ({
    onPress,
    outlet,
    isLoading = false,
    isError = false,
    error,
    isLocationError = false,
    onRefresh,
  }: OutletCardProps) => {

    const hasOutlet = outlet != null;
    const displayName = outlet?.name;
    const displayAddress = outlet?.address;
    const showBadge = outlet?.services && outlet.services.length > 0;

    const emptyReason: EmptyReason = isLocationError
      ? 'location'
      : isNetworkError(error)
        ? 'network'
        : isError
          ? 'error'
          : 'notfound';
    const emptyConfig = EMPTY_CONFIG[emptyReason];
    const handleEmptyAction = useCallback(() => {
      if (emptyReason === 'location') {
        Linking.openSettings();
        return;
      }
      onRefresh?.();
    }, [emptyReason, onRefresh]);
    const showEmptyButton = emptyReason === 'location' || onRefresh != null;

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
      if (outlet.status != null) {
        items.push({
          type: 'status',
          id: 'status',
          label: STATUS_LABELS[outlet.status],
          statusValue: outlet.status,
        });
      }
      if (outlet.deliveryTypes != null && outlet.deliveryTypes.length > 0) {
        items.push({
          type: 'delivery-type',
          id: 'delivery-types',
          deliveryTypes: outlet.deliveryTypes,
        });
      }
      return items;
    }, [outlet]);

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
      onPress={hasOutlet ? onPress : undefined}
      borderRadius={CARD_BORDER_RADIUS}
      removeClippedSubviews
      padding={theme.spacing.small}
      backgroundColor={theme.pallate.neutral['01']}
      style={styles.cardOuter}
    >
        <Flex
          fill
          borderWidth={1}
          borderRadius={CARD_BORDER_RADIUS}
          borderColor={theme.pallate.primary['03']}
          style={styles.cardInner}
        >
          {isLoading ? (
            <HStack
              padding={{
                paddingHorizontal: theme.spacing.medium,
                paddingVertical: theme.spacing.standard,
              }}
              fill
              items="center"
              gap={theme.spacing.standard}
            >
              <SearchNormal1 size={20} variant="Linear" color={theme.pallate.neutral['04']} />
              <VStack fill>
                <Text type="l1" weight="semibold" numberOfLines={1} fill text="Sedang Mencari Outlet.." />
                <Text type="l2" color={theme.pallate.neutral['04']} numberOfLines={1} text="Mencari outlet terdekat dari lokasi kamu" />
              </VStack>
            </HStack>
          ) : hasOutlet && !isLocationError ? (
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
                  {showBadge && outlet && (
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
                      {displayName}
                    </Text>
                    {displayAddress != null && displayAddress !== '' && (
                      <Text type="l2" color={theme.pallate.neutral['04']} numberOfLines={1}>
                        {displayAddress}
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
              <IconChevronDown color={theme.pallate.primary['03']} size={24} />
            </HStack>
          ) : (
            <HStack
              padding={{
                paddingHorizontal: theme.spacing.medium,
                paddingVertical: theme.spacing.standard,
              }}
              fill
              items="center"
              gap={theme.spacing.standard}
            >
              {emptyReason === 'location' ? (
                <Gps size={20} variant="Bulk" color={theme.pallate.neutral['04']} />
              ) : emptyReason === 'network' ? (
                <Wifi size={20} variant="Bulk" color={theme.pallate.neutral['04']} />
              ) : (
                <Location size={20} variant="Bulk" color={theme.pallate.neutral['04']} />
              )}
              <VStack fill>
                <Text type="l1" weight="semibold" numberOfLines={1}>
                  {emptyConfig.title}
                </Text>
                <Text type="l2" color={theme.pallate.neutral['04']} numberOfLines={2}>
                  {emptyConfig.description}
                </Text>
              </VStack>
              {showEmptyButton && (
                <Pressable
                  onPress={handleEmptyAction}
                  padding={{
                    paddingHorizontal: theme.spacing.standard,
                    paddingVertical: theme.spacing.tiny,
                  }}
                  borderRadius={999}
                  backgroundColor={theme.pallate.primary['01']}
                >
                  <Text type="l2" weight="semibold" color={theme.pallate.primary['03']}>
                    {emptyConfig.buttonLabel}
                  </Text>
                </Pressable>
              )}
            </HStack>
          )}
        </Flex>
    </GesturePressable>
    );
  });

const styles = StyleSheet.create({
  cardShadow: {
    borderRadius: CARD_BORDER_RADIUS,
  },
  cardOuter: {
    overflow: 'hidden',
  },
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
