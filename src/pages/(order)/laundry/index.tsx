import { BannerTestingApp } from '@assets/index';
import type {
  LaundryServiceAddon,
  LaundryServiceDetailErrorResponse,
} from '@core/api/laundry-services.types';
import { VStack, Text, theme } from '@components/atoms';
import type { ChecklistOption, LaundryChecklistSection } from '@features/(order)/laundry';
import {
  ADD_ON_SECTION_TITLE,
  AddOnChecklist,
  formatPriceRupiah,
  getLaundryChecklistSections,
  LaundryBanner,
  LaundryCard,
  LaundryDetailSkeleton,
  LaundryFooter,
  LaundryHeader,
  LAUNDRY_ERROR_DESCRIPTION_DEFAULT,
  LAUNDRY_ERROR_TITLE_DEFAULT,
  ServiceTypeRow,
  useLaundryForm,
  useLaundryHeaderScroll,
  useStretchyBannerStyle,
  WeightEstimateSlider,
} from '@features/(order)/laundry';
import { memo, useCallback, useMemo } from 'react';
import { useWindowDimensions, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '@navigation/root/root.types';
import { useFetchLaundryServiceDetail } from '@hooks/apis';

const styles = StyleSheet.create({
  scrollFill: { flex: 1 },
  wrapper: { flex: 1 },
  contentContainer: {
    paddingBottom: theme.spacing.large,
  },
  contentCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.large,
  },
});

const ADDON_ICONS: ChecklistOption['icon'][] = [
  'fold',
  'iron',
  'bag',
  'white',
  'pewangi_premium',
  'pelindung_warna',
];

function mapAddonsToOptions(addons: LaundryServiceAddon[]): ChecklistOption[] {
  return addons.map((addon) => ({
    id: String(addon.id),
    label: addon.name,
    description: addon.description,
    price: addon.price,
    free: addon.price === 0,
    icon: ADDON_ICONS.includes(addon.icon as ChecklistOption['icon'])
      ? (addon.icon as ChecklistOption['icon'])
      : 'fold',
  }));
}

function buildChecklistSectionsFromService(
  addons: LaundryServiceAddon[] | undefined,
): LaundryChecklistSection[] {
  if (!addons?.length) return [];
  return [
    {
      id: 'addons',
      title: ADD_ON_SECTION_TITLE,
      options: mapAddonsToOptions(addons),
      selectionMode: 'multiple',
      canOptOut: true,
    },
    {
      id: 'addons',
      title: ADD_ON_SECTION_TITLE,
      options: mapAddonsToOptions(addons),
      selectionMode: 'multiple',
      canOptOut: true,
    },
  ];
}

type LaundryRouteProp = RouteProp<RootStackParamList, 'laundry'>;

