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
  OutletMapMarker,
  ServiceFilterPills,
  useOutletListData,
} from '@features/(outlet)/outlet-list';
import type { OutletListItem, ServiceFilter } from '@features/(outlet)/outlet-list';
import BottomSheet, { useBottomSheetScrollableCreator } from '@gorhom/bottom-sheet';
import { FlashList } from '@shopify/flash-list';
import Mapbox, { Camera, MapView, UserLocation } from '@rnmapbox/maps';
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
const SNAP_RATIOS = [0.1, 0.52, 1];

const OutletList = memo((props: any) => {
  const { navigation } = props;
  const { top, bottom } = useSafeAreaInsets();
  const { height } = Dimensions.get('window');
  const snapPoints = useMemo(
    () => SNAP_RATIOS.map((r) => `${Math.round(r * 100)}%`),
    [],
  );
  // Wire scroll FlashList v2 ke gesture bottom sheet (pengganti BottomSheetFlashList
  // yang deprecated & bikin scroll nggak jalan). Dipakai sbg renderScrollComponent.
  const renderScrollComponent = useBottomSheetScrollableCreator();
  // Index snap aktif; dipakai sebagai nilai padding kamera saat settle & initial.
  const [sheetIndex, setSheetIndex] = useState(1);
  // Kamera cuma bereaksi antara index 0 (40%) & index 1 (75%). Di index 1 ke atas
  // (menuju 100%) padding dikunci di padMax → map berhenti berubah.
  const padMin = height * SNAP_RATIOS[0]; // padding di index 0 (paling rendah)
  const padMax = height * SNAP_RATIOS[1]; // padding di index 1 (batas atas kamera)
  const bottomSheetHeight = sheetIndex >= 1 ? padMax : padMin;

  const { outletList, mapMarkers, mapBounds } = useOutletListData();

  // Real-time: ikuti index sheet tiap frame (bukan cuma pas settle). `sheetAnimatedIndex`
  // interpolasi kontinu: 0 = 40%, 1 = 75%, 2 = 100%. Di-clamp ke [0,1] supaya di atas
  // index 1 kamera beku. Pakai index (bukan posisi piksel) biar akurat & bebas topInset.
  const cameraRef = useRef<ComponentRef<typeof Camera>>(null);
  const sheetAnimatedIndex = useSharedValue(1);
  const lastPaddingBottom = useSharedValue(-1);

  const applyCameraPadding = useCallback(
    (paddingBottom: number) => {
      cameraRef.current?.setCamera({
        bounds: {
          ne: [mapBounds.maxLng, mapBounds.maxLat],
          sw: [mapBounds.minLng, mapBounds.minLat],
        },
        padding: {
          paddingBottom,
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 0,
        },
        animationDuration: 0,
      });
    },
    [mapBounds],
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
  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>('all');
  const [selectedOutletId, setSelectedOutletId] = useState<number | null>(
    () => outletList[0]?.id ?? null,
  );

  const filteredOutlets = useMemo(() => {
    if (serviceFilter === 'all') return outletList;
    return outletList.filter((o) => o.services.includes(serviceFilter));
  }, [outletList, serviceFilter]);

  useEffect(() => {
    const isSelectedInList = filteredOutlets.some((o) => o.id === selectedOutletId);
    if (!isSelectedInList && filteredOutlets.length > 0) {
      setSelectedOutletId(filteredOutlets[0].id);
    }
  }, [filteredOutlets, selectedOutletId]);

  const listContentStyle = useMemo(
    () => ({
      paddingBottom: bottom + theme.spacing.standard,
    }),
    [bottom],
  );

  const handleOutletPress = useCallback((id: number) => {
    setSelectedOutletId(id);
    // TODO: navigate to outlet detail or expand map to outlet
    navigation.pop();
  }, [navigation]);

  const renderOutletItem = useCallback(
    ({ item }: { item: OutletListItem }) => (
      <OutletListCard
        name={item.name}
        address={item.address}
        distanceKm={item.distanceKm}
        services={item.services}
        photos={item.photos}
        tags={getOutletTags(item)}
        isSelected={selectedOutletId === item.id}
        onPress={() => handleOutletPress(item.id)}
      />
    ),
    [handleOutletPress, selectedOutletId],
  );

  const itemSeparator = useCallback(
    () => <Divider thickness={theme.spacing.standard} />,
    [],
  );

  const filterHeader = useMemo(
    () => (
      <ServiceFilterPills value={serviceFilter} onChange={setServiceFilter} />
    ),
    [serviceFilter],
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
          bounds={{
            ne: [mapBounds.maxLng, mapBounds.maxLat],
            sw: [mapBounds.minLng, mapBounds.minLat],
          }}
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
        <UserLocation animated={false} />

        {mapMarkers.map((marker) => (
          <Mapbox.MarkerView
            key={`marker-${marker.id}`}
            id={`marker-${marker.id}`}
            coordinate={[marker.lng, marker.lat]}
          >
            <OutletMapMarker marker={marker} />
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
        <FlashList
          renderScrollComponent={renderScrollComponent}
          data={filteredOutlets}
          keyExtractor={(item: OutletListItem) => String(item.id)}
          ListHeaderComponent={filterHeader}
          ItemSeparatorComponent={itemSeparator}
          contentContainerStyle={listContentStyle}
          renderItem={renderOutletItem}
        />
      </BottomSheet>
    </VStack>
  );
});

export default OutletList;
