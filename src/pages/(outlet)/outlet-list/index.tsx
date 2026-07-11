import {
  Divider,
  HStack,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import {
  getOutletTags,
  OutletListCard,
  OutletListCardSkeleton,
  OutletMapMarker,
  useOutletListData,
} from '@features/(outlet)/outlet-list';
import type { OutletListItem } from '@features/(outlet)/outlet-list';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Mapbox, { Camera, MapView, UserLocation } from '@rnmapbox/maps';
import { useSelectedOutlet } from '@services/contexts';
import { useCurrentLocation } from '@hooks/utils';
import { ArrowDown2, Location, Setting4 } from 'iconsax-react-native';
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
} from 'react';
import { Dimensions } from 'react-native';
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconChevronLeft } from 'tabler-icons-react-native';

// Snap points sheet (fraksi tinggi layar), urut dari paling rendah. Makin rendah
// sheet-nya, makin luas map yang terlihat → kamera re-fit & zoom bertambah.
const SNAP_RATIOS = [0.1, 0.4, 1];

/** Jumlah kartu skeleton saat daftar outlet masih loading. */
const SKELETON_KEYS = ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5'];

/** Zoom mode fokus (outlet terpilih) mengikuti posisi sheet: sheet turun
 *  (padding kecil) → zoom in, sheet naik (padding besar) → zoom out. */
const FOCUS_ZOOM_MAX = 15; // sheet paling bawah
const FOCUS_ZOOM_MIN = 13; // sheet naik

