import {
  Divider,
  HStack,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import { EmptyStatePlaceholder } from '@components/molecules';
import { EmptyOutlet } from '@assets/index';
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
import { memo, useCallback, useMemo, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { IconChevronLeft } from 'tabler-icons-react-native';

const OutletList = memo((props: any) => {
  const { navigation } = props;
  const { t } = useTranslation('outlet');
  const { top, bottom } = useSafeAreaInsets();
  const { height } = Dimensions.get('window');
  const bottomSheetRatio = 0.75;
  const bottomSheetHeight = height * bottomSheetRatio - (bottom + top);

  const [serviceFilter, setServiceFilter] = useState<ServiceFilter>('all');
  const { outletList, mapMarkers, mapBounds, refetch } = useOutletListData(null, serviceFilter);
  const [selectedOutletId, setSelectedOutletId] = useState<number | null>(
    () => outletList[0]?.id ?? null,
  );

  const listContentStyle = useMemo(
    () => ({
      paddingBottom: bottom + theme.spacing.standard,
      flexGrow: 1,
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
          gap={theme.spacing.small}
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
          gap={theme.spacing.small}
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
        style={styles.map}
        styleURL={Mapbox.StyleURL.Outdoors}
        scrollEnabled={true}
        pitchEnabled={false}
        rotateEnabled={false}
        attributionEnabled={false}
        compassEnabled={false}
        scaleBarEnabled={false}
        logoEnabled={false}
      >
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
        gap={theme.spacing.small}
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
        handleIndicatorStyle={styles.bottomSheetIndicator}
        enableDynamicSizing={false}
      >
        <BottomSheetFlatList<OutletListItem>
          data={outletList}
          keyExtractor={(item: OutletListItem) => String(item.id)}
          ListHeaderComponent={filterHeader}
          ListEmptyComponent={
            <EmptyStatePlaceholder
              icon={<EmptyOutlet width={220} height={220} />}
              title={t('list.empty.title')}
              description={t('list.empty.description')}
              primaryButton={{ label: t('list.empty.tryAgain'), onPress: refetch }}
              style={styles.emptyState}
              secondaryButton={{
                label: t('list.empty.coverageArea'),
                onPress: () => {}
              }}
            />
          }
          ItemSeparatorComponent={itemSeparator}
          contentContainerStyle={listContentStyle}
          renderItem={renderOutletItem}
        />
      </BottomSheet>
    </VStack>
  );
});

const styles = StyleSheet.create({
  map: { flex: 1 },
  bottomSheetIndicator: {
    backgroundColor: theme.pallate.neutral['03'],
    height: 7,
    width: 38,
  },
  emptyState: { height: 400, justifyContent: 'center' },
});

export default OutletList;
