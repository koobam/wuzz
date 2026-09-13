import { HStack, Pressable, Text, theme } from '@components/atoms';
import { Category2, Coffee, ShoppingBag } from 'iconsax-react-native';
import { memo, useCallback } from 'react';
import type { ServiceFilter } from '../../types';
import { getServiceFilterLabel, getServiceFilterPillStyle } from '../../utils';
import type { ServiceFilterPillsProps } from './service-filter-pills.types';

const FILTER_OPTIONS: ServiceFilter[] = ['all', 'coffee', 'laundry'];

const PILL_ICONS = {
  all: Category2,
  coffee: Coffee,
  laundry: ShoppingBag,
} as const;

export const ServiceFilterPills = memo(({ value, onChange }: ServiceFilterPillsProps) => {
  const handlePress = useCallback(
    (filter: ServiceFilter) => {
      onChange(filter);
    },
    [onChange],
  );

  return (
    <HStack
      padding={{
        paddingHorizontal: theme.spacing.large,
        paddingBottom: theme.spacing.standard,
      }}
      gap={theme.spacing.small}
    >
      {FILTER_OPTIONS.map((filter) => {
        const isActive = value === filter;
        const isNotAll = filter !== 'all';
        const label = getServiceFilterLabel(filter);
        const { backgroundColor, color } = getServiceFilterPillStyle(filter, isActive);
        const Icon = PILL_ICONS[filter];
        return (
          <Pressable
            key={filter}
            fill={isNotAll}
            width={isNotAll ? undefined : 44}
            height={isNotAll ? undefined : 44}
            onPress={() => handlePress(filter)}
            borderRadius={999}
            backgroundColor={backgroundColor}
            items="center"
            justify="center"
            gap={theme.spacing.small}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`Filter ${label}`}
          >
            <Icon size={18} color={color} variant="Bulk" />
            {isNotAll && (
              <Text type="l1" weight="medium" color={color}>
                {label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </HStack>
  );
});
