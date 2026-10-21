import {
  IllustrationSection,
  OrderRewardsHandleContent,
  OrderStatusBottomSheetContent,
  OrderStatusHeader,
  OrderStatusItemDetailSheetContent,
  OrderStatusMapView,
  shouldShowMap,
  useOrderStatus,
} from '@features/(order)/order-status';
import {
  type OrderSummaryItemDetail,
  DESCRIPTION_SEPARATOR,
} from '@features/(order)/order-status';
import { Box, Button, Divider, HStack, Text, VStack, theme } from '@components/atoms';
import Image from '@components/atoms/image';
import { MenuEmptyPlaceholder } from '@assets/index';
import BottomSheet, {
  BottomSheetFooter,
  BottomSheetHandle,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import type {
  BottomSheetFooterProps,
  BottomSheetHandleProps,
} from '@gorhom/bottom-sheet';
import {
  useRoute,
  useNavigation,
  type RouteProp,
} from '@react-navigation/native';
import type { RootStackParamList } from '@navigation/root/root.types';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

/** Approximate height of OrderStatusHeader (padding + button row + spacing + 2 location cards). */
const ORDER_STATUS_HEADER_HEIGHT =
  theme.spacing.small +
  (theme.spacing.standard * 2 + 24) /* button row */ +
  theme.spacing.medium +
  50 +
  theme.spacing.standard +
  50; /* two location cards */

const DUMMY_IMAGE_URI = MenuEmptyPlaceholder;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  mapFill: {
    flex: 1,
  },
  noMapContent: {
    flex: 1,
  },
});

const detailHandleStyles = StyleSheet.create({
  imageWrap: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 20,
    borderCurve: 'continuous',
  },
  kgBadge: {
    alignSelf: 'flex-start',
  },
});

