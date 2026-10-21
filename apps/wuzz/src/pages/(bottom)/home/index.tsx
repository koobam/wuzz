import { memo, useCallback, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useFocusEffect } from '@react-navigation/native';
import { theme, VStack } from '@components/atoms';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import type { HomeType } from '@features/(bottom)/home/types';
import {
  BusinessCard,
  CategoryGrid,
  HomeBanner,
  HomeHeader,
  MoodSection,
  OngoingOrdersSection,
  OnlyServiceSection,
  MemberCard,
  QuickActions,
  ServiceSection,
  TermsAndPrivacySection,
  WuzzerNearby,
} from '@features/(bottom)/home/components';
import {
  useCoverageLabel,
  useNearbyWuzzers,
} from '@features/(bottom)/home/hooks';
import { getHomeHeaderHeight } from '@features/(bottom)/home/components/home-header';
import {
  useFetchLaundryServices,
  useFetchLaundryServicesAlacarte,
  useFetchMemberSummary,
  useFetchMoods,
} from '@services/index';
import { LaundryService } from '@core/api';
import { useAuthState } from '@hooks/utils/useAuth';
import { useBottomNavHeight } from '@services/contexts/bottom-nav-height';
import { OnlyServiceItem } from '@features/(bottom)/home/components/only-service-section/only-service-section.types';

const styles = StyleSheet.create({
  content: { gap: theme.spacing.large },
});

/** The header only reacts to a deliberate swipe: this far down in one direction
 *  to tuck away, this far up to come back. Smaller wobbles (momentum, bounce,
 *  content loading in) are ignored so it does not flicker in and out. */
/** Setiap kartu membawa onPress sendiri; ini hanya syarat tipe props section. */
const noop = () => {};

const HEADER_HIDE_DISTANCE = 56;
const HEADER_SHOW_DISTANCE = 24;

