import { Box, Pressable, Text, theme, VStack } from '@components/atoms';
import { useDeliveryAddress } from '@features/(account)/delivery-address';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/root/root.types';
import { Location } from 'iconsax-react-native';
import { IconChevronRight } from 'tabler-icons-react-native';
import { memo } from 'react';
import { StyleSheet } from 'react-native';

/** How far the sticker rides up over the card's top edge, and its tilt. */
export const STICKER_LIFT = 20;
/** A fixed height, not one built from padding and text sizes, so the layout
 *  around the card never depends on how its content happens to measure. */
export const ADDRESS_CARD_HEIGHT = 72;
const STICKER_TILT_DEG = 3;

export interface OrderAddressCardProps {
  /** The sticker lifted off the card's top edge: "Diantar & Jemput Ke". */
  label: string;
}

/**
 * The pickup and drop-off address, as a card riding the edge between the black
 * method card and the white sheet, the way the outlet card does in the Reddog
 * checkout. Tapping it opens the address list. With none chosen it asks for one
 * rather than showing a stand-in.
 */
export const OrderAddressCard = memo(function OrderAddressCard({
  label,
}: OrderAddressCardProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { defaultAddress } = useDeliveryAddress();

  return (
    <Pressable
      onPress={() => navigation.navigate('deliveryaddress')}
      items="center"
      gap={theme.spacing.standard}
      height={ADDRESS_CARD_HEIGHT}
      padding={{ paddingHorizontal: theme.spacing.large }}
      borderRadius={20}
      opacity={0}
      backgroundColor={theme.pallate.neutral['01']}
      style={styles.card}
    >
      {/* The same tilted white sticker as "Metode Pemesanan", riding up off the
          card's top edge. Absolute, so it does not change the card's height. */}
      <Box
        zIndex={3}
        borderRadius={999}
        backgroundColor={theme.pallate.neutral['05']}
        padding={{
          paddingHorizontal: theme.spacing.standard,
          paddingVertical: theme.spacing.tiny,
        }}
        borderWidth={1}
        borderColor={theme.pallate.neutral['01']}
        style={styles.sticker}
      >
        <Text
          type="b2"
          weight="bold"
          color={theme.pallate.neutral['01']}
          text={label}
        />
      </Box>
      <Location
        size={22}
        variant="Bulk"
        color={theme.pallate.secondary['03']}
      />
      <VStack fill>
        {defaultAddress ? (
          <>
            <Text type="l1" weight="semibold" numberOfLines={1}>
              {defaultAddress.label}
            </Text>
            <Text
              type="l1"
              color={theme.pallate.neutral['04']}
              numberOfLines={1}
            >
              {defaultAddress.address}
            </Text>
          </>
        ) : (
          <Text type="b2" weight="bold">
            Pilih alamat
          </Text>
        )}
      </VStack>
      <IconChevronRight size={20} color={theme.pallate.neutral['04']} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  sticker: {
    position: 'absolute',
    top: -STICKER_LIFT,
    left: theme.spacing.standard,
    transform: [{ rotate: `-${STICKER_TILT_DEG}deg` }],
  },
  // A hairline edge, no shadow.
  card: {
    // Above the sheet on Android too, where paint order alone does not decide.
    marginHorizontal: theme.spacing.medium,
    zIndex: 2,
    elevation: 2,
    borderCurve: 'continuous',
    borderWidth: 1,
    borderColor: theme.pallate.neutral['03'],
  },
});
