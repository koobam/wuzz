import { memo, useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { VStack } from '@components/atoms';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import type { HomeType } from '@features/(bottom)/home/types';
import {
  CategoryGrid,
  HomeBanner,
  HomeHeader,
  MoodSection,
  OrderTrackingList,
  OnlyServiceSection,
  OutletCard,
  ProcessingSection,
  ServiceSection,
  TermsAndPrivacySection,
} from '@features/(bottom)/home/components';
import { useOutletListData } from '@features/(outlet)/outlet-list';
import { useCurrentLocation } from '@hooks/utils';
import { useSelectedOutlet } from '@services/contexts';
import type { OnlyServiceItem } from '@features/(bottom)/home/utils';
import {
  useFetchLaundryServices,
  useFetchLaundryServicesAlacarte,
  useFetchMoods,
} from '@services/index';
import { LaundryService } from '@core/api';

const styles = StyleSheet.create({
  overflowHidden: { overflow: 'hidden' },
});

export const Home = memo((props: HomeType) => {
  const { navigation } = props;
  const { top } = useSafeAreaInsets();
  const screenWidth = Dimensions.get('screen').width;
  const {
    coords,
    isLoading: isLoadingLocation,
    isLocationError,
    isError: isErrorLocation,
    refetch: refetchLocation,
  } = useCurrentLocation();
  // Outlet yang ditampilkan = objek terpilih global (di-set dari nearest atau
  // pilihan di daftar), jadi konsisten dengan halaman list.
  const { selectedOutlet } = useSelectedOutlet();
  // Tetap fetch list (untuk init context dari nearest + state loading/error kartu).
  const {
    isLoading: isLoadingOutlet,
    isError: isErrorOutlet,
    error: errorOutlet,
    refetch: refetchOutlet,
  } = useOutletListData(coords, { enabled: !isLoadingLocation });

  // "Coba lagi" pada kartu outlet: ulangi ambil lokasi (yang otomatis memicu
  // ulang query outlet lewat coords) sekaligus refetch outlet.
  const handleOutletRefresh = useCallback(() => {
    refetchLocation();
    refetchOutlet();
  }, [refetchLocation, refetchOutlet]);

  // Pull-to-refresh: ulangi lokasi + refetch SEMUA query aktif (outlet, services,
  // alacarte, moods, order tracking, dst) supaya seluruh section ikut segar.
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handlePullRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      refetchLocation();
      await queryClient.refetchQueries({ type: 'active' });
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient, refetchLocation]);
  const {
    data: laundryServiceQueries,
    isLoading: isLoadingLaundryServices,
    isError: isErrorLaundryServices,
    error: errorLaundryServices,
    refetch: refetchLaundryServices,
  } = useFetchLaundryServices();

  const { data: alacarteData } = useFetchLaundryServicesAlacarte();
  const {
    data: moodsData,
    isLoading: isLoadingMoods,
    isError: isErrorMoods,
    error: errorMoods,
  } = useFetchMoods();
  const moods = moodsData?.moods ?? null;
  
  const handleOutletPress = useCallback(() => {
    navigation.navigate('outletlist');
  }, [navigation]);

  const handleCategoryPress = useCallback((item: LaundryService) => {
    navigation.navigate({ name: 'laundry', params: { serviceId: String(item.id) } });
  }, [navigation]);

  const handleServicePress = useCallback(() => {
    navigation.navigate('checkout');
  }, [navigation]);

  const handleOrderPress = useCallback(
    (orderId: string) => {
      navigation.navigate('orderstatus', { orderId });
    },
    [navigation],
  );

  const handleOnlyServicePress = useCallback(
    (item: OnlyServiceItem) => {
      navigation.navigate({
        name: 'laundry',
        params: {
          type: item.serviceType ?? 'satuan',
          serviceId: item.id,
        },
      });
    },
    [navigation],
  );

  const onlyServiceItems = useMemo((): Array<
    OnlyServiceItem & { onPress: () => void }
  > => {
    const services = alacarteData?.services ?? [];
    return services.map(service => {
      const promo =
        service.discount > 0
          ? service.discount_type === 'percentage'
            ? `${service.discount}%`
            : String(service.discount)
          : undefined;
      const item: OnlyServiceItem = {
        id: String(service.id),
        name: service.name,
        description: service.description,
        icon: service.icon,
        promo,
        serviceType: service.service_type === 'multiple' ? 'kiloan' : 'satuan',
      };
      return {
        ...item,
        onPress: () => handleOnlyServicePress(item),
      };
    });
  }, [alacarteData?.services, handleOnlyServicePress]);

  return (
    <VStack
      as={
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handlePullRefresh}
            />
          }
        />
      }
      fill
    >
      <VStack
        style={styles.overflowHidden}
        borderRadius={{
          borderBottomLeftRadius: 40,
        }}
      >
        <HomeHeader topInset={top} />
        <HomeBanner screenWidth={screenWidth} />
        <OutletCard
          onPress={handleOutletPress}
          isLoading={!selectedOutlet && (isLoadingLocation || isLoadingOutlet)}
          isError={isErrorOutlet || isErrorLocation}
          error={errorOutlet}
          isLocationError={isLocationError}
          onRefresh={handleOutletRefresh}
          outlet={
            selectedOutlet
              ? {
                  name: selectedOutlet.name,
                  address: selectedOutlet.address,
                  status: selectedOutlet.status,
                  services: selectedOutlet.services,
                  distanceKm: selectedOutlet.distance_in_km,
                }
              : undefined
          }
        />
      </VStack>

      <CategoryGrid
        onCategoryPress={handleCategoryPress}
        items={laundryServiceQueries?.services ?? []}
        isLoading={isLoadingLaundryServices}
        isError={isErrorLaundryServices}
        error={errorLaundryServices}
        onRefresh={refetchLaundryServices}
      />
      {onlyServiceItems.length > 0 && (
        <OnlyServiceSection
          onServicePress={handleOnlyServicePress}
          items={onlyServiceItems}
        />
      )}
      <ProcessingSection />
      <OrderTrackingList onOrderPress={handleOrderPress} />
      {moods && (
        <MoodSection
          moods={moods}
          isLoading={isLoadingMoods}
          isError={isErrorMoods}
          error={errorMoods}
        />
      )}
      <TermsAndPrivacySection />
    </VStack>
  );
});

Home.displayName = 'Home';

export type { HomeType } from '@features/(bottom)/home/types';
