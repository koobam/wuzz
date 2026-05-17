import { memo, useCallback, useMemo } from 'react';
import { VStack } from '@components/atoms';
import { ScrollView, StyleSheet } from 'react-native';
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
import {
  useFetchLaundryServices,
  useFetchLaundryServicesAlacarte,
  useFetchMoods,
  useFetchNearestOutlet,
} from '@services/index';
import { LaundryService } from '@core/api';
import { useLocationState } from '@services/contexts';
import { useAuthState } from '@hooks/utils/useAuth';
import type { OutletStatus } from '@features/(outlet)/outlet-list';

const styles = StyleSheet.create({
  overflowHidden: { overflow: 'hidden' },
});

export const Home = memo((props: HomeType) => {
  const { navigation } = props;
  const { top } = useSafeAreaInsets();
  const screenWidth = Dimensions.get('screen').width;
  const { coords } = useLocationState();
  const { isAuthenticated } = useAuthState();

  const handleLoginPress = useCallback(() => {
    navigation.getParent()?.navigate('login' as never);
  }, [navigation]);
  const {
    data: nearestOutlet,
    isFetching: isFetchingOutlet,
    isError: isOutletError,
    error: errorOutlet,
  } = useFetchNearestOutlet({
    lat: coords?.lat ?? 0,
    long: coords?.long ?? 0,
  });
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

  const onlyServiceItems = useMemo(() => {
    if (!alacarteData?.laundry_services) return [];
    return alacarteData.laundry_services.map((service) => ({
      id: service.id,
      name: service.name,
      icon: service.icon,
      serviceType: service.service_type,
    }));
  }, [alacarteData]);

  const nearestOutletData = useMemo(() => {
    if (!nearestOutlet) return undefined;
    return {
      id: nearestOutlet.id,
      name: nearestOutlet.name,
      address: nearestOutlet.address,
      distanceKm: nearestOutlet.distance_in_km,
      status: nearestOutlet.current_status as OutletStatus,
      services: ['laundry' as const],
      deliveryTypes: nearestOutlet.delivery_types,
      hours: nearestOutlet.hours?.length >= 2
        ? [nearestOutlet.hours[0], nearestOutlet.hours[1]] as [string, string]
        : undefined,
    };
  }, [nearestOutlet]);

  return (
    <VStack as={<ScrollView />} fill>
      <VStack
        style={styles.overflowHidden}
        borderRadius={{
          borderBottomLeftRadius: 40,
        }}
      >
        <HomeHeader topInset={top} isAuthenticated={isAuthenticated} onLoginPress={handleLoginPress} />
        <HomeBanner screenWidth={screenWidth} />
        <OutletCard
          onPress={handleOutletPress}
          isError={isOutletError}
          isLoading={isFetchingOutlet}
          error={errorOutlet}
          outlet={nearestOutletData}
        />
      </VStack>

      <CategoryGrid
        onCategoryPress={handleCategoryPress}
        items={laundryServiceQueries?.laundry_services ?? []}
        isLoading={isLoadingLaundryServices}
        isError={isErrorLaundryServices}
        error={errorLaundryServices}
        onRetry={refetchLaundryServices}
      />
      {}
      <OnlyServiceSection
        onServicePress={handleOnlyServicePress}
        items={onlyServiceItems}
      />
      <ProcessingSection />
      <OrderTrackingList onOrderPress={handleOrderPress} />
      <MoodSection
        moods={moods}
        isLoading={isLoadingMoods}
        isError={isErrorMoods}
        error={errorMoods}
      />

      <ServiceSection onServicePress={handleServicePress} />
      <TermsAndPrivacySection />
    </VStack>
  );
});

Home.displayName = 'Home';

export type { HomeType } from '@features/(bottom)/home/types';
