import {
    Divider,
    Flex,
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
  import TabBar from '@components/molecules/tab';
import { useTheme } from '@react-navigation/native';
import Tab from '@components/molecules/tab';
  
  export const Notification = memo((props: any) => {
    const { navigation } = props;
    const { top } = useSafeAreaInsets();
    const navigationTheme = useTheme();
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
          <Text weight="semibold" type="s1" text="Notification" color={navigationTheme.colors.text} />
          <Text type="l1" text="Get the latest updates and notifications from Wuzz." color={navigationTheme.colors.text} />
        </VStack>
      ),
      [onLayout, top, navigationTheme.colors.text],
    );
  
    const renderTabBar = useCallback((props: TabBarProps<string>) => {
      return (
        <Tab.Pil
          tabNames={props.tabNames}
          onPress={props.onTabPress}
          activeIndex={props.indexDecimal}
        />
      );
    }, []);

    const renderItem = useCallback(({ item }: { item: any }) => {
      if(typeof item === 'string') {
        return (
          <Text type="b2" weight="bold" text={item} color={navigationTheme.colors.text} />
        );
      }
      return (
        <Pressable padding={{
          paddingVertical: theme.spacing.standard,
        }} spacing={theme.spacing.standard}>
          <Flex width={40} height={40} backgroundColor={theme.pallate.neutral['01']} borderRadius={999} />
          <VStack fill>
            <Text type="s3" weight="medium" color={navigationTheme.colors.text}>Lorem ipsum dolor sit amet.</Text>
            <Text width="100%" type="l2" color={navigationTheme.colors.text}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</Text>
          </VStack>
        </Pressable>
      )
    }, [navigationTheme.colors.text]);
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
          backgroundColor: theme.pallate.neutral['06'],
          shadowOpacity: 0,
          shadowRadius: 0,
        }}
      >
        <Tabs.Tab name="Inbox">
          <Tabs.FlashList
            data={[
              'Today',
              1,
              2,
              'Yesterday',
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
  