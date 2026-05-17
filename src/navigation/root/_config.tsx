import React from 'react';
import { Platform } from 'react-native';
import { Routes } from '@navigation/navigation.types';
import { ROOT_ROUTES } from './_routes';

// Eager — shown immediately on app start or auth flow
import Bottom from '@navigation/bottom';
import LocationPermission from '@pages/(utils)/location-permission';
import LoginIOS from '@pages/(auth)/(auth-ios)/login';
import RegisterIOS from '@pages/(auth)/(auth-ios)/register';
import LoginAndroid from '@pages/(auth)/(auth-android)/login';
import RegisterAndroid from '@pages/(auth)/(auth-android)/register';
import Verification from '@pages/(auth)/verification';

const Login = Platform.OS === 'ios' ? LoginIOS : LoginAndroid;
const Register = Platform.OS === 'ios' ? RegisterIOS : RegisterAndroid;

// Lazy — only loaded when first navigated to
const Checkout = React.lazy(() => import('@pages/(order)/checkout'));
const OutletList = React.lazy(() => import('@pages/(outlet)/outlet-list'));
const MenuSearch = React.lazy(() => import('@pages/(bottom)/menu/search'));
const Laundry = React.lazy(() => import('@pages/(order)/laundry').then(m => ({ default: m.Laundry })));
const ShareProfileQRScreen = React.lazy(() => import('@pages/(bottom)/profile/share-qr'));
const StreakScreen = React.lazy(() => import('@pages/(gamification)/streak'));
const OrderStatus = React.lazy(() => import('@pages/(order)/order-status'));
const Help = React.lazy(() => import('@pages/(utils)/help'));
const WebViewScreen = React.lazy(() => import('@pages/(utils)/webview'));
const Leaderboard = React.lazy(() => import('@pages/(utils)/leaderboard'));
const TextBenchmark = React.lazy(() => import('@pages/(utils)/text-benchmark'));

const defaultConfig = {
  screenOptions: {
    headerShown: false,
    animation: 'default' as const,
  },
};

const authSheetOptions = Platform.OS === 'ios'
  ? {
      presentation: 'formSheet' as const,
      headerShown: false,
      sheetAllowedDetents: 'fitToContents' as const,
      animation: 'default' as const,
      gestureEnabled: true,
    }
  : {
      headerShown: false,
      animation: 'slide_from_bottom' as const,
    };

// Register is a multi-step form — fitToContents clips the Kembali button when it appears.
// Use a full modal so the sheet has a fixed height and flex:1 works correctly.
const registerSheetOptions = Platform.OS === 'ios'
  ? {
      presentation: 'formSheet' as const,
      headerShown: false,
      animation: 'default' as const,
      sheetAllowedDetents: 'fitToContents' as const,
      gestureEnabled: true,
    }
  : {
      headerShown: false,
      animation: 'slide_from_bottom' as const,
    };

const bottomConfig: Routes = {
  name: ROOT_ROUTES.BOTTOM,
  components: Bottom,
  auth: false,
};

const checkoutConfig: Routes = {
  name: ROOT_ROUTES.CHECKOUT,
  components: Checkout,
  auth: false,
};

const outletListConfig: Routes = {
  name: ROOT_ROUTES.OUTLET_LIST,
  components: OutletList,
  auth: false,
  options: {
    animation: 'slide_from_bottom',
  },
};

const menuSearchConfig: Routes = {
  name: ROOT_ROUTES.MENU_SEARCH,
  components: MenuSearch,
  auth: false,
  options: {
    presentation: 'transparentModal',
    animation: 'fade',
    contentStyle: { backgroundColor: 'transparent' },
  },
};

const laundryConfig: Routes = {
  name: ROOT_ROUTES.LAUNDRY,
  components: Laundry,
  auth: false,
};

const shareProfileQrConfig: Routes = {
  name: ROOT_ROUTES.SHARE_PROFILE_QR,
  components: ShareProfileQRScreen,
  auth: false,
};

const streakConfig: Routes = {
  name: ROOT_ROUTES.STREAK,
  components: StreakScreen,
  auth: false,
};

/**
 * Auth-related screens (login, register, verification) are grouped together in the root navigator
 * because they share similar presentation styles (form sheets) and are part of the same user flow.
 */

const loginConfig: Routes = {
  name: ROOT_ROUTES.LOGIN,
  components: Login,
  auth: false,
  options: authSheetOptions,
};

