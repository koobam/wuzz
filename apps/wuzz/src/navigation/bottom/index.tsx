/* eslint-disable react/no-unstable-nested-components */
import BottomNavigationBar from '@components/molecules/bottom-navigation-bar';
import {BottomNavigationParamList} from '@navigation/root/root.types';
import {
  Home,
  History,
  Menu,
  Scan,
} from '@pages/(bottom)';
import Profile from '@pages/(bottom)/profile';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  NavigatorScreenParams,
  StaticScreenProps,
} from '@react-navigation/native';
import {
  Home as HomeIcon,
  MenuBoard,
  ProfileCircle,
  Receipt,
  ScanBarcode,
} from 'iconsax-react-native';
import React from 'react';

const Tab = createBottomTabNavigator<BottomNavigationParamList>();

type BottomTabsProps = StaticScreenProps<
  NavigatorScreenParams<BottomNavigationParamList>
>;

export const Bottom = React.memo((_: BottomTabsProps) => {
  return (
    <Tab.Navigator
      tabBar={(props: BottomTabBarProps) => <BottomNavigationBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="home"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <HomeIcon color={color} size={size} variant="Bulk" />
          ),
        }}
        component={Home}
      />
      <Tab.Screen
        name="menu"
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({color, size}) => (
            <MenuBoard color={color} size={size} variant="Bulk" />
          ),
        }}
        component={Menu}
      />
      <Tab.Screen
        name="scan"
        options={{
          tabBarLabel: 'Scan',
          tabBarIcon: ({color, size}) => (
            <ScanBarcode color={color} size={size} variant="Bulk" />
          ),
        }}
        component={Scan}
      />
      <Tab.Screen
        name="history"
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({color, size}) => (
            <Receipt color={color} size={size} variant="Bulk" />
          ),
        }}
        component={History}
      />
      <Tab.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <ProfileCircle color={color} size={size} variant="Bulk" />
          ),
        }}
        component={Profile}
      />
    </Tab.Navigator>
  );
});

Bottom.displayName = 'BottomNavigation';
export default Bottom;