export const Laundry = memo(() => {
  const { width } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<LaundryRouteProp>();
  const paramType = route.params?.type;
  const serviceId = route.params?.serviceId ?? '';

  const { data: serviceDetail, isLoading, isError, error: queryError } = useFetchLaundryServiceDetail(serviceId);

  const errorPayload = (queryError as unknown as LaundryServiceDetailErrorResponse | undefined)?.data;
  const errorTitle = errorPayload?.title ?? LAUNDRY_ERROR_TITLE_DEFAULT;
  const errorDescription = errorPayload?.description ?? LAUNDRY_ERROR_DESCRIPTION_DEFAULT;

  const laundryType = useMemo(() => {
    const fromService = serviceDetail?.service_type;
    if (fromService === 'kiloan') return 'multiple' as const;
    if (fromService === 'satuan') return 'single' as const;
    if (paramType === 'kiloan') return 'multiple' as const;
    if (paramType === 'satuan') return 'single' as const;
    return undefined;
  }, [serviceDetail?.service_type, paramType]);

  const checklistSections = useMemo(() => {
    const fromApi = buildChecklistSectionsFromService(serviceDetail?.addons);
    if (fromApi.length > 0) return fromApi;
    return getLaundryChecklistSections(laundryType);
  }, [serviceDetail?.addons, laundryType]);

  const mainSectionId = checklistSections[0]?.id ?? 'main';

  const {
    scrollY,
    scrollHandler,
    headerBackgroundStyle,
    headerPositionStyle,
    headerShadowStyle,
  } = useLaundryHeaderScroll({ safeAreaTop: top });
  const stretchyHeaderStyle = useStretchyBannerStyle({ scrollY, width });
  const {
    selectedServiceId,
    sectionSelections,
    weightKg,
    handleWeightChange,
    handleServiceSelect,
    handleSectionSelectionChange,
    priceLabel: formPriceLabel,
  } = useLaundryForm({
    laundryType,
    sections: checklistSections,
    mainSectionId,
    initialWeightKg: serviceDetail?.min_kg ?? 5,
  });

  const priceLabel = useMemo(() => {
    if (!serviceDetail) return formPriceLabel;
    const unit = serviceDetail.unit?.toLowerCase();
    const isPerKg = unit === 'kg';
    const baseTotal = isPerKg
      ? serviceDetail.price * weightKg
      : serviceDetail.price;
    const addonIds = sectionSelections['addons'] ?? [];
    const addons = serviceDetail.addons ?? [];
    const addonTotal = addonIds.reduce(
      (sum, id) => sum + (addons.find((a) => String(a.id) === id)?.price ?? 0),
      0,
    );
    return formatPriceRupiah(baseTotal + addonTotal);
  }, [serviceDetail, formPriceLabel, weightKg, sectionSelections]);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  if (serviceId && isLoading) {
    return (
      <VStack fill>
        <LaundryHeader
          title="Loading..."
          onBackPress={handleBackPress}
          onHelpPress={() => {}}
          style={[headerPositionStyle, headerBackgroundStyle]}
        />
        <LaundryDetailSkeleton />
      </VStack>
    );
  }

  if (serviceId && isError) {
    return (
      <VStack fill>
        <LaundryHeader
          title={errorTitle}
          onBackPress={handleBackPress}
          onHelpPress={() => {}}
          style={[headerPositionStyle, headerBackgroundStyle]}
        />
        <VStack style={styles.contentCenter} fill>
          <Text type="s3" weight="semibold" color={theme.pallate.neutral['05']}>
            {errorTitle}
          </Text>
          <Text type="l2" color={theme.pallate.neutral['04']} style={{ marginTop: theme.spacing.small }}>
            {errorDescription}
          </Text>
        </VStack>
      </VStack>
    );
  }

  const cardTitle = serviceDetail?.name ?? (laundryType === 'single' ? 'Laundry Satuan' : undefined);
  const cardDescription =
    serviceDetail?.description ??
    (laundryType === 'single' ? 'Cuci per item, pilih jenis pakaian.' : undefined);
  const basePricePerKg = serviceDetail?.service_type === 'kiloan' ? serviceDetail.price : undefined;
  const priceUnit = serviceDetail?.unit;
  const showKgLabel = laundryType !== 'single';
  const minKg = serviceDetail?.min_kg;
  const maxKg = serviceDetail?.max_kg ?? 30;
  const initialKg = serviceDetail?.min_kg ?? 5;

  return (
    <VStack fill>
      <LaundryHeader
        title={serviceDetail?.name ?? ''}
        onBackPress={handleBackPress}
        onHelpPress={() => {}}
        style={[headerPositionStyle, headerBackgroundStyle, headerShadowStyle]}
      />
      <Animated.ScrollView
        style={styles.scrollFill}
        contentContainerStyle={styles.contentContainer}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces
      >
        <LaundryBanner
          style={stretchyHeaderStyle}
          imageUri={
            serviceDetail?.image && serviceDetail.image.length > 0
              ? serviceDetail.image
              : BannerTestingApp
          }
        />
        <VStack
          margin={{ marginTop: -theme.spacing.large * 2 }}
          spacing={theme.spacing.large}
        >
          <LaundryCard
            title={cardTitle}
            description={cardDescription}
            basePricePerKg={basePricePerKg}
            priceLabel={priceLabel}
            priceUnit={priceUnit}
            showKgLabel={showKgLabel}
          />
          <ServiceTypeRow
            selectedId={selectedServiceId}
            onSelect={handleServiceSelect}
            hideKgLabel={laundryType === 'single'}
          />
          {laundryType === 'multiple' && (
            <WeightEstimateSlider
              minKg={minKg}
              maxKg={maxKg}
              initialKg={initialKg}
              onChange={handleWeightChange}
            />
          )}
          {checklistSections.map((section: LaundryChecklistSection) => (
            <AddOnChecklist
              key={section.id}
              options={section.options}
              title={section.title}
              selectionMode={section.selectionMode}
              canOptOut={section.canOptOut}
              selectedIds={sectionSelections[section.id]}
              onSelectionChange={(ids) =>
                handleSectionSelectionChange(section.id, ids)
              }
            />
          ))}
        </VStack>
      </Animated.ScrollView>
      <LaundryFooter priceLabel={priceLabel} />
    </VStack>
  );
});

export default Laundry;
