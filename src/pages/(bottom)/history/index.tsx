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
import React, { useCallback } from 'react';
import { memo } from 'react';
import { TabBarProps, Tabs } from 'react-native-collapsible-tab-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useOnLayout from '@hooks/utils/useOnLayout';
import { TruckFast } from 'iconsax-react-native';
import TabBar from '@components/molecules/tabbar';

export const History = memo((props: any) => {
  const { navigation } = props;
  const { top } = useSafeAreaInsets();
  const [layout, onLayout] = useOnLayout();

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

  const renderTabBar = useCallback((props: TabBarProps<string>) => {
    return (
      <TabBar
        tabNames={props.tabNames}
        onPress={props.onTabPress}
        activeIndex={props.indexDecimal}
      />
    );
  }, []);

  const handleOrderPress = useCallback(
    (orderId: string) => {
      navigation.navigate('orderstatus', { orderId });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: number }) => (
      <Pressable
        direction="column"
        spacing={theme.spacing.standard}
        padding={theme.spacing.large}
        borderWidth={1}
        borderColor={theme.pallate.neutral['02']}
        borderRadius={14}
        onPress={() => handleOrderPress(String(item))}
      >
        <HStack items="center" spacing={theme.spacing.standard}>
          <TruckFast size={24} color={theme.pallate.primary['03']} variant='Bulk' />
          <VStack>
            <Text weight="semibold" type="b1">Driver Menuju Ke Lokasimu</Text>
            <HStack items="center" spacing={theme.spacing.tiny}>
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
        <HStack items="center" spacing={theme.spacing.tiny}>
          <Box borderRadius={25} width={30} height={30} backgroundColor={theme.pallate.neutral['02']} />
          <Flex fill height={5} borderRadius={25} backgroundColor={theme.pallate.neutral['02']} />
          <Box borderRadius={25} width={30} height={30} backgroundColor={theme.pallate.neutral['02']} />
          <Flex fill height={5} borderRadius={25} backgroundColor={theme.pallate.neutral['02']} />
          <Box borderRadius={25} width={30} height={30} backgroundColor={theme.pallate.neutral['02']} />
          <Flex fill height={5} borderRadius={25} backgroundColor={theme.pallate.neutral['02']} />
          <Box borderRadius={25} width={30} height={30} backgroundColor={theme.pallate.neutral['02']} />
        </HStack>
        <HStack items="center" spacing={theme.spacing.tiny}>
          <VStack fill>
            <Text type="l1">Laundry Kiloan, +2 Lainnya</Text>
            <Text color={theme.pallate.neutral['04']} type="l1">3Kg Pakaian, 2 Sepatu, +2 Item</Text>
          </VStack>
          <VStack>
            <Text weight="semibold" type="l1">Total Harga</Text>
            <Text type="l1">Rp 40.000</Text>
          </VStack>
        </HStack>
      </Pressable>
    ),
    [handleOrderPress],
  );

  return (
    <Tabs.Container
      renderHeader={Header}
      minHeaderHeight={layout.height}
      renderTabBar={renderTabBar}
      headerContainerStyle={{
        elevation: 0,
        shadowColor: 'transparent',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0,
        shadowRadius: 0,
      }}
    >
      <Tabs.Tab name="Ongoing">
        <Tabs.FlashList
          data={[
            1,
            2,
            3,
            4,
            5,
          ]}
          contentContainerStyle={{
            // NOTE: do not set paddingTop here. react-native-collapsible-tab-view
            // injects paddingTop = headerHeight + tabBarHeight to push content below
            // the collapsible header/tab bar, but our style is spread AFTER theirs in
            // FlashList.tsx, so any paddingTop we set overrides it and the first items
            // get clipped under the tab bar on Android. Use a spacer for top gap instead.
            paddingBottom: theme.spacing.standard,
            paddingHorizontal: theme.spacing.large,
          }}
          ListHeaderComponent={() => <Box height={theme.spacing.standard} />}
          ItemSeparatorComponent={() => (
            <Divider thickness={theme.spacing.standard} />
          )}
          renderItem={renderItem}
        />
      </Tabs.Tab>
      <Tabs.Tab name="History">
        <Tabs.FlashList
          data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
          contentContainerStyle={{
            // NOTE: do not set paddingTop here. react-native-collapsible-tab-view
            // injects paddingTop = headerHeight + tabBarHeight to push content below
            // the collapsible header/tab bar, but our style is spread AFTER theirs in
            // FlashList.tsx, so any paddingTop we set overrides it and the first items
            // get clipped under the tab bar on Android. Use a spacer for top gap instead.
            paddingBottom: theme.spacing.standard,
            paddingHorizontal: theme.spacing.large,
          }}
          ListHeaderComponent={() => <Box height={theme.spacing.standard} />}
          ItemSeparatorComponent={() => (
            <Divider thickness={theme.spacing.standard} />
          )}
          renderItem={renderItem}
        />
      </Tabs.Tab>
    </Tabs.Container>
  );
});

export default History;