const OutletList = memo((props: any) => {
  const { navigation } = props;
  const { top, bottom } = useSafeAreaInsets();
  const { height } = Dimensions.get('window');
  const snapPoints = useMemo(
    () => SNAP_RATIOS.map((r) => `${Math.round(r * 100)}%`),
    [],
  );
  // Index snap aktif; dipakai sebagai nilai padding kamera saat settle & initial.
  const [sheetIndex, setSheetIndex] = useState(1);
  // Kamera cuma bereaksi antara index 0 (40%) & index 1 (75%). Di index 1 ke atas
  // (menuju 100%) padding dikunci di padMax → map berhenti berubah.
  const padMin = height * SNAP_RATIOS[0]; // padding di index 0 (paling rendah)
  const padMax = height * SNAP_RATIOS[1]; // padding di index 1 (batas atas kamera)
  const bottomSheetHeight = sheetIndex >= 1 ? padMax : padMin;

  const { coords, isLoading: isLoadingLocation } = useCurrentLocation();
  const { outletList, mapMarkers, mapBounds, isLoading } = useOutletListData(
    coords,
    { enabled: !isLoadingLocation },
  );

  // Real-time: ikuti index sheet tiap frame (bukan cuma pas settle). `sheetAnimatedIndex`
  // interpolasi kontinu: 0 = 40%, 1 = 75%, 2 = 100%. Di-clamp ke [0,1] supaya di atas
  // index 1 kamera beku. Pakai index (bukan posisi piksel) biar akurat & bebas topInset.
  const cameraRef = useRef<ComponentRef<typeof Camera>>(null);
  const sheetAnimatedIndex = useSharedValue(1);
  const lastPaddingBottom = useSharedValue(-1);
  // Target fokus kamera (outlet yang di-tap). Null = fit-all bounds. Diupdate tiap
  // render, dibaca applyCameraPadding (worklet path) supaya saat sheet digeser,
  // outlet terfokus tetap di tengah — bukan balik ke fit-all.
  const focusTargetRef = useRef<{ lng: number; lat: number } | null>(null);
  const bottomSheetHeightRef = useRef(bottomSheetHeight);
  bottomSheetHeightRef.current = bottomSheetHeight;

  // Zoom mode fokus dari padding sheet: padding kecil (sheet turun) → zoom in.
  const computeFocusZoom = useCallback(
    (paddingBottom: number) => {
      const range = padMax - padMin;
      const ratio =
        range > 0
          ? Math.min(Math.max((paddingBottom - padMin) / range, 0), 1)
          : 0;
      return FOCUS_ZOOM_MAX - ratio * (FOCUS_ZOOM_MAX - FOCUS_ZOOM_MIN);
    },
    [padMin, padMax],
  );

  const applyCameraPadding = useCallback(
    (paddingBottom: number) => {
      const padding = {
        paddingBottom,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
      };
      const target = focusTargetRef.current;
      if (target) {
        // Fokus: cuma ubah zoom + padding, TANPA centerCoordinate → biar pan
        // manual user tidak ketimpa balik ke marker saat sheet digeser.
        cameraRef.current?.setCamera({
          zoomLevel: computeFocusZoom(paddingBottom),
          padding,
          animationDuration: 0,
        });
        return;
      }
      cameraRef.current?.setCamera({
        bounds: {
          ne: [mapBounds.maxLng, mapBounds.maxLat],
          sw: [mapBounds.minLng, mapBounds.minLat],
        },
        padding,
        animationDuration: 0,
      });
    },
    [mapBounds, computeFocusZoom],
  );

  useAnimatedReaction(
    () => sheetAnimatedIndex.value,
    (idx) => {
      // clamp 0..1 → di atas index 1 (menuju 100%) kamera beku di padMax.
      const t = Math.min(Math.max(idx, 0), 1);
      const paddingBottom = padMin + (padMax - padMin) * t;
      // throttle ~2px biar nggak flooding thread JS tiap sub-piksel
      if (Math.abs(paddingBottom - lastPaddingBottom.value) < 2) return;
      lastPaddingBottom.value = paddingBottom;
      runOnJS(applyCameraPadding)(paddingBottom);
    },
    [applyCameraPadding, padMin, padMax],
  );
  // Sumber kebenaran selection = context global (di-init dari nearest, diubah
  // saat pilih dari daftar).
  const { selectedOutlet, setSelectedOutlet } = useSelectedOutlet();
  const selectedOutletId = selectedOutlet?.id ?? null;

  // Kamera fokus mengikuti outlet terpilih (selectedOutletId). Kalau tidak ada
  // yang terpilih → null → kamera fit-all bounds.
  const selectedMarker = useMemo(
    () => mapMarkers.find((m) => m.id === selectedOutletId) ?? null,
    [mapMarkers, selectedOutletId],
  );
  focusTargetRef.current = selectedMarker
    ? { lng: selectedMarker.lng, lat: selectedMarker.lat }
    : null;

  // Kamera terbang ke outlet HANYA saat seleksi berubah (bukan tiap sheet
  // bergerak) → pan manual user tidak ketimpa. Pakai id sebagai key.
  const selectedMarkerId = selectedMarker?.id ?? null;
  useEffect(() => {
    if (!selectedMarker) return;
    cameraRef.current?.setCamera({
      centerCoordinate: [selectedMarker.lng, selectedMarker.lat],
      zoomLevel: computeFocusZoom(bottomSheetHeightRef.current),
      padding: {
        paddingBottom: bottomSheetHeightRef.current,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 0,
      },
      animationDuration: 500,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarkerId]);

  // Render marker terpilih paling akhir → tampil paling atas & tidak ketutup marker
  // lain (dipadu allowOverlap agar tidak disembunyikan collision detection Mapbox).
  const orderedMarkers = useMemo(() => {
    if (selectedMarker == null) return mapMarkers;
    return [
      ...mapMarkers.filter((m) => m.id !== selectedMarker.id),
      selectedMarker,
    ];
  }, [mapMarkers, selectedMarker]);

  const listContentStyle = useMemo(
    () => ({
      paddingBottom: bottom + theme.spacing.standard,
    }),
    [bottom],
  );

  const handleOutletPress = useCallback((item: OutletListItem) => {
    setSelectedOutlet(item);
    // TODO: navigate to outlet detail or expand map to outlet
    navigation.pop();
  }, [navigation, setSelectedOutlet]);

  const renderOutletItem = useCallback(
    ({ item }: { item: OutletListItem }) => (
      <OutletListCard
        name={item.name}
        address={item.address}
        distanceKm={item.distance_in_km}
        services={item.services}
        photos={item.photos}
        tags={getOutletTags(item)}
        isSelected={selectedOutletId === item.id}
        onPress={() => handleOutletPress(item)}
      />
    ),
    [handleOutletPress, selectedOutletId],
  );

  const itemSeparator = useCallback(
    () => <Divider thickness={theme.spacing.standard} />,
    [],
  );

  // Saat loading (list masih kosong), FlatList menampilkan skeleton lewat
  // ListEmptyComponent.
  const listEmptyComponent = useMemo(
    () =>
      isLoading ? (
        <VStack spacing={theme.spacing.standard}>
          {SKELETON_KEYS.map((key) => (
            <OutletListCardSkeleton key={key} />
          ))}
        </VStack>
      ) : null,
    [isLoading],
  );

  return (
    <VStack fill>
      <HStack
        position={{
          top,
          left: 0,
          right: 0,
        }}
        zIndex={1}
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingTop: theme.spacing.small,
        }}
        gap={theme.spacing.standard}
        justify="space-between"
      >
        <Pressable
          onPress={() => navigation.goBack()}
          padding={{
            paddingVertical: theme.spacing.standard,
            paddingHorizontal: theme.spacing.medium,
          }}
          items="center"
          spacing={theme.spacing.small}
          borderRadius={999}
          backgroundColor={theme.pallate.neutral['01']}
        >
          <IconChevronLeft
            size={24}
            color={theme.pallate.neutral['05']}
          />
          <Text type="b2" weight="semibold" color={theme.pallate.neutral['05']}>
            Back
          </Text>
        </Pressable>
       
      <Pressable
        onPress={() => navigation.navigate('deliveryaddress')}
        padding={{
          paddingVertical: theme.spacing.standard,
          paddingHorizontal: theme.spacing.medium,
        }}
        fill
        items="center"
        spacing={theme.spacing.standard}
        borderRadius={999}
        backgroundColor={theme.pallate.neutral['01']}
      >
        <Location
          size={20}
          variant="Bulk"
          color={theme.pallate.primary['03']}
        />
        <VStack fill>
        <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
          Nearby Outlet
        </Text>
        <Text type="l2" numberOfLines={1} color={theme.pallate.neutral['05']}>
          Tangerang Selatan, Banten
        </Text>
        </VStack>
        <ArrowDown2 size={14} color={theme.pallate.neutral['05']} />
      </Pressable>
      </HStack>
      <MapView
        style={{
          flex: 1,
        }}
        styleURL={Mapbox.StyleURL.Outdoors}
        scrollEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        scaleBarEnabled={false}
        logoEnabled={false}
      >
        {/* Show a route polyline on the map */}
        <Camera
          ref={cameraRef}
          {...(selectedMarker
            ? {}
            : {
                bounds: {
                  ne: [mapBounds.maxLng, mapBounds.maxLat],
                  sw: [mapBounds.minLng, mapBounds.minLat],
                },
              })}
          animationDuration={300}
          animationMode="easeTo"
          followPadding={{
            paddingBottom: bottomSheetHeight,
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
          }}
          padding={{
            paddingBottom: bottomSheetHeight,
            paddingLeft: 0,
            paddingRight: 0,
            paddingTop: 0,
          }}
        />
        <UserLocation />

        {orderedMarkers.map((marker) => (
          <Mapbox.MarkerView
            key={`marker-${marker.id}`}
            id={`marker-${marker.id}`}
            coordinate={[marker.lng, marker.lat]}
            allowOverlap={selectedOutletId === marker.id}
          >
            <OutletMapMarker
              marker={marker}
              isSelected={selectedOutletId === marker.id}
            />
          </Mapbox.MarkerView>
        ))}
      </MapView>
      <BottomSheet
        animationConfigs={{
          stiffness: 120,
          damping: 20,
          mass: 1,
          overshootClamping: true,
        }}
        topInset={top + theme.spacing.standard + 60}
        snapPoints={snapPoints}
        index={1}
        animatedIndex={sheetAnimatedIndex}
        enableOverDrag={false}
        overDragResistanceFactor={0}
        handleIndicatorStyle={{
          backgroundColor: theme.pallate.neutral['03'],
          height: 5,
          width: 38,
        }}
        enableDynamicSizing={false}
      >
        <BottomSheetFlatList
          data={outletList}
          keyExtractor={(item: OutletListItem) => String(item.id)}
          renderItem={renderOutletItem}
          ItemSeparatorComponent={itemSeparator}
          ListEmptyComponent={listEmptyComponent}
          contentContainerStyle={listContentStyle}
          showsVerticalScrollIndicator={false}
        />
      </BottomSheet>
    </VStack>
  );
});

export default OutletList;
