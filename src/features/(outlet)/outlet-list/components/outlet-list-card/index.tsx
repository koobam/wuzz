import { Box, HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import Image from '@components/atoms/image';
import {
  Box1,
  BatteryCharging,
  BatteryEmpty,
  BatteryFull,
  Clock,
  Location,
  TruckFast,
} from 'iconsax-react-native';
import { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import type { OutletTag } from '../../types';
import { formatDistanceKm, getDistanceStyles, getStatusStyles } from '../../utils';
import { OutletServiceBadge } from '../outlet-service-badge';
import type { OutletListCardProps } from './outlet-list-card.types';

const PHOTO_SIZE = 80;
const PHOTO_GAP = theme.spacing.tiny;
const TAG_ICON_SIZE = 16;
const ADDRESS_ICON_SIZE = 18;
const CARD_BORDER_WIDTH = 1;

const keyExtractorTag = (tag: OutletTag) => `${tag.kind}-${tag.label}`;

const CARD_BORDER_RADIUS = 24;
const TAG_BORDER_RADIUS = 10;

const cardPadding = {
  paddingVertical: theme.spacing.large,
};
const headerPadding = {
  paddingHorizontal: theme.spacing.large,
};
const tagPadding = {
  paddingVertical: theme.spacing.standard,
  paddingHorizontal: theme.spacing.medium,
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: theme.spacing.large,
    borderRadius: CARD_BORDER_RADIUS,
    overflow: 'hidden',
  },
  card: {
    borderRadius: CARD_BORDER_RADIUS,
    overflow: 'hidden',
  },
  tagListContent: {
    paddingHorizontal: theme.spacing.large,
  },
  tagSeparator: {
    width: theme.spacing.small,
  },
  tag: {
    borderRadius: TAG_BORDER_RADIUS,
    overflow: 'hidden',
  },
  tagDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.pallate.neutral['04'],
  },
  serviceBadge: {
    position: 'absolute' as const,
    top: -1,
    right: -1,
    zIndex: 1,
  },
  photoListContent: {
    paddingHorizontal: theme.spacing.large,
  },
  photoSeparator: {
    width: PHOTO_GAP,
  },
  photoWrapper: {
    width: PHOTO_SIZE,
    aspectRatio: 1.6 / 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
});