const OrderStatus = memo(() => {
  const { top, bottom } = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'orderstatus'>>();
  const orderId = route.params?.orderId;
  const { order } = useOrderStatus(orderId);
  const showMap = shouldShowMap(order?.status);
  const mainSheetRef = useRef<React.ElementRef<typeof BottomSheet>>(null);
  const detailSheetRef = useRef<React.ElementRef<typeof BottomSheet>>(null);
  const [detailItem, setDetailItem] = useState<OrderSummaryItemDetail | null>(
    null,
  );

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleBantuanPress = useCallback(() => {
    // TODO: open help / chat / FAQ
  }, []);

  const handleCopyTransactionId = useCallback((_transactionId: string) => {
    // Optional: clipboard or toast
  }, []);

  const handleWuzzerCall = useCallback((_phoneNumber: string) => {
    // TODO: open phone dialer
  }, []);

  const handleWuzzerChat = useCallback((_wuzzerId: string) => {
    // TODO: open chat
  }, []);

  const handleWuzzerRate = useCallback((_wuzzerId: string, _rating: number) => {
    // TODO: submit rating to API
  }, []);

  const handleItemDetailPress = useCallback((item: OrderSummaryItemDetail) => {
    setDetailItem(item);
    mainSheetRef.current?.close();
    setTimeout(() => {
      detailSheetRef.current?.snapToIndex(0);
    }, 150);
  }, []);

  const handleDetailClose = useCallback(() => {
    detailSheetRef.current?.close();
    setDetailItem(null);
    setTimeout(() => {
      mainSheetRef.current?.snapToIndex(0);
    }, 150);
  }, []);

  const bottomSheetSnapPoints = useMemo(() => ['40%', '100%'], []);
  const detailSnapPoints = useMemo(() => ['50%', '100%'], []);
  const mainSheetTopInset = useMemo(
    () => top + ORDER_STATUS_HEADER_HEIGHT + theme.spacing.large * 2,
    [top],
  );

  const renderMainSheetHandle = useCallback(
    (props: BottomSheetHandleProps) =>
      order == null || order.status !== 'completed' ? <BottomSheetHandle {...props} /> : (
        <OrderRewardsHandleContent
          currentTier={order.currentTier ?? 'bronze'}
          nextTierBenefit={order.nextTierBenefit}
          xpBeforeOrder={order.xpBeforeOrder}
          xpToNextTier={order.xpToNextTier}
          xpEarnedFromOrder={order.xpEarnedFromOrder}
        />
      ),
    [order],
  );

  const renderDetailFooter = useCallback(
    (props: BottomSheetFooterProps) => (
      <BottomSheetFooter
        {...props}
        bottomInset={bottom + theme.spacing.large * 2}
      >
        <Button
          variant="default"
          size="md"
          rounded
          margin={{ marginHorizontal: theme.spacing.large }}
          onPress={handleDetailClose}
        >
          <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
            Tutup
          </Text>
        </Button>
      </BottomSheetFooter>
    ),
    [bottom, handleDetailClose],
  );

  /** Service information – shown in the detail sheet handle (summary: image, name, description, kg) */
  const renderDetailHandle = useCallback(
    (props: BottomSheetHandleProps) => {
      const item = detailItem;
      if (item == null) {
        return <BottomSheetHandle {...props} />;
      }
      return (
        <HStack
          margin={{
            marginHorizontal: theme.spacing.large,
            marginTop: -theme.spacing.large * 2,
            marginBottom: -theme.spacing.large,
          }}
          padding={theme.spacing.standard}
          gap={theme.spacing.standard}
          borderWidth={1}
          borderRadius={20}
          borderColor={theme.pallate.neutral['02']}
          items="center"
          backgroundColor={theme.pallate.neutral['01']}
        >
          <Box
            width={80}
            height={80}
            borderRadius={20}
            backgroundColor={theme.pallate.neutral['02']}
            style={detailHandleStyles.imageWrap}
          >
            <Image
              uri={DUMMY_IMAGE_URI}
              resizeMode="cover"
              style={detailHandleStyles.image}
            />
          </Box>
          <VStack fill gap={theme.spacing.tiny}>
            <Text type="b2" weight="medium" color={theme.pallate.neutral['05']}>
              {item.itemsSummary}
            </Text>
            <Text type="l1" color={theme.pallate.neutral['04']}>
              {item.description.join(DESCRIPTION_SEPARATOR)}
            </Text>
          </VStack>
        </HStack>
      );
    },
    [detailItem],
  );

  if (!order) {
    return (
      <VStack fill style={styles.fill}>
        <OrderStatusHeader
          onBackPress={handleBackPress}
          topInset={top}
          onBantuanPress={handleBantuanPress}
        />
      </VStack>
    );
  }

  return (
    <VStack fill style={styles.fill}>
      <OrderStatusHeader
        onBackPress={handleBackPress}
        topInset={top}
        onBantuanPress={handleBantuanPress}
      />
      <VStack fill style={styles.mapFill}>
        {showMap ? (
          <OrderStatusMapView order={order} />
        ) : (
          <IllustrationSection />
        )}
        <BottomSheet
          ref={mainSheetRef}
          animationConfigs={{
            stiffness: 120,
            damping: 20,
            mass: 1,
            overshootClamping: false,
          }}
          topInset={mainSheetTopInset}
          snapPoints={bottomSheetSnapPoints}
          enableDynamicSizing={false}
          style={{
            marginTop: order.status !== 'completed' ? 0 : theme.spacing.large * 2,
          }}
          handleIndicatorStyle={{
            backgroundColor: theme.pallate.neutral['03'],
            height: 7,
            width: 35,
          }}
          handleComponent={renderMainSheetHandle}
        >
          <BottomSheetScrollView
            contentContainerStyle={{
              paddingBottom: bottom + theme.spacing.large,
            }}
          >
            {order.status === 'completed' && (
              <Divider thickness={theme.spacing.large}
              />
            )}
            <OrderStatusBottomSheetContent
              order={order}
              onCopyTransactionId={handleCopyTransactionId}
              onWuzzerCall={handleWuzzerCall}
              onWuzzerChat={handleWuzzerChat}
              onWuzzerRate={handleWuzzerRate}
              onItemDetailPress={handleItemDetailPress}
            />
          </BottomSheetScrollView>
        </BottomSheet>
        <BottomSheet
          ref={detailSheetRef}
          index={-1}
          enablePanDownToClose
          animationConfigs={{
            stiffness: 120,
            damping: 20,
            mass: 1,
            overshootClamping: false,
          }}
          topInset={top + theme.spacing.standard + 140}
          snapPoints={detailSnapPoints}
          enableDynamicSizing={false}
          style={{
            marginTop: theme.spacing.large * 2,
          }}
          footerComponent={renderDetailFooter}
          handleComponent={renderDetailHandle}
          onClose={handleDetailClose}
        >
          <BottomSheetScrollView
            contentContainerStyle={{
              paddingTop: theme.spacing.large + theme.spacing.standard,
              paddingBottom: theme.spacing.standard + 150,
            }}
          >
            {/* Detail service: full detail + "Yang akan kami lakukan" */}
            <OrderStatusItemDetailSheetContent
              item={detailItem}
              onClose={handleDetailClose}
            />
          </BottomSheetScrollView>
        </BottomSheet>
      </VStack>
    </VStack>
  );
  });

OrderStatus.displayName = 'OrderStatus';
export default OrderStatus;
