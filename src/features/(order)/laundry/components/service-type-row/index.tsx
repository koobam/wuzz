import { HStack, Icon, Text, theme, VStack } from '@components/atoms';
import { EmptyStatePlaceholder } from '@components/molecules';
import type { LaundryServiceTier } from '@core/api/laundry-services.types';
import { InfoCircle } from 'iconsax-react-native';
import { memo, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import type { ServiceTypeId, ServiceTypeOption } from '../../types';
import { ServiceTypeCard } from '../service-type-card';
import type { ServiceTypeRowProps } from './service-type-row.types';


const ICON_BY_CODE: Record<string, ReactNode> = {
  reguler: <Icon icon="reguler" size={32} color={theme.pallate.primary['02']} />,
  express: <Icon icon="express" size={40} color={theme.pallate.primary['02']} />,
  kilat: <Icon icon="kilat" size={32} color={theme.pallate.primary['02']} />,
};

const iconForCode = (code: string): ReactNode =>
  ICON_BY_CODE[code] ?? ICON_BY_CODE.reguler;

/** Label Bahasa Indonesia untuk unit estimasi waktu dari API. */
const TIME_UNIT_LABEL_ID: Record<string, string> = {
  day: 'hari',
  days: 'hari',
  hour: 'jam',
  hours: 'jam',
  minute: 'menit',
  minutes: 'menit',
};

function buildTierSelectedCopy(tier: LaundryServiceTier): string | undefined {
  const time = tier.pricing?.estimated_time;
  if (!time) return undefined;
  const unitRaw = tier.pricing?.estimated_time_unit ?? '';
  const unit = TIME_UNIT_LABEL_ID[unitRaw] ?? unitRaw;
  return `Estimasi selesai ${time} ${unit}.`.trim();
}

/** Petakan satu tier API ke opsi kartu ServiceTypeRow. */
function mapTierToOption(
  tier: LaundryServiceTier,
  hideKgLabel: boolean,
): ServiceTypeOption {
  const price = tier.pricing?.price ?? 0;
  return {
    id: tier.code,
    title: tier.name,
    selectedCopy: buildTierSelectedCopy(tier),
    extraPerKg: hideKgLabel ? 0 : price,
    extraSatuan: hideKgLabel ? price : 0,
    icon: iconForCode(tier.code),
  };
}

export const ServiceTypeRow = memo(function ServiceTypeRow({
  tiers,
  selectedId: controlledSelectedId,
  onSelect,
  hideKgLabel = false,
}: ServiceTypeRowProps) {
  const { width } = useWindowDimensions();
  const [internalSelectedId, setInternalSelectedId] =
    useState<ServiceTypeId | undefined>(undefined);

  const horizontalPadding = theme.spacing.large * 2;
  const gap = theme.spacing.standard;
  const cardWidth = (width - horizontalPadding - gap * 2) / 3;

  const options = useMemo<ServiceTypeOption[]>(() => {
    if (!tiers?.length) return [];
    return [...tiers]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((tier) => mapTierToOption(tier, hideKgLabel));
  }, [tiers, hideKgLabel]);

  const requestedId =
    controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;

  // Default terpilih murni dari API: tier pertama kalau requestedId belum cocok.
  const selectedId = options.some((o) => o.id === requestedId)
    ? requestedId
    : options[0]?.id;

  // Sinkronkan tier pertama (dari API) ke state saat belum ada seleksi yang valid.
  useEffect(() => {
    if (options.length === 0) return;
    if (options.some((o) => o.id === requestedId)) return;
    const firstId = options[0].id;
    if (controlledSelectedId === undefined) {
      setInternalSelectedId(firstId);
    }
    onSelect?.(firstId);
  }, [options, requestedId, controlledSelectedId, onSelect]);

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

  if (options.length === 0) {
    return (
      <EmptyStatePlaceholder
        icon={
          <InfoCircle
            size={48}
            color={theme.pallate.neutral['04']}
            variant="Linear"
          />
        }
        iconSize={48}
        title="Tipe layanan belum tersedia"
        description="Coba muat ulang atau pilih layanan lain."
      />
    );
  }

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
