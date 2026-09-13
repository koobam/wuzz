import {
  CheckoutHeader,
  OutletAddressBlock,
  PickupTimeSection,
  PurchaseListSection,
  WuzzerPreferenceCard,
  useCheckoutTabs,
  TAB_NAMES,
  type PickupOption,
  type TabName,
} from '@features/(order)/checkout';
import { TabBar } from '@components/molecules';
import { theme, VStack } from '@components/atoms';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Bag2, Truck } from 'iconsax-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

const styles = StyleSheet.create({
  pager: { flex: 1 },
  page: { flex: 1 },
  scrollContent: { paddingBottom: theme.spacing.large, gap: theme.spacing.large },
});

const Checkout = memo((props: any) => {
  const { navigation } = props;
  const { top } = useSafeAreaInsets();
  const pagerRef = useRef<PagerView>(null);
  const {
    activeIndex,
    handleTabPress,
    setSelectedIndex,
  } = useCheckoutTabs();
  const [selectedPickup, setSelectedPickup] = useState<PickupOption>('today');

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSelectPickup = useCallback((option: PickupOption) => {
    setSelectedPickup(option);
  }, []);

  const handleTabPressWithPager = useCallback(
    (tab: string) => {
      handleTabPress(tab);
      const index = TAB_NAMES.indexOf(tab as TabName);
      if (index !== -1) {
        pagerRef.current?.setPage(index);
      }
    },
    [handleTabPress],
  );

  const handlePageSelected = useCallback(
    (e: { nativeEvent: { position: number } }) => {
      setSelectedIndex(e.nativeEvent.position);
    },
    [setSelectedIndex],
  );

  const tabIcons = useMemo(
    () => [
      (color: string) => <Bag2 key="pickup" size={18} color={color} variant="Bulk" />,
      (color: string) => <Truck key="delivery" size={18} color={color} variant="Bulk" />,
    ],
    [],
  );

  return (
    <VStack fill style={styles.pager}>
      <CheckoutHeader onBackPress={handleBackPress} topInset={top} />
      <TabBar
        tabNames={[...TAB_NAMES]}
        onPress={handleTabPressWithPager}
        activeIndex={activeIndex}
        tabIcons={tabIcons}
      />
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        <View key="pickup" style={styles.page}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <OutletAddressBlock />
            <PickupTimeSection
              selectedPickup={selectedPickup}
              onSelectPickup={handleSelectPickup}
            />
            <PurchaseListSection />
          </ScrollView>
        </View>
        <View key="delivery" style={styles.page}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <OutletAddressBlock showDelivery />
            <WuzzerPreferenceCard />
            <PurchaseListSection />
          </ScrollView>
        </View>
      </PagerView>
    </VStack>
  );
});

export default Checkout;
