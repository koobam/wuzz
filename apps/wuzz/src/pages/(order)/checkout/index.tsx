import {
  BACK_HEIGHT,
  CheckoutFooter,
  CheckoutHeader,
  ORDER_TIMING_OPTIONS,
  type OrderTiming,
  MethodCard,
  MethodSheet,
  ScheduleSheet,
  describeSchedule,
  ADDRESS_CARD_HEIGHT,
  OrderAddressCard,
  STICKER_LIFT,
  OrderMapBand,
  PICKUP_SLOTS,
  PurchaseListSection,
  Section,
  SummaryRow,
  todayKey,
  type OrderMethod,
} from '@features/(order)/checkout';
import { formatPriceRupiah } from '@features/(order)/laundry/utils/format';
import { Button, Text, theme, VStack } from '@components/atoms';
import { Trash } from 'iconsax-react-native';
import { useOrderDraft } from '@services/contexts';
import { useFetchOutlets } from '@hooks/apis';
import { useDeliveryAddress } from '@features/(account)/delivery-address';
import { memo, useCallback, useRef, useState } from 'react';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useStretchyBannerStyle } from '@features/(bottom)/home/hooks';
import { Alert, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

/** How far the white sheet rides up over the map. */
const SHEET_OVERLAP = theme.spacing.large * 2;
const ADDRESS_HALF = ADDRESS_CARD_HEIGHT / 2;
/** Map showing under the back pill, before the sheet starts. */
const MAP_BELOW_BACK = 200;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1 },
  sheet: {
    flexGrow: 1,
    // One gap between every section, so they sit evenly.
    gap: theme.spacing.large,
    backgroundColor: theme.pallate.neutral['01'],
    borderTopLeftRadius: SHEET_OVERLAP,
    borderTopRightRadius: SHEET_OVERLAP,
    borderCurve: 'continuous',
  },
});

/**
 * Checkout: satu pesanan untuk satu wuzzer, bukan keranjang. Peta alamat di
 * atas, kartu metode (Delivery/Pickup, Instan/Jadwalkan) dan alamat, lalu lembar
 * putih berisi isi pesanan dan ringkasan harga. Jadwal dipilih di bottom sheet.
 * Preferensi Wuzzer disembunyikan dulu (komponennya masih ada).
 */
