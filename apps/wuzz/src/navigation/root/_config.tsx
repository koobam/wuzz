import React from 'react';
import { Platform } from 'react-native';
import { Routes } from '@navigation/navigation.types';
import { ROOT_ROUTES } from './_routes';

// Eager — shown immediately on app start or auth flow
import Bottom from '@navigation/bottom';
import Checkout from '@pages/(order)/checkout';
import OutletList from '@pages/(outlet)/outlet-list';
import WuzzerList from '@pages/(wuzzer)/wuzzer-list';
import MenuSearch from '@pages/(bottom)/menu/search';
import { Laundry } from '@pages/(order)/laundry';
import ShareProfileQRScreen from '@pages/(bottom)/profile/share-qr';
import StreakScreen from '@pages/(gamification)/streak';
import Login from '@pages/(auth)/login';
import Register from '@pages/(auth)/register';
import Verification from '@pages/(auth)/verification';
import OrderStatus from '@pages/(order)/order-status';
import Help from '@pages/(utils)/help';
import Scan from '@pages/(bottom)/scan';
import WebViewScreen from '@pages/(utils)/webview';
import Leaderboard from '@pages/(utils)/leaderboard';
import DeliveryAddressList from '@pages/(account)/delivery-address';
import AddAddress from '@pages/(account)/add-address';

const defaultConfig = {
  screenOptions: {
    headerShown: false,
    animation: 'default' as const,
  },
};

// Login & register tampil sebagai layar penuh (card push) di semua platform —
// bukan modal/sheet.
const authScreenOptions = {
  presentation: 'card' as const,
  headerShown: false,
  animation: 'slide_from_right' as const,
  gestureEnabled: true,
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

const wuzzerListConfig: Routes = {
  name: ROOT_ROUTES.WUZZER_LIST,
  components: WuzzerList,
  auth: false,
  options: {
    animation: 'slide_from_right',
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
  options: authScreenOptions,
};

const registerConfig: Routes = {
  name: ROOT_ROUTES.REGISTER,
  components: Register,
  auth: false,
  options: authScreenOptions,
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

const scanConfig: Routes = {
  name: ROOT_ROUTES.SCAN,
  components: Scan,
  auth: false,
  options: {
    animation: 'slide_from_bottom',
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

const deliveryAddressConfig: Routes = {
  name: ROOT_ROUTES.DELIVERY_ADDRESS,
  components: DeliveryAddressList,
  auth: false,
  options: {
    animation: 'slide_from_right',
  },
};

const addAddressConfig: Routes = {
  name: ROOT_ROUTES.ADD_ADDRESS,
  components: AddAddress,
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
  [ROOT_ROUTES.WUZZER_LIST]: wuzzerListConfig,
  [ROOT_ROUTES.MENU_SEARCH]: menuSearchConfig,
  [ROOT_ROUTES.LAUNDRY]: laundryConfig,
  [ROOT_ROUTES.SHARE_PROFILE_QR]: shareProfileQrConfig,
  [ROOT_ROUTES.STREAK]: streakConfig,
  [ROOT_ROUTES.LOGIN]: loginConfig,
  [ROOT_ROUTES.REGISTER]: registerConfig,
  [ROOT_ROUTES.VERIFICATION]: verificationConfig,
  [ROOT_ROUTES.ORDER_STATUS]: orderStatusConfig,
  [ROOT_ROUTES.HELP]: helpConfig,
  [ROOT_ROUTES.SCAN]: scanConfig,
  [ROOT_ROUTES.WEBVIEW]: webviewConfig,
  [ROOT_ROUTES.LEADERBOARD]: leaderboardConfig,
  [ROOT_ROUTES.DELIVERY_ADDRESS]: deliveryAddressConfig,
  [ROOT_ROUTES.ADD_ADDRESS]: addAddressConfig,
};

export const rootRoutes: Routes[] = [
  rootNavigationConfigs[ROOT_ROUTES.BOTTOM],
  rootNavigationConfigs[ROOT_ROUTES.CHECKOUT],
  rootNavigationConfigs[ROOT_ROUTES.OUTLET_LIST],
  rootNavigationConfigs[ROOT_ROUTES.WUZZER_LIST],
  rootNavigationConfigs[ROOT_ROUTES.MENU_SEARCH],
  rootNavigationConfigs[ROOT_ROUTES.LAUNDRY],
  rootNavigationConfigs[ROOT_ROUTES.SHARE_PROFILE_QR],
  rootNavigationConfigs[ROOT_ROUTES.STREAK],
  rootNavigationConfigs[ROOT_ROUTES.LOGIN],
  rootNavigationConfigs[ROOT_ROUTES.REGISTER],
  rootNavigationConfigs[ROOT_ROUTES.VERIFICATION],
  rootNavigationConfigs[ROOT_ROUTES.ORDER_STATUS],
  rootNavigationConfigs[ROOT_ROUTES.HELP],
  rootNavigationConfigs[ROOT_ROUTES.SCAN],
  rootNavigationConfigs[ROOT_ROUTES.WEBVIEW],
  rootNavigationConfigs[ROOT_ROUTES.LEADERBOARD],
  rootNavigationConfigs[ROOT_ROUTES.DELIVERY_ADDRESS],
  rootNavigationConfigs[ROOT_ROUTES.ADD_ADDRESS],
];
