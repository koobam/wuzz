import { Box, HStack, Pressable, Text, theme, VStack } from '@components/atoms';
import {
  OutletServiceBadge,
} from '@features/(outlet)/outlet-list';
import { ArrowDown2, Location } from 'iconsax-react-native';
import { Fragment, memo } from 'react';
import type { OutletCardProps } from './outlet-card.types';

const formatDistance = (km: number): string =>
  km < 1 ? km.toFixed(1) : String(Math.round(km));

export const OutletCard = memo((props: OutletCardProps) => {
  const {
    outletName,
    outletAddress,
    distanceKm,
    outletServices,
    onOutletPress,
    locationColor,
    showBadge,
  } = props;

  return (
    <Pressable
      onPress={onOutletPress}
      padding={theme.spacing.medium}
      gap={theme.spacing.standard}
      items="center"
      borderRadius={20}
      backgroundColor={theme.pallate.neutral['02']}
    >
      {showBadge ? (
        <OutletServiceBadge
          services={outletServices ?? []}
          isSelected
          iconOnly
          selectedBackgroundColor={theme.pallate.coffee['01']}
          selectedContentColor={theme.pallate.coffee['03']}
        />
      ) : (
        <Location size={20} color={locationColor} variant="Bulk" />
      )}
      <VStack fill>
        <Text
          type="l1"
          weight="semibold"
          text={outletName ?? 'Choose outlet'}
          color={theme.pallate.neutral['05']}
        />
        <HStack items="center" gap={theme.spacing.tiny}>
          {distanceKm != null && (
            <Fragment>
              <Text
                type="l2"
                text={`${formatDistance(distanceKm)} km`}
                color={theme.pallate.neutral['04']}
              />
              <Box
                width={2}
                height={2}
                borderRadius={999}
                margin={{ marginLeft: theme.spacing.tiny }}
                backgroundColor={theme.pallate.neutral['04']}
              />
            </Fragment>
          )}
          <Text
            fill
            type="l2"
            text={outletAddress ?? 'Choose outlet'}
            color={theme.pallate.neutral['04']}
            numberOfLines={1}
          />
        </HStack>
      </VStack>
      <Box margin={{ marginLeft: theme.spacing.small }}>
        <ArrowDown2 size={20} color={theme.pallate.neutral['04']} />
      </Box>
    </Pressable>
  );
});

OutletCard.displayName = 'OutletCard';

export type { OutletCardProps } from './outlet-card.types';
