import {
  Box,
  Divider,
  Flex,
  HStack,
  Pressable,
  Text,
  VStack,
  theme,
} from '@components/atoms';
import { EmptyHistory } from '@assets/index';
import { EmptyStatePlaceholder } from '@components/molecules';
import React, { useCallback, useMemo } from 'react';
import { memo } from 'react';
import { TabBarProps, Tabs } from 'react-native-collapsible-tab-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import useOnLayout from '@hooks/utils/useOnLayout';
import { TruckFast } from 'iconsax-react-native';
import { useBottomNavHeight } from '@services/contexts/bottom-nav-height';
import TabBar from '@components/molecules/tabbar';

export const History = memo((props: any) => {
  const { navigation } = props;
  const { top } = useSafeAreaInsets();
  const { navHeight } = useBottomNavHeight();
  const { t } = useTranslation('history');
  const [layout, onLayout] = useOnLayout();

  const headerContainerStyle = useMemo(
    () => ({
      elevation: 0,
      shadowColor: 'transparent',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0,
      shadowRadius: 0,
    }),
    [],
  );

  const ongoingListContentStyle = useMemo(
    () => ({
      paddingTop: theme.spacing.standard,
      paddingBottom: theme.spacing.standard + navHeight,
      paddingHorizontal: theme.spacing.large,
    }),
    [navHeight],
  );

  const historyListContentStyle = useMemo(
    () => ({
      paddingTop: theme.spacing.standard,
      paddingBottom: theme.spacing.standard + navHeight,
      paddingHorizontal: theme.spacing.large,
    }),
    [navHeight],
  );

  const historyEmptyStateStyle = useMemo(
    () => ({
      flex: 1,
      justifyContent: 'center' as const,
    }),
    [],
  );

  const Header = useCallback(
    () => (
      <VStack
        onLayout={onLayout}
        borderColor={theme.pallate.neutral['04']}
        padding={{
          paddingTop: top + theme.spacing.standard,
          paddingBottom: theme.spacing.standard,
          paddingHorizontal: theme.spacing.large,
        }}
      >
        <Text weight="semibold" type="s1" text="Riwayat Order" />
        <Text type="l1" text="Choose your addiction to start using the app." />
      </VStack>
    ),
    [onLayout, top],
  );

  const renderTabBar = useCallback((tabBarProps: TabBarProps<string>) => {
    return (
      <TabBar
        tabNames={tabBarProps.tabNames}
        onPress={tabBarProps.onTabPress}
        activeIndex={tabBarProps.indexDecimal}
      />
    );
  }, []);

  const handleOrderPress = useCallback(
    (orderId: string) => {
      navigation.navigate('orderstatus', { orderId });
    },
    [navigation],
  );

  const handleCreateOrder = useCallback(() => {
    navigation.navigate('home');
  }, [navigation]);

  const handleCoverageArea = useCallback(() => {}, []);

  const renderItem = useCallback(
    ({ item }: { item: number }) => (
      <Pressable
        direction="column"
        gap={theme.spacing.standard}
        padding={theme.spacing.large}
        borderWidth={1}
        borderColor={theme.pallate.neutral['02']}
        borderRadius={14}
        onPress={() => handleOrderPress(String(item))}
      >
        <HStack items="center" gap={theme.spacing.standard}>
          <TruckFast
            size={24}
            color={theme.pallate.primary['03']}
            variant="Bulk"
          />
          <VStack>
            <Text weight="semibold" type="b1">
              Driver Menuju Ke Lokasimu
            </Text>
            <HStack items="center" gap={theme.spacing.tiny}>
              <Text color={theme.pallate.neutral['04']} type="l1">
                Wuzz 1090 Supermall Karawaci
              </Text>
              <Box
                width={3}
                height={3}
                borderRadius={20}
                backgroundColor={theme.pallate.neutral['04']}
              />
              <Text color={theme.pallate.neutral['04']} type="l1">
                Delivery
              </Text>
            </HStack>
          </VStack>
        </HStack>
        <HStack items="center" gap={theme.spacing.tiny}>
          <Box
            borderRadius={25}
            width={30}
            height={30}
            backgroundColor={theme.pallate.neutral['02']}
          />
          <Flex
            fill
            height={5}
            borderRadius={25}
            backgroundColor={theme.pallate.neutral['02']}
          />
          <Box
            borderRadius={25}
            width={30}
            height={30}
            backgroundColor={theme.pallate.neutral['02']}
          />
          <Flex
            fill
            height={5}
            borderRadius={25}
            backgroundColor={theme.pallate.neutral['02']}
          />
          <Box
            borderRadius={25}
            width={30}
            height={30}
            backgroundColor={theme.pallate.neutral['02']}
          />
          <Flex
            fill
            height={5}
            borderRadius={25}
            backgroundColor={theme.pallate.neutral['02']}
          />
          <Box
            borderRadius={25}
            width={30}
            height={30}
            backgroundColor={theme.pallate.neutral['02']}
          />
        </HStack>
        <HStack items="center" gap={theme.spacing.tiny}>
          <VStack fill>
            <Text type="l1">Laundry Kiloan, +2 Lainnya</Text>
            <Text color={theme.pallate.neutral['04']} type="l1">
              3Kg Pakaian, 2 Sepatu, +2 Item
            </Text>
          </VStack>
          <VStack>
            <Text weight="semibold" type="l1">
              Total Harga
            </Text>
            <Text type="l1">Rp 40.000</Text>
          </VStack>
        </HStack>
      </Pressable>
    ),
    [handleOrderPress],
  );

  const renderItemSeparator = useCallback(
    () => <Divider thickness={theme.spacing.standard} />,
    [],
  );

  const renderHistoryEmpty = useCallback(
    () => (
      <EmptyStatePlaceholder
        icon={<EmptyHistory />}
        iconSize={200}
        title={t('empty.title')}
        description={t('empty.description')}
        primaryButton={{
          label: t('empty.cta'),
          onPress: handleCreateOrder,
        }}
        secondaryButton={{
          label: t('empty.ctaSecondary'),
          onPress: handleCoverageArea,
        }}
        style={historyEmptyStateStyle}
      />
    ),
    [handleCoverageArea, handleCreateOrder, historyEmptyStateStyle, t],
  );

  return (
    <Tabs.Container
      renderHeader={Header}
      minHeaderHeight={layout.height}
      renderTabBar={renderTabBar}
      headerContainerStyle={headerContainerStyle}
    >
      <Tabs.Tab name="Ongoing">
        <Tabs.FlashList
          data={[1, 2, 3, 4, 5]}
          contentContainerStyle={ongoingListContentStyle}
          ItemSeparatorComponent={renderItemSeparator}
          ListHeaderComponent={() => <Box height={theme.spacing.standard} />}
          renderItem={renderItem}
        />
      </Tabs.Tab>
      <Tabs.Tab name="History">
        <Tabs.FlashList
          data={[]}
          contentContainerStyle={historyListContentStyle}
          ItemSeparatorComponent={renderItemSeparator}
          ListEmptyComponent={renderHistoryEmpty}
          ListHeaderComponent={() => <Box height={theme.spacing.standard} />}
          renderItem={renderItem}
        />
      </Tabs.Tab>
    </Tabs.Container>
  );
});

export default History;
