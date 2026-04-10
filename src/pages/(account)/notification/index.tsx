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
  
  export const Notification = memo((props: any) => {
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
          <Text weight="semibold" type="s1" text="Notification" />
          <Text type="l1" text="Get the latest updates and notifications from Wuzz." />
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

    const renderItem = useCallback(({ item }: { item: any }) => {
      return (
        <Pressable
          direction="row"
          spacing={theme.spacing.medium}
          padding={theme.spacing.large}
          borderWidth={1}
          borderColor={theme.pallate.neutral['02']}
          borderRadius={14}
          backgroundColor={theme.pallate.neutral['01']}
          items="center"
        >
          <Flex
            items="center"
            borderRadius={999}
            backgroundColor={theme.pallate.primary['01']}
            width={44}
            height={44}
          >
            <TruckFast size={28} color={theme.pallate.primary['03']} variant="Bulk" />
          </Flex>
          <VStack fill spacing={4}>
            <Text type="b2" weight="semibold">
              Your order is on the way!
            </Text>
            <Text type="l2" color={theme.pallate.neutral['04']} numberOfLines={1}>
              Courier is delivering your laundry.
            </Text>
            <Text type="l1" color={theme.pallate.neutral['04']}>
              2 min ago
            </Text>
          </VStack>
        </Pressable>
      );
    }, []);
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
        <Tabs.Tab name="Inbox">
          <Tabs.FlashList
            data={[
              1,
              2,
              3,
              4,
              5,
            ]}
            contentContainerStyle={{
              paddingTop: theme.spacing.standard,
              paddingBottom: theme.spacing.standard,
              paddingHorizontal: theme.spacing.large,
            }}
            ItemSeparatorComponent={() => (
              <Divider thickness={theme.spacing.standard} />
            )}
            renderItem={renderItem}
          />
        </Tabs.Tab>
        <Tabs.Tab name="Promo">
          <Tabs.FlashList
            data={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
            contentContainerStyle={{
              paddingTop: theme.spacing.standard,
              paddingBottom: theme.spacing.standard,
              paddingHorizontal: theme.spacing.large,
            }}
            ItemSeparatorComponent={() => (
              <Divider thickness={theme.spacing.standard} />
            )}
            renderItem={renderItem}
          />
        </Tabs.Tab>
      </Tabs.Container>
    );
  });
  
  export default Notification;
  