import {
  Button,
  Flex,
  HStack,
  Input,
  Pressable,
  PressableAnimated,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import {
  AddressLabelRow,
  LocationPickerPin,
  useDeliveryAddress,
  type AddressLabelType,
} from '@features/(account)/delivery-address';
import {
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { RootStackParamList } from '@navigation/root/root.types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Mapbox, { Camera, MapView } from '@rnmapbox/maps';
import { Gps, Location, Map, Map1, SearchNormal1, TickCircle } from 'iconsax-react-native';
import { useCurrentLocation } from '@hooks/utils';
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
} from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconChevronLeft } from 'tabler-icons-react-native';

type AddAddressProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

// Titik awal peta (Jakarta) — nanti bisa diganti lokasi user.
const DEFAULT_CENTER: [number, number] = [106.8272, -6.1754];
// Token sama dengan yang dipakai peta (App.tsx) untuk reverse-geocoding.
const MAPBOX_TOKEN =
  'pk.eyJ1Ijoia29vYmFtIiwiYSI6ImNtZWxtajNncjBmeWMyd3FyM3V3NzUwMzUifQ.eusnZIscj38jvv9zmm1tHA';

const AddAddress = memo(({ navigation }: AddAddressProps) => {
  const { top, bottom } = useSafeAreaInsets();
  const { addAddress } = useDeliveryAddress();
  const { coords: currentCoords } = useCurrentLocation();
  const detailsRef = useRef<BottomSheetModal>(null);
  const cameraRef = useRef<ComponentRef<typeof Camera>>(null);

  const [coords, setCoords] = useState<{ lng: number; lat: number }>({
    lng: DEFAULT_CENTER[0],
    lat: DEFAULT_CENTER[1],
  });
  const [addressLine, setAddressLine] = useState('');
  const [geocoding, setGeocoding] = useState(false);
  // Tooltip + animasi hanya sebelum peta pertama kali digeser.
  const [moved, setMoved] = useState(false);
  const readyRef = useRef(false);
  // Pin terangkat selama peta digeser; turun setelah settle (dengan debounce
  // supaya gerakan sebentar-lalu-gerak-lagi tidak bikin naik-turun flicker).
  const [dragging, setDragging] = useState(false);
  const dropTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (dropTimer.current) clearTimeout(dropTimer.current);
    },
    [],
  );

  // Form detail
  const [labelType, setLabelType] = useState<AddressLabelType>('home');
  const [label, setLabel] = useState('Rumah');
  const [address, setAddress] = useState('');
  const [detail, setDetail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  // Prefill kolom alamat di form dengan hasil geocode.
  useEffect(() => {
    setAddress(addressLine);
  }, [addressLine]);

  const reverseGeocode = useCallback(async (lng: number, lat: number) => {
    setGeocoding(true);
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}&language=id&limit=1`,
      );
      const json = await res.json();
      const place = json?.features?.[0]?.place_name as string | undefined;
      setAddressLine(place ?? `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } catch {
      setAddressLine(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    } finally {
      setGeocoding(false);
    }
  }, []);

  // Pin di tengah: baca center peta saat berhenti digeser + reverse-geocode.
  const handleMapIdle = useCallback(
    (state: Mapbox.MapState) => {
      const center = state?.properties?.center;
      if (!center) return;
      // Idle pertama = load awal (bukan geseran user). Idle berikutnya = sudah digeser.
      if (readyRef.current) setMoved(true);
      else readyRef.current = true;
      setCoords({ lng: center[0], lat: center[1] });
      reverseGeocode(center[0], center[1]);
      // Debounce turunkan pin: kalau digeser lagi dalam jeda ini, dibatalkan.
      if (dropTimer.current) clearTimeout(dropTimer.current);
      dropTimer.current = setTimeout(() => setDragging(false), 350);
    },
    [reverseGeocode],
  );

  // Mulai geser: sembunyikan tooltip + angkat pin (batalkan jadwal turun).
  const handleCameraChanged = useCallback(() => {
    if (!readyRef.current) return;
    if (dropTimer.current) {
      clearTimeout(dropTimer.current);
      dropTimer.current = null;
    }
    setMoved(true);
    setDragging(true);
  }, []);

  const handleSelectLabel = useCallback(
    (type: AddressLabelType, optionLabel: string) => {
      setLabelType(type);
      setLabel(optionLabel);
    },
    [],
  );

  const handleConfirm = useCallback(() => {
    detailsRef.current?.present();
  }, []);

  const handleGoToCurrentLocation = useCallback(() => {
    if (!currentCoords) return;
    cameraRef.current?.setCamera({
      centerCoordinate: [currentCoords.long, currentCoords.lat],
      zoomLevel: 16,
      animationDuration: 600,
    });
  }, [currentCoords]);

  // Init kamera ke lokasi device begitu tersedia (sekali). Settle-nya diperlakukan
  // sebagai posisi awal (readyRef=false) → bukan geseran user, tooltip tetap muncul.
  const didInitLocationRef = useRef(false);
  useEffect(() => {
    if (didInitLocationRef.current || !currentCoords) return;
    didInitLocationRef.current = true;
    readyRef.current = false;
    cameraRef.current?.setCamera({
      centerCoordinate: [currentCoords.long, currentCoords.lat],
      zoomLevel: 16,
      animationDuration: 0,
    });
  }, [currentCoords]);

  // --- Search: search bar SENDIRI yang morph jadi card, bertahap ---
  //  fase A [0,0.4]  : arrow hilang + search melebar ke kiri (width/left)
  //  fase B [0.4,0.8]: search melebar ke bawah (height) → jadi card
  //  fase C [0.7,1]  : blur overlay fade-in

  return (
    <VStack fill>
      {/* Overlay atas: tombol back + baris (search | ke lokasi saat ini) */}
      <HStack
        position={{ top, left: 0, right: 0 }}
        zIndex={2}
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingTop: theme.spacing.small,
        }}
        items="center"
        justify="space-between"
        gap={theme.spacing.standard}
      >
        <Pressable
          onPress={() => navigation.goBack()}
          width={60}
          height={60}
          items="center"
          justify="center"
          gap={theme.spacing.small}
          borderRadius={999}
          backgroundColor={theme.pallate.neutral['01']}
        >
          <IconChevronLeft size={24} color={theme.pallate.neutral['05']} />
        </Pressable>
        <PressableAnimated
          fill
          height={60}
          padding={{
            paddingHorizontal: theme.spacing.large,
          }}
          items="center"
          gap={theme.spacing.standard}
          borderRadius={999}
          backgroundColor={theme.pallate.neutral['01']}
        >
          <SearchNormal1 size={24} color={theme.pallate.neutral['05']} />
          <Text type="b2" color={theme.pallate.neutral['05']}>
            Start your search here
          </Text>
        </PressableAnimated>
      </HStack>

      {/* Peta full-screen */}
      <VStack fill>
        <MapView
          style={styles.map}
          styleURL={Mapbox.StyleURL.Street}
          scaleBarEnabled={false}
          logoEnabled={false}
          attributionEnabled={false}
          compassEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          onCameraChanged={handleCameraChanged}
          onMapIdle={handleMapIdle}
        >
          <Camera
            ref={cameraRef}
            defaultSettings={{ centerCoordinate: DEFAULT_CENTER, zoomLevel: 15 }}
          />
        </MapView>
        {/* Card atas: judul + alamat */}
        <VStack  width="85%"
          self="center"
          position={{
            bottom: 10,
          }}>
          {/* Search + Move Curr Location */}
          <HStack
            fill
            items="center"
            justify="space-between"
            gap={theme.spacing.standard}
            margin={{ marginBottom: theme.spacing.standard }}
          >
            <Pressable
              onPress={handleGoToCurrentLocation}
              items="center"
              justify="center"
              padding={theme.spacing.standard}
              borderRadius={999}
              borderWidth={1}
              borderColor={theme.pallate.neutral['03']}
              backgroundColor={theme.pallate.neutral['01']}
            >
              <Gps size={32} variant="Bulk" color={theme.pallate.primary['03']} />
            </Pressable>
            <Pressable
              onPress={handleGoToCurrentLocation}
              items="center"
              justify="center"
              height={60}
              width={60}
              borderRadius={999}
              borderWidth={1}
              borderColor={theme.pallate.neutral['03']}
              backgroundColor={theme.pallate.neutral['01']}
            >
              <Gps size={32} variant="Bulk" color={theme.pallate.neutral['05']} />
            </Pressable>
          </HStack>

        <VStack
          padding={theme.spacing.large}
          gap={theme.spacing.standard}
          fill
          borderWidth={1}
          zIndex={1}
          borderColor={theme.pallate.neutral['03']}
          borderRadius={theme.spacing.large}
          backgroundColor={theme.pallate.neutral['01']}
        >
          <HStack items="center" gap={theme.spacing.standard}>
            <Flex
              items="center"
              justify="center"
              width={44}
              height={44}
              borderRadius={theme.spacing.standard}
              backgroundColor={theme.pallate.primary['01']}
            >
              <Location
                size={24}
                variant="Bulk"
                color={theme.pallate.primary['03']}
              />
            </Flex>
            <VStack fill>
              <Text type="l2" weight="medium" color={theme.pallate.neutral['04']}>
                Alamat terpilih
              </Text>
              <Text fill type="b2" numberOfLines={2} color={theme.pallate.neutral['05']}>
                {geocoding
                  ? 'Menentukan alamat…'
                  : addressLine || 'Geser peta untuk memilih lokasi'}
              </Text>
            </VStack>
          </HStack>
        </VStack>
        </VStack>
      </VStack>
      {/* Marker custom: titik kecil di-center tepat di pusat layar (= pusat peta) */}
      <View pointerEvents="none" style={styles.pinOverlay}>
        <LocationPickerPin active={!moved} lifted={dragging} />
      </View>

      {/* Kartu konfirmasi mengambang di bawah (jarak large kiri/kanan + bawah) */}
      <VStack
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingTop: theme.spacing.large * 3,
          paddingBottom: theme.spacing.large
        }}
        margin={{ marginTop: -theme.spacing.large * 2.6 }}
        borderRadius={{
          borderTopLeftRadius: theme.spacing.large * 2,
          borderTopRightRadius: theme.spacing.large * 2,
        }}
        borderWidth={{
          borderLeftWidth:1,
          borderRightWidth:1,
          borderTopWidth:1
        }}
        borderColor={theme.pallate.neutral['03']}
        backgroundColor={theme.pallate.neutral['01']}
      >
        {/* View bawah: tombol — radius atas besar, overlap ke card di atasnya */}
        <Button variant="primary" size="lg" rounded onPress={handleConfirm}>
          <Text type="b2" weight="semibold" color={theme.pallate.neutral['01']}>
            Konfirmasi & Tambah Detail
          </Text>
        </Button>
      </VStack>
    </VStack>
  );
});

AddAddress.displayName = 'AddAddress';

const styles = StyleSheet.create({
  flex: { flex: 1 },
  map: { flex: 1 },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  searchBox: {
    flex: 1,
  },
  divider: {
    alignSelf: 'stretch',
    height: 1,
    backgroundColor: theme.pallate.neutral['02'],
    marginVertical: theme.spacing.small,
  },
  searchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  morphCard: {
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: theme.pallate.neutral['01'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  // Muka search bar di dalam card (fade out di awal) — tinggi = tinggi bar awal.
  morphFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: theme.spacing.standard,
    paddingHorizontal: theme.spacing.large,
  },
  // Isi card (fade in) — fill dari atas.
  morphContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.large,
    rowGap: theme.spacing.standard,
  },
  searchResults: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    rowGap: theme.spacing.small,
  },
  pinOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  handleIndicator: {
    backgroundColor: theme.pallate.neutral['03'],
    height: 5,
    width: 38,
  },
  form: {
    padding: theme.spacing.large,
    gap: theme.spacing.standard,
  },
});

export default AddAddress;
