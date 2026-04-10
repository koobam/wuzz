import { memo, useCallback, useMemo } from 'react';
import { Box, Flex, HStack, Pressable, Text, VStack, theme } from '@components/atoms';
import {
  BatteryCharging,
  BatteryEmpty,
  BatteryFull,
  Location,
} from 'iconsax-react-native';
import { IconChevronDown } from 'tabler-icons-react-native';
import {
  formatDistanceKm,
  getDistanceStyles,
  getStatusStyles,
  OutletServiceBadge,
} from '@features/(outlet)/outlet-list';
import type { OutletService, OutletStatus } from '@features/(outlet)/outlet-list';
import { StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { OutletCardProps, OutletCardTagItem } from './outlet-card.types';

const DEFAULT_NAME = 'Wuzz 2025 - Supermall Karawaci';
const DEFAULT_STATUS = 'Lagi Ramai Nih!';
const CARD_BORDER_RADIUS = 20;
const TAG_ICON_SIZE = 16;
const TAG_DOT_SIZE = 2;

const STATUS_LABELS: Record<OutletStatus, string> = {
  ramai: 'Lagi Ramai Nih!',
  sedang: 'Sedang',
  sepi: 'Sepi',
};

function getAccentColor(services: OutletService[] | undefined): string {
  if (!services || services.length === 0) return theme.pallate.primary['03'];
  if (services.length === 2) return theme.pallate.primary['03'];
  return services[0] === 'coffee'
    ? theme.pallate.coffee['03']
    : theme.pallate.teal['03'];
}

export const OutletCard = memo(({ onPress, outlet }: OutletCardProps) => {
  const accentColor = useMemo(
    () => getAccentColor(outlet?.services),
    [outlet?.services],
  );

  const displayName = outlet?.name ?? DEFAULT_NAME;
  const displayAddress = outlet?.address;
  const statusLabel =
    (outlet?.status && STATUS_LABELS[outlet.status]) ?? DEFAULT_STATUS;
  const showBadge = outlet?.services && outlet.services.length > 0;

  const tagItems = useMemo((): OutletCardTagItem[] => {
    const items: OutletCardTagItem[] = [];
    if (outlet?.distanceKm != null) {
      items.push({
        type: 'distance',
        id: 'distance',
        label: formatDistanceKm(outlet.distanceKm),
        distanceKm: outlet.distanceKm,
      });
    }
    if (outlet?.status) {
      items.push({
        type: 'status',
        id: 'status',
        label: statusLabel,
        statusValue: outlet.status,
      });
    }
    return items;
  }, [outlet?.distanceKm, outlet?.status, statusLabel]);

  const renderTagItem = useCallback(
    ({ item }: { item: OutletCardTagItem }) => {
      if (item.type === 'distance') {
        const styles = getDistanceStyles(item.distanceKm);
        return (
          <HStack items="center" spacing={theme.spacing.tiny}>
            <Location
              size={TAG_ICON_SIZE}
              variant="Bulk"
              color={styles.color}
            />
            <Text type="l2" weight="medium" color={styles.color}>
              {item.label}
            </Text>
          </HStack>
        );
      }
      const statusStyles = getStatusStyles(item.statusValue);
      const StatusIcon =
        item.statusValue === 'ramai'
          ? BatteryFull
          : item.statusValue === 'sedang'
            ? BatteryCharging
            : BatteryEmpty;
      return (
        <HStack items="center" spacing={theme.spacing.tiny}>
          <StatusIcon
            size={TAG_ICON_SIZE}
            variant="Bulk"
            color={statusStyles.color}
          />
          <Text type="l2"  weight="medium" color={statusStyles.color}>
            {item.label}
          </Text>
        </HStack>
      );
    },
    [],
  );

  const tagSeparator = useCallback(
    () => <Box style={styles.tagDot} />,
    [],
  );

  const tagKeyExtractor = useCallback((item: OutletCardTagItem) => item.id, []);

  return (
    <Pressable
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
          spacing={theme.spacing.standard}
        >
          <VStack fill style={styles.content} spacing={theme.spacing.small}>
            <HStack items="center" spacing={theme.spacing.small} fill>
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
          <IconChevronDown color={accentColor} size={24} />
        </HStack>
      </Flex>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  cardShadow: {
    borderRadius: CARD_BORDER_RADIUS,
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
});

OutletCard.displayName = 'OutletCard';
