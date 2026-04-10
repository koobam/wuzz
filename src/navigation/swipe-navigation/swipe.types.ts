import React from 'react';
import {
  NavigatorScreenParams,
  StaticScreenProps,
} from '@react-navigation/native';
import SWIPE_ROUTES from './_routes';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

export type SwipeNavigationParamList = {
  [SWIPE_ROUTES.CAMERA]: undefined;
  [SWIPE_ROUTES.HOME]: undefined;
  [SWIPE_ROUTES.MAPS]: undefined;
  [SWIPE_ROUTES.EXPLORER]: undefined;
  [SWIPE_ROUTES.MESSAGE]: undefined;
  [SWIPE_ROUTES.PROFILE]: undefined;
};

export type SwipeTabsProps = StaticScreenProps<
  NavigatorScreenParams<SwipeNavigationParamList>
>;

export type SwipeNavigatorConfigProps = React.ComponentProps<
  ReturnType<
    typeof createMaterialTopTabNavigator<SwipeNavigationParamList>
  >['Navigator']
>;

export type SwipeScreenConfigProps = React.ComponentProps<
  ReturnType<
    typeof createMaterialTopTabNavigator<SwipeNavigationParamList>
  >['Screen']
>;

export default SwipeNavigationParamList;