const registerConfig: Routes = {
  name: ROOT_ROUTES.REGISTER,
  components: Register,
  auth: false,
  options: registerSheetOptions,
};

const verificationConfig: Routes = {
  name: ROOT_ROUTES.VERIFICATION,
  components: Verification, // Reusing Register component for verification step
  auth: false,
};

/**
 * End of auth-related screens. They are placed at the end of the file to keep them grouped together and separate from other unrelated screens. This also makes it easier to find and manage auth screens in the future, as they are all located in one section of the configuration file.
 */

const orderStatusConfig: Routes = {
  name: ROOT_ROUTES.ORDER_STATUS,
  components: OrderStatus,
  auth: false,
  options: {
    animation: 'slide_from_right',
  },
};

const helpConfig: Routes = {
  name: ROOT_ROUTES.HELP,
  components: Help,
  auth: false,
  options: {
    animation: 'slide_from_right',
  },
};

const webviewConfig: Routes = {
  name: ROOT_ROUTES.WEBVIEW,
  components: WebViewScreen,
  auth: false,
  options: {
    animation: 'slide_from_right',
  },
};

const leaderboardConfig: Routes = {
  name: ROOT_ROUTES.LEADERBOARD,
  components: Leaderboard,
  auth: false,
  options: {
    animation: 'slide_from_right',
  },
};

const locationPermissionConfig: Routes = {
  name: ROOT_ROUTES.LOCATION_PERMISSION,
  components: LocationPermission,
  auth: false,
};

const textBenchmarkConfig: Routes = {
  name: ROOT_ROUTES.TEXT_BENCHMARK,
  components: TextBenchmark,
  auth: false,
  options: {
    animation: 'slide_from_right',
  },
};

export const rootNavigationConfigs = {
  default: defaultConfig,
  [ROOT_ROUTES.BOTTOM]: bottomConfig,
  [ROOT_ROUTES.CHECKOUT]: checkoutConfig,
  [ROOT_ROUTES.OUTLET_LIST]: outletListConfig,
  [ROOT_ROUTES.MENU_SEARCH]: menuSearchConfig,
  [ROOT_ROUTES.LAUNDRY]: laundryConfig,
  [ROOT_ROUTES.SHARE_PROFILE_QR]: shareProfileQrConfig,
  [ROOT_ROUTES.STREAK]: streakConfig,
  [ROOT_ROUTES.LOGIN]: loginConfig,
  [ROOT_ROUTES.REGISTER]: registerConfig,
  [ROOT_ROUTES.VERIFICATION]: verificationConfig,
  [ROOT_ROUTES.ORDER_STATUS]: orderStatusConfig,
  [ROOT_ROUTES.HELP]: helpConfig,
  [ROOT_ROUTES.WEBVIEW]: webviewConfig,
  [ROOT_ROUTES.LEADERBOARD]: leaderboardConfig,
  [ROOT_ROUTES.LOCATION_PERMISSION]: locationPermissionConfig,
  [ROOT_ROUTES.TEXT_BENCHMARK]: textBenchmarkConfig,
};

export const rootRoutes: Routes[] = [
  rootNavigationConfigs[ROOT_ROUTES.LOCATION_PERMISSION],
  rootNavigationConfigs[ROOT_ROUTES.BOTTOM],
  rootNavigationConfigs[ROOT_ROUTES.CHECKOUT],
  rootNavigationConfigs[ROOT_ROUTES.OUTLET_LIST],
  rootNavigationConfigs[ROOT_ROUTES.MENU_SEARCH],
  rootNavigationConfigs[ROOT_ROUTES.LAUNDRY],
  rootNavigationConfigs[ROOT_ROUTES.SHARE_PROFILE_QR],
  rootNavigationConfigs[ROOT_ROUTES.STREAK],
  rootNavigationConfigs[ROOT_ROUTES.LOGIN],
  rootNavigationConfigs[ROOT_ROUTES.REGISTER],
  rootNavigationConfigs[ROOT_ROUTES.VERIFICATION],
  rootNavigationConfigs[ROOT_ROUTES.ORDER_STATUS],
  rootNavigationConfigs[ROOT_ROUTES.HELP],
  rootNavigationConfigs[ROOT_ROUTES.WEBVIEW],
  rootNavigationConfigs[ROOT_ROUTES.LEADERBOARD],
  rootNavigationConfigs[ROOT_ROUTES.TEXT_BENCHMARK],
];
