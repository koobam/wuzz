import { BannerTestingApp } from '@assets/index';
import { theme, VStack } from '@components/atoms';
import {
  AddAddressFooter,
  AddressBanner,
  AddressCollapsibleHeader,
  DeliveryAddressCard,
  useAddressHeaderScroll,
  useDeliveryAddress,
  useStretchyBannerStyle,
} from '@features/(account)/delivery-address';
import { RootStackParamList } from '@navigation/root/root.types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { memo, useCallback } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type DeliveryAddressListProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const DeliveryAddressList = memo(
  ({ navigation }: DeliveryAddressListProps) => {
    const { width } = useWindowDimensions();
    const { top } = useSafeAreaInsets();
    const { addresses, removeAddress, setDefaultAddress } = useDeliveryAddress();

    const {
      scrollY,
      scrollHandler,
      headerBackgroundStyle,
      headerPositionStyle,
    } = useAddressHeaderScroll({ safeAreaTop: top });
    const stretchyBannerStyle = useStretchyBannerStyle({
      scrollY,
      width,
      baseHeight: 200,
    });

    const handleBack = useCallback(() => navigation.goBack(), [navigation]);
    const handleAdd = useCallback(
      () => navigation.navigate('addaddress'),
      [navigation],
    );

    return (
      <VStack fill>
        <AddressCollapsibleHeader
          title="Alamat Pengiriman"
          onBackPress={handleBack}
          style={[headerPositionStyle, headerBackgroundStyle]}
        />
        <Animated.ScrollView
          style={styles.scrollFill}
          contentContainerStyle={styles.contentContainer}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          bounces
        >
          <AddressBanner style={stretchyBannerStyle} imageUri={BannerTestingApp} />
          <VStack
            padding={{ paddingHorizontal: theme.spacing.large }}
            gap={theme.spacing.standard}
          >
            {/* Konten: kartu alamat */}
            {addresses.map(address => (
              <DeliveryAddressCard
                key={address.id}
                address={address}
                onSetDefault={setDefaultAddress}
                onRemove={removeAddress}
              />
            ))}
          </VStack>
        </Animated.ScrollView>

        <AddAddressFooter onPress={handleAdd} />
      </VStack>
    );
  },
);

DeliveryAddressList.displayName = 'DeliveryAddressList';

const styles = StyleSheet.create({
  scrollFill: { flex: 1 },
  contentContainer: {
    paddingBottom: theme.spacing.large,
  },
});

export default DeliveryAddressList;