export const Home = memo((props: HomeType) => {
  const { navigation } = props;
  const { top } = useSafeAreaInsets();
  const { navHeight } = useBottomNavHeight();
  const screenWidth = Dimensions.get('screen').width;
  const { isAuthenticated } = useAuthState();
  const {
    label: locationLabel,
    refetch: refetchLocation,
    location,
  } = useCoverageLabel();
  const {
    data: memberSummary,
    isLoading: isLoadingMember,
    isError: isErrorMember,
    refetch: refetchMember,
  } = useFetchMemberSummary({ enabled: isAuthenticated });

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

  const wuzzers = useNearbyWuzzers(location.coords);

  const handleSeeAllWuzzers = useCallback(() => {
    navigation.navigate('wuzzerlist', location.coords ?? undefined);
  }, [navigation, location.coords]);

  const handleLoginPress = useCallback(() => {
    navigation.navigate('login');
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('menusearch');
  }, [navigation]);

  const handleScanPress = useCallback(() => {
    navigation.navigate('scan');
  }, [navigation]);

  const handleCategoryPress = useCallback(
    (item: LaundryService) => {
      navigation.navigate({
        name: 'laundry',
        params: { serviceId: String(item.id) },
      });
    },
    [navigation],
  );

  const handleServicePress = useCallback(() => {
    navigation.navigate('checkout');
  }, [navigation]);

  const handleSeeAllOrders = useCallback(() => {
    navigation.navigate('history');
  }, [navigation]);

  const handleOrderPress = useCallback(
    (orderId: string) => {
      navigation.navigate('orderstatus', { orderId });
    },
    [navigation],
  );

  const handleOnlyServicePress = useCallback(
    (item: OnlyServiceItem) => {
      navigation.navigate('laundry', {
        type: (item.serviceType ?? 'satuan') as 'satuan' | 'kiloan',
        serviceId: String(item.id),
      });
    },
    [navigation],
  );

  const toServiceItems = useCallback(
    (services: LaundryService[], onItemPress?: () => void) =>
      services.map(service => {
        const promo =
          service.discount > 0
            ? service.discount_type === 'percentage'
              ? `${service.discount}%`
              : String(service.discount)
            : undefined;
        const item: OnlyServiceItem = {
          id: service.id,
          name: service.name,
          description: service.description,
          icon: service.icon,
          promo,
          serviceType:
            service.service_type === 'multiple' ? 'kiloan' : 'satuan',
        };
        return {
          ...item,
          onPress: onItemPress ?? (() => handleOnlyServicePress(item)),
        };
      }),
    [handleOnlyServicePress],
  );

  // Self service dipakai di mesin outlet: memilih salah satu kartu membuka scan
  // QR dulu, bukan halaman pesan.
  const selfServiceItems = useMemo(
    () => toServiceItems(alacarteData?.services ?? [], handleScanPress),
    [alacarteData?.services, toServiceItems, handleScanPress],
  );
  const handleContactPress = useCallback(() => {
    navigation.navigate('chat');
  }, [navigation]);

  // Kept on the UI thread and handed to the banner, which stretches itself
  // while the list is over-scrolled. A state variable would re-render the
  // whole screen on every scroll frame to move one image.
  const scrollY = useSharedValue(0);
  // The header tucks away while scrolling down and returns on scrolling up. Near
  // the top it is always shown, so the bounce there never leaves it hidden or
  // flickering.
  const lastScrollY = useSharedValue(0);
  // Where the current run in one direction began, and which way it goes.
  const runStartY = useSharedValue(0);
  const runDirection = useSharedValue(0);
  const headerHidden = useSharedValue(false);
  // True only while a finger (or its momentum) is moving the list. Content that
  // loads in or resizes also shifts the offset, and that must not tuck the
  // header away: the user did nothing, so it vanished for no visible reason.
  const userScrolling = useSharedValue(false);
  const revealZone = getHomeHeaderHeight(top);

  // Coming back to Home always starts with the header showing, whatever state
  // the last scroll left it in.
  useFocusEffect(
    useCallback(() => {
      headerHidden.value = false;
    }, [headerHidden]),
  );

  const handleScroll = useAnimatedScrollHandler({
    onBeginDrag: () => {
      userScrolling.value = true;
    },
    onEndDrag: event => {
      // No momentum follows a drag that ends at rest.
      if (Math.abs(event.velocity?.y ?? 0) < 0.05) {
        userScrolling.value = false;
      }
    },
    onMomentumEnd: () => {
      userScrolling.value = false;
    },
    onScroll: event => {
      const y = event.contentOffset.y;
      const dy = y - lastScrollY.value;
      scrollY.value = y;
      lastScrollY.value = y;

      if (y > revealZone && !userScrolling.value) {
        // Offset moved by itself (layout shift): restart the run, leave the header.
        runDirection.value = 0;
        return;
      }

      if (dy !== 0) {
        const direction = dy > 0 ? 1 : -1;
        if (direction !== runDirection.value) {
          runDirection.value = direction;
          runStartY.value = y - dy;
        }
      }

      if (y <= revealZone) {
        headerHidden.value = false;
      } else if (
        runDirection.value === 1 &&
        y - runStartY.value > HEADER_HIDE_DISTANCE
      ) {
        headerHidden.value = true;
      } else if (
        runDirection.value === -1 &&
        runStartY.value - y > HEADER_SHOW_DISTANCE
      ) {
        headerHidden.value = false;
      }
    },
  });

  return (
    // The header sits outside the scroll view so it stays pinned and the page
    // scrolls underneath its frosted glass.
    <View style={{ flex: 1 }}>
      <VStack
        as={
          <Animated.ScrollView
            // Without this iOS adds its own safe-area inset and parks the resting
            // contentOffset at a small negative number rather than 0. The banner
            // reads a negative offset as over-scroll, so it would sit permanently
            // zoomed and every stretch would start from the wrong place.
            contentInsetAdjustmentBehavior="never"
            // One gap between every section, so no section carries its own bottom
            // space. On the content container: the scroll view's own style would
            // not reach its children.
            contentContainerStyle={styles.content}
            onScroll={handleScroll}
            scrollEventThrottle={16}
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
          borderRadius={{
            borderBottomLeftRadius: 40,
          }}
        >
          <HomeBanner screenWidth={screenWidth} scrollY={scrollY} />
          <QuickActions
            onSearchPress={handleSearchPress}
            onScanPress={handleScanPress}
          />
          <MemberCard
            isAuthenticated={isAuthenticated}
            summary={memberSummary}
            isLoading={isLoadingMember}
            isError={isErrorMember}
            onRetry={refetchMember}
            onLoginPress={handleLoginPress}
          />
        </VStack>

        <CategoryGrid
          onCategoryPress={handleCategoryPress}
          items={laundryServiceQueries?.services ?? []}
          isLoading={isLoadingLaundryServices}
          isError={isErrorLaundryServices}
          error={errorLaundryServices}
          onRetry={refetchLaundryServices}
        />
        {selfServiceItems.length > 0 && (
          <OnlyServiceSection
            title="Self Service"
            subtitle="Ketemu outlet self service? Pilih layanan, lalu scan QR di mesin."
            items={selfServiceItems}
            onServicePress={noop}
          />
        )}
        <OngoingOrdersSection
          onOrderPress={handleOrderPress}
          onSeeAllPress={handleSeeAllOrders}
        />
        <BusinessCard onContactPress={handleContactPress} />
        <WuzzerNearby
          wuzzers={wuzzers}
          onSeeAll={handleSeeAllWuzzers}
          coords={location.coords}
          isLocating={location.isLoading}
          isLocationError={location.isLocationError}
        />
        {moods && (
          <MoodSection
            moods={moods}
            isLoading={isLoadingMoods}
            isError={isErrorMoods}
            error={errorMoods}
          />
        )}
        <TermsAndPrivacySection />
        {/* The tab bar floats over the page; this keeps the last section clear. */}
        <VStack height={navHeight} />
      </VStack>
      <HomeHeader
        topInset={top}
        isAuthenticated={isAuthenticated}
        onLoginPress={handleLoginPress}
        locationLabel={locationLabel}
        points={memberSummary?.points}
        hidden={headerHidden}
      />
    </View>
  );
});

Home.displayName = 'Home';

export type { HomeType } from '@features/(bottom)/home/types';
