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
import { useNearestOutlet } from '@features/(outlet)/outlet-list';
import { useCurrentLocation } from '@hooks/utils';
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
  } = useCurrentLocation();
  const {
    outlet: defaultOutlet,
    isLoading: isLoadingOutlet,
    isError: isErrorOutlet,
    error: errorOutlet,
    refetch: refetchOutlet,
  } = useNearestOutlet(coords);
  const {
    data: laundryServiceQueries,
    isLoading: isLoadingLaundryServices,
    isError: isErrorLaundryServices,
    error: errorLaundryServices,
    refetch: refetchLaundryServices,
  } = useFetchLaundryServices();

  const { data: alacarteData } = useFetchLaundryServicesAlacarte();
  console.log(alacarteData)
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
    <VStack as={<ScrollView />} fill>
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
          isLoading={isLoadingLocation || isLoadingOutlet}
          isError={isErrorOutlet}
          error={errorOutlet}
          isLocationError={isLocationError}
          onRefresh={refetchOutlet}
          outlet={
            defaultOutlet
              ? {
                  name: defaultOutlet.name,
                  address: defaultOutlet.address,
                  status: defaultOutlet.status,
                  services: defaultOutlet.services,
                  distanceKm: defaultOutlet.distanceKm,
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
      <ServiceSection onServicePress={handleServicePress} />
      <TermsAndPrivacySection />
    </VStack>
  );
});

Home.displayName = 'Home';

export type { HomeType } from '@features/(bottom)/home/types';