export const OutletListCard = memo(
  ({
    name,
    address,
    distanceKm,
    services = [],
    photos = [],
    tags = [],
    isSelected = false,
    onPress,
  }: OutletListCardProps) => {
    const renderPhotoItem = useCallback(
      ({ item }: { item: string }) => {
        return (
        <Box style={styles.photoWrapper}>
          <Image uri={item} resizeMode="cover" style={styles.photo} />
        </Box>
      );
    },
      [],
    );

    const photoSeparator = useCallback(
      () => <Box style={styles.photoSeparator} />,
      [],
    );

    const renderTagIcon = useCallback((item: OutletTag) => {
      const iconColor =
        item.kind === 'status' && item.statusValue != null
          ? getStatusStyles(item.statusValue).color
          : theme.pallate.neutral['05'];
      switch (item.kind) {
        case 'delivery':
          return (
            <TruckFast
              variant="Linear"
              size={TAG_ICON_SIZE}
              color={iconColor}
            />
          );
        case 'pickup':
          return (
            <Box1 variant="Linear" size={TAG_ICON_SIZE} color={iconColor} />
          );
        case 'delivery_pickup':
          return null;
        case 'hours':
          return (
            <Clock variant="Linear" size={TAG_ICON_SIZE} color={iconColor} />
          );
        case 'status':
          if (item.statusValue === 'ramai') {
            return (
              <BatteryFull
                variant="Bulk"
                size={TAG_ICON_SIZE}
                color={iconColor}
              />
            );
          }
          if (item.statusValue === 'sedang') {
            return (
              <BatteryCharging
                variant="Bulk"
                size={TAG_ICON_SIZE}
                color={iconColor}
              />
            );
          }
          return (
            <BatteryEmpty
              variant="Bulk"
              size={TAG_ICON_SIZE}
              color={iconColor}
            />
          );
        default:
          return null;
      }
    }, []);

    const tagLabelColor = theme.pallate.neutral['05'];

    const renderTagItem = useCallback(
      ({ item }: { item: OutletTag }) => {
        const statusStyles =
          item.kind === 'status' && item.statusValue != null
            ? getStatusStyles(item.statusValue)
            : null;
        const tagBg =
          statusStyles?.backgroundColor ?? theme.pallate.neutral['02'];
        const labelColor = statusStyles?.color ?? tagLabelColor;

        if (item.kind === 'delivery_pickup') {
          return (
            <HStack
              style={styles.tag}
              padding={tagPadding}
              backgroundColor={tagBg}
              items="center"
              spacing={theme.spacing.small}
            >
              <HStack items="center" spacing={theme.spacing.tiny}>
                <TruckFast
                  variant="Linear"
                  size={TAG_ICON_SIZE}
                  color={tagLabelColor}
                />
                <Text type="l2" color={tagLabelColor}>
                  Delivery
                </Text>
              </HStack>
              <Box style={styles.tagDot} />
              <HStack items="center" spacing={theme.spacing.tiny}>
                <Box1
                  variant="Linear"
                  size={TAG_ICON_SIZE}
                  color={tagLabelColor}
                />
                <Text type="l2" color={tagLabelColor}>
                  Pickup
                </Text>
              </HStack>
            </HStack>
          );
        }

        return (
          <HStack
            style={styles.tag}
            padding={tagPadding}
            backgroundColor={tagBg}
            items="center"
            spacing={theme.spacing.tiny}
          >
            {renderTagIcon(item)}
            <Text type="l2" color={labelColor}>
              {item.label}
            </Text>
          </HStack>
        );
      },
      [renderTagIcon, tagLabelColor],
    );

    const tagSeparator = useCallback(
      () => <Box style={styles.tagSeparator} />,
      [],
    );

    const selectedBorderColor =
      services.length === 2
        ? theme.pallate.primary['03']
        : services[0] === 'coffee'
          ? theme.pallate.coffee['03']
          : theme.pallate.teal['03'];
    const borderColor = isSelected
      ? selectedBorderColor
      : theme.pallate.neutral['03'];

    const kmColor =
      distanceKm != null
        ? getDistanceStyles(distanceKm).color
        : theme.pallate.neutral['04'];
    const kmLabel = distanceKm != null ? formatDistanceKm(distanceKm) : '–';

    return (
      <Pressable onPress={onPress} style={[styles.cardWrapper, { borderWidth: CARD_BORDER_WIDTH, borderColor }]}>
        <OutletServiceBadge
          services={services}
          isSelected={isSelected}
          style={styles.serviceBadge}
        />
        <VStack
          style={styles.card}
          spacing={theme.spacing.standard}
          padding={cardPadding}
        >
          <HStack
            padding={headerPadding}
            items="center"
            spacing={theme.spacing.standard}
          >
            <VStack fill spacing={theme.spacing.tiny}>
              <Text
                type="b2"
                weight="semibold"
                color={theme.pallate.neutral['05']}
                numberOfLines={1}
              >
                {name}
              </Text>
              <HStack items="center" spacing={theme.spacing.small}>
                <HStack items="center" spacing={theme.spacing.tiny}>
                  <Location
                    variant="Bulk"
                    size={ADDRESS_ICON_SIZE}
                    color={kmColor}
                  />
                  <Text type="l2" color={kmColor}>
                    {kmLabel}
                  </Text>
                </HStack>
                <Box style={styles.tagDot} />
                <Text
                  type="l2"
                  color={theme.pallate.neutral['04']}
                  numberOfLines={1}
                >
                  {address}
                </Text>
              </HStack>
            </VStack>
          </HStack>
          {photos.length > 0 && (
            <FlashList
              data={photos}
              horizontal
              ItemSeparatorComponent={photoSeparator}
              contentContainerStyle={styles.photoListContent}
              showsHorizontalScrollIndicator={false}
              renderItem={renderPhotoItem}
            />
          )}
          {tags.length > 0 && (
            <FlashList
              data={tags}
              horizontal
              keyExtractor={keyExtractorTag}
              ItemSeparatorComponent={tagSeparator}
              contentContainerStyle={styles.tagListContent}
              showsHorizontalScrollIndicator={false}
              renderItem={renderTagItem}
            />
          )}
        </VStack>
      </Pressable>
    );
  },
);

OutletListCard.displayName = 'OutletListCard';

export type { OutletListCardProps } from './outlet-list-card.types';
