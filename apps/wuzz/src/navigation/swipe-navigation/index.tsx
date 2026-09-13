import React from 'react';
import { SwipeNavigationParamList, SwipeTabsProps } from './swipe.types';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SWIPE_ROUTES from './_routes';
import swipeConfigs from './_config';

const Swipe = createMaterialTopTabNavigator<SwipeNavigationParamList>();
export const SwipeNavigation = React.memo((_: SwipeTabsProps) => {
  return (
    <Swipe.Navigator {...swipeConfigs.default}>
      <Swipe.Screen {...swipeConfigs[SWIPE_ROUTES.CAMERA]} />
      <Swipe.Screen {...swipeConfigs[SWIPE_ROUTES.HOME]} />
      {/* <Swipe.Screen {...swipeConfigs[SWIPE_ROUTES.MAPS]} /> */}
      <Swipe.Screen {...swipeConfigs[SWIPE_ROUTES.EXPLORER]} />
      <Swipe.Screen {...swipeConfigs[SWIPE_ROUTES.MESSAGE]} />
      <Swipe.Screen {...swipeConfigs[SWIPE_ROUTES.PROFILE]} />
    </Swipe.Navigator>

  );
});

SwipeNavigation.displayName = '@/navigation/swipe-navigation';
export default SwipeNavigation;
