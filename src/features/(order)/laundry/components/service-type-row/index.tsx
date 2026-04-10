import { HStack, Icon, Text, theme, VStack } from '@components/atoms';
import { InfoCircle } from 'iconsax-react-native';
import { memo, useCallback, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import type { ServiceTypeId } from '../../types';
import { SERVICE_TYPE_OPTIONS_DATA } from '../../utils';
import { ServiceTypeCard } from '../service-type-card';
import type { ServiceTypeRowProps } from './service-type-row.types';


const ICON_BY_ID = {
  reguler: <Icon icon="reguler" size={32} color={theme.pallate.primary['02']} />,
  express: <Icon icon="express" size={40} color={theme.pallate.primary['02']} />,
  kilat: <Icon icon="kilat" size={32} color={theme.pallate.primary['02']} />,
} as const;

export const ServiceTypeRow = memo(function ServiceTypeRow({
  selectedId: controlledSelectedId,
  onSelect,
  hideKgLabel = false,
}: ServiceTypeRowProps) {
  const { width } = useWindowDimensions();
  const [internalSelectedId, setInternalSelectedId] =
    useState<ServiceTypeId>('reguler');

  const selectedId =
    controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;

  const horizontalPadding = theme.spacing.large * 2;
  const gap = theme.spacing.standard;
  const cardWidth = (width - horizontalPadding - gap * 2) / 3;

  const options = useMemo(
    () =>
      SERVICE_TYPE_OPTIONS_DATA.map((data) => ({
        ...data,
        icon: ICON_BY_ID[data.id],
      })),
    [],
  );

  const handlePress = useCallback(
    (id: ServiceTypeId) => {
      if (controlledSelectedId === undefined) {
        setInternalSelectedId(id);
      }
      onSelect?.(id);
    },
    [controlledSelectedId, onSelect],
  );

  const selectedOption = options.find((o) => o.id === selectedId);

  return (
    <VStack
      padding={{ paddingHorizontal: theme.spacing.large }}
      spacing={theme.spacing.standard}
    >
      <HStack
        spacing={theme.spacing.standard}
        items="stretch"
      >
        {options.map((option) => (
          <ServiceTypeCard
            key={option.id}
            option={option}
            cardWidth={cardWidth}
            selected={selectedId === option.id}
            onPress={() => handlePress(option.id)}
            hideKgLabel={hideKgLabel}
          />
        ))}
      </HStack>
      {selectedOption?.selectedCopy != null && (
        <HStack items="center" spacing={theme.spacing.tiny}>
          <InfoCircle
            size={16}
            color={theme.pallate.neutral['04']}
            variant="Linear"
          />
          <Text type="l2" color={theme.pallate.neutral['04']}>
            {selectedOption.selectedCopy}
          </Text>
        </HStack>
      )}
    </VStack>
  );
});

export type { ServiceTypeRowProps } from './service-type-row.types';
