import { Box, HStack, Text, theme } from '@components/atoms';
import { Coffee, ShoppingBag } from 'iconsax-react-native';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import type { OutletService } from '../../types';
import type { OutletServiceBadgeProps } from './outlet-service-badge.types';

const BADGE_ICON_SIZE = 14;
const BADGE_BORDER_RADIUS = 10;
const BADGE_DOT_SIZE = 4;

type BadgeVariant = 'both' | 'coffee' | 'laundry';

const BADGE_CONFIG: Record<
  BadgeVariant,
  { label: string; backgroundColor: string; color: string }
> = {
  both: {
    label: 'Coffee & Laundry',
    backgroundColor: theme.pallate.primary['01'],
    color: theme.pallate.primary['03'],
  },
  coffee: {
    label: 'Coffee',
    backgroundColor: theme.pallate.primary['01'],
    color: theme.pallate.primary['03'],
  },
  laundry: {
    label: 'Laundry',
    backgroundColor: theme.pallate.primary['01'],
    color: theme.pallate.primary['03'],
  },
};

function getVariant(services: OutletService[]): BadgeVariant | null {
  if (services.length === 0) return null;
  if (services.length === 2) return 'both';
  return services[0] === 'coffee' ? 'coffee' : 'laundry';
}

const styles = StyleSheet.create({
  dot: {
    width: BADGE_DOT_SIZE,
    height: BADGE_DOT_SIZE,
    borderRadius: BADGE_DOT_SIZE / 2,
  },
});

export const OutletServiceBadge = memo(function OutletServiceBadge({
  services,
  isSelected = false,
  iconOnly = false,
  style,
  selectedBackgroundColor,
  selectedContentColor,
}: OutletServiceBadgeProps) {
  const variant = getVariant(services);
  if (variant == null) return null;

  const config = BADGE_CONFIG[variant];
  const backgroundColor = isSelected
    ? (selectedBackgroundColor ?? config.backgroundColor)
    : theme.pallate.neutral['02'];
  const contentColor = isSelected
    ? (selectedContentColor ?? config.color)
    : theme.pallate.neutral['04'];

  const icons =
    variant === 'both' ? (
      <HStack items="center" spacing={theme.spacing.tiny}>
        <Coffee variant="Bulk" size={BADGE_ICON_SIZE} color={contentColor} />
        {iconOnly ? (
          <Box
            style={[styles.dot, { backgroundColor: contentColor }]}
          />
        ) : null}
        <ShoppingBag variant="Bulk" size={BADGE_ICON_SIZE} color={contentColor} />
      </HStack>
    ) : variant === 'coffee' ? (
      <Coffee variant="Bulk" size={BADGE_ICON_SIZE} color={contentColor} />
    ) : (
      <ShoppingBag variant="Bulk" size={BADGE_ICON_SIZE} color={contentColor} />
    );

  const borderRadius = iconOnly
    ? 999
    : {
        borderBottomLeftRadius: BADGE_BORDER_RADIUS,
        borderTopRightRadius: BADGE_BORDER_RADIUS,
      };

  return (
    <Box
      style={style}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      padding={{
        paddingHorizontal: theme.spacing.standard,
        paddingVertical: theme.spacing.small,
      }}
    >
      <HStack items="center" spacing={theme.spacing.tiny}>
        {icons}
        {!iconOnly && (
          <Text type="l2" weight="medium" color={contentColor}>
            {config.label}
          </Text>
        )}
      </HStack>
    </Box>
  );
});
