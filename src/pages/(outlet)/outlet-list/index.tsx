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
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Mapbox, { Camera, MapView, UserLocation } from '@rnmapbox/maps';
import { ArrowDown2, Location, Setting4 } from 'iconsax-react-native';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconChevronLeft } from 'tabler-icons-react-native';

const OutletList = memo((props: any) => {
  const { navigation } = props;
  const { top, bottom } = useSafeAreaInsets();
  const { height } = Dimensions.get('window');
  const bottomSheetRatio = 0.75;
  const bottomSheetHeight = height * bottomSheetRatio - (bottom + top);

  const { outletList, mapMarkers, mapBounds } = useOutletListData();
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
          <Setting4
            variant="Linear"
            size={24}
            color={theme.pallate.neutral['05']}
          />
          <Text type="b2" weight="semibold" color={theme.pallate.neutral['05']}>
            Filter
          </Text>
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
          bounds={{
            ne: [mapBounds.maxLng, mapBounds.maxLat],
            sw: [mapBounds.minLng, mapBounds.minLat],
          }}
          animationDuration={800}
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
      <Pressable
        self="center"
        position={{
          bottom: bottomSheetHeight + theme.spacing.standard * 2,
        }}
        padding={{
          paddingVertical: theme.spacing.standard,
          paddingHorizontal: theme.spacing.medium,
        }}
        items="center"
        spacing={theme.spacing.small}
        borderRadius={999}
        backgroundColor={theme.pallate.neutral['01']}
      >
        <Location
          size={20}
          variant="Bulk"
          color={theme.pallate.primary['03']}
        />
        <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
          Nearby Outlet
        </Text>
        <ArrowDown2 size={12} color={theme.pallate.neutral['05']} />
      </Pressable>
      <BottomSheet
        animationConfigs={{
          stiffness: 120,
          damping: 20,
          mass: 1,
          overshootClamping: false,
        }}
        topInset={top + theme.spacing.standard + 60}
        snapPoints={['75%', '100%']}
        handleIndicatorStyle={{
          backgroundColor: theme.pallate.neutral['03'],
          height: 7,
          width: 38,
        }}
        enableDynamicSizing={false}
      >
        <BottomSheetFlatList<OutletListItem>
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