const Checkout = memo((props: any) => {
  const { navigation } = props;
  const { top, bottom } = useSafeAreaInsets();
  const [date, setDate] = useState(todayKey);
  const [timing, setTiming] = useState<OrderTiming>('instant');
  const [slotId, setSlotId] = useState<string | null>(null);
  const [method, setMethod] = useState<OrderMethod>('delivery');
  const scheduleSheetRef = useRef<BottomSheetModal>(null);
  // Tapping Instan just switches. Tapping Jadwalkan switches and opens the sheet
  // that picks the day and window; tapping it again reopens it to change them.
  const handleTimingChange = useCallback((next: OrderTiming) => {
    setTiming(next);
    if (next === 'scheduled') {
      scheduleSheetRef.current?.present();
    }
  }, []);
  const methodSheetRef = useRef<BottomSheetModal>(null);
  const handleChangeMethodPress = useCallback(() => {
    methodSheetRef.current?.present();
  }, []);
  const [footerHeight, setFooterHeight] = useState(0);
  const { items, total, clear } = useOrderDraft();
  const { defaultAddress } = useDeliveryAddress();
  const isPickup = method === 'pickup';
  const place = defaultAddress
    ? { lat: defaultAddress.lat, lng: defaultAddress.lng }
    : null;

  // Pickup uses the outlet nearest the address: no choosing, so no list to
  // open. Asked only when pickup is on and there is an address to measure from.
  const nearest = useFetchOutlets(
    { lat: defaultAddress?.lat, long: defaultAddress?.lng, num: 1 },
    { enabled: isPickup && defaultAddress != null },
  );
  const nearestOutlet = nearest.data?.outlets?.[0];
  const pickupDetail = !isPickup
    ? undefined
    : !defaultAddress
    ? 'Pilih alamat dulu untuk mencari outlet terdekat'
    : nearest.isLoading
    ? 'Mencari outlet terdekat…'
    : nearest.isError
    ? 'Outlet terdekat tidak bisa dimuat'
    : nearestOutlet
    ? `Outlet terdekat: ${nearestOutlet.name}${
        nearestOutlet.distance_in_km != null
          ? ` · ${nearestOutlet.distance_in_km.toFixed(1).replace('.', ',')} km`
          : ''
      }`
    : 'Belum ada outlet di dekat alamatmu';

  // Asks first: it empties the whole order, and there is no undo.
  const handleClearAll = useCallback(() => {
    Alert.alert(
      'Hapus semua pesanan?',
      'Semua layanan yang sudah kamu pilih akan dikeluarkan dari pesanan ini.',
      [
        { text: 'Batal', style: 'cancel' },
        { text: 'Hapus', style: 'destructive', onPress: clear },
      ],
    );
  }, [clear]);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Picking another day clears the window: it may not exist on that day (today's
  // earlier windows are gone), and a stale choice would book the wrong time.
  const handleSelectDate = useCallback((next: string) => {
    setDate(next);
    setSlotId(null);
  }, []);

  const handleFooterLayout = useCallback((e: LayoutChangeEvent) => {
    setFooterHeight(e.nativeEvent.layout.height);
  }, []);

  const bandHeight =
    top + theme.spacing.standard + BACK_HEIGHT + MAP_BELOW_BACK;
  // Kept on the UI thread: a state variable would re-render the page on every
  // scroll frame to resize one map.
  const scrollY = useSharedValue(0);
  const handleScroll = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const stretchyStyle = useStretchyBannerStyle({ scrollY, height: bandHeight });

  // Instan adds its own fee; Jadwalkan is free. Same rule: only with an order.
  const timingFee =
    items.length > 0
      ? ORDER_TIMING_OPTIONS.find(o => o.value === timing)?.fee ?? 0
      : 0;
  const isInstant = timing === 'instant';
  const grandTotal = total + timingFee;

  const slot = PICKUP_SLOTS.find(s => s.id === slotId);
  const missing =
    items.length === 0
      ? 'Pilih layanan dulu.'
      : !defaultAddress
      ? 'Pilih alamat dulu.'
      : isPickup && !nearestOutlet
      ? 'Belum ada outlet terdekat.'
      : !isInstant && !slot
      ? 'Pilih jam jemput dulu.'
      : undefined;

  return (
    <VStack
      fill
      style={styles.flex}
      backgroundColor={theme.pallate.neutral['01']}
    >
      <CheckoutHeader onBackPress={handleBackPress} topInset={top} />
      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        // Otherwise iOS adds its own safe-area inset and the page rests scrolled.
        contentInsetAdjustmentBehavior="never"
        style={styles.flex}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Stretches on a pull-down, the way the Home banner does, so there is no
            blank strip above the map. A transform, not a height: the map's own
            box never moves. */}
        <Animated.View style={stretchyStyle}>
          <OrderMapBand
            height={bandHeight}
            place={place}
            emptyLabel="Alamat belum dipilih"
          />
        </Animated.View>
        {/* How the order is collected: a black card riding up over the map, with
            room left at its bottom for the address card that overlaps it. */}
        <MethodCard
          value={method}
          detail={pickupDetail}
          timing={timing}
          onTimingChange={handleTimingChange}
          scheduleSummary={describeSchedule(date, slotId)}
          onChangePress={handleChangeMethodPress}
          bottomClearance={
            SHEET_OVERLAP + ADDRESS_HALF + theme.spacing.standard + STICKER_LIFT
          }
        />
        {/* Half over the black card, half over the sheet, so it belongs to both. In
            the flow with negative margins rather than positioned: a child outside
            its parent's bounds gets clipped inside a ScrollView on Android. */}
        <View
          style={{
            marginTop: -(SHEET_OVERLAP + ADDRESS_HALF),
            marginBottom: -ADDRESS_HALF,
          }}
        >
          <OrderAddressCard
            label={isPickup ? 'Alamat Pickup' : 'Antar & Jemput Ke'}
          />
        </View>
        <View
          style={[
            styles.sheet,
            {
              paddingTop: ADDRESS_HALF + theme.spacing.large,
              // Clears the floating pay bar and the gap it floats at.
              paddingBottom:
                bottom +
                theme.spacing.standard +
                footerHeight +
                theme.spacing.large,
            },
          ]}
        >
          <Section
            title="Detail Pemesanan"
            action={
              items.length > 0 ? (
                <Button
                  rounded
                  size="sm"
                  variant="dark"
                  direction="row"
                  gap={theme.spacing.small}
                  onPress={handleClearAll}
                >
                  <Trash
                    size={16}
                    variant="Bold"
                    color={theme.pallate.neutral['01']}
                  />
                  <Text
                    type="l1"
                    weight="semibold"
                    color={theme.pallate.neutral['01']}
                  >
                    Hapus Semua
                  </Text>
                </Button>
              ) : undefined
            }
          >
            <PurchaseListSection />
          </Section>
          {items.length > 0 && (
            <Section title="Ringkasan Pembayaran">
              <VStack
                gap={theme.spacing.standard}
                padding={{ paddingVertical: theme.spacing.medium }}
              >
                <SummaryRow
                  label="Subtotal (estimasi)"
                  value={formatPriceRupiah(total)}
                />
                {timingFee > 0 ? (
                  <SummaryRow
                    label="Layanan Instan"
                    value={`+${formatPriceRupiah(timingFee)}`}
                  />
                ) : null}
                <SummaryRow
                  label="Total"
                  value={formatPriceRupiah(grandTotal)}
                  bold
                />
              </VStack>
            </Section>
          )}
        </View>
      </Animated.ScrollView>
      <ScheduleSheet
        modalRef={scheduleSheetRef}
        title={isPickup ? 'Jadwal Ambil di Outlet' : 'Jadwal Jemput'}
        date={date}
        slotId={slotId}
        onSelectDate={handleSelectDate}
        onSelectSlot={setSlotId}
      />
      <MethodSheet
        modalRef={methodSheetRef}
        value={method}
        onSelect={setMethod}
      />
      <CheckoutFooter
        totalLabel={formatPriceRupiah(grandTotal)}
        caption={
          items.length > 0
            ? `${items.length} layanan${
                isInstant ? ' · Instan' : slot ? ` · ${slot.label}` : ''
              }`
            : undefined
        }
        disabled
        hint={
          missing ?? 'Pemesanan belum tersedia, endpoint pesanan belum dibuat.'
        }
        onLayout={handleFooterLayout}
      />
    </VStack>
  );
});

export default Checkout;
