import { Routes } from '@navigation/navigation.types';
import { ROOT_ROUTES } from './_routes';
import Bottom from '@navigation/bottom';
import Checkout from '@pages/(order)/checkout';
import OutletList from '@pages/(outlet)/outlet-list';
import MenuSearch from '@pages/(bottom)/menu/search';
import { Laundry } from '@pages/(order)/laundry';
import ShareProfileQRScreen from '@pages/(bottom)/profile/share-qr';
import StreakScreen from '@pages/(gamification)/streak';
import Login from '@pages/(auth)/login';
import Register from '@pages/(auth)/register';
import OrderStatus from '@pages/(order)/order-status';
import Help from '@pages/(utils)/help';
import WebViewScreen from '@pages/(utils)/webview';
import Leaderboard from '@pages/(utils)/leaderboard';

const defaultConfig = {
  screenOptions: {
    headerShown: false,
    animation: 'default' as const,
  },
};

// Optimized formSheet config to reduce memory consumption
const formSheetOptions = {
  presentation: 'formSheet' as const,
  headerShown: false,
  sheetAllowedDetents: 'fitToContents' as const,
  animation: 'default' as const,
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

const loginConfig: Routes = {
  name: ROOT_ROUTES.LOGIN,
  components: Login,
  auth: false,
  options: formSheetOptions,
};

const registerConfig: Routes = {
  name: ROOT_ROUTES.REGISTER,
  components: Register,
  auth: false,
  options: formSheetOptions,
};

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
  [ROOT_ROUTES.ORDER_STATUS]: orderStatusConfig,
  [ROOT_ROUTES.HELP]: helpConfig,
  [ROOT_ROUTES.WEBVIEW]: webviewConfig,
  [ROOT_ROUTES.LEADERBOARD]: leaderboardConfig,
};

export const rootRoutes: Routes[] = [
  rootNavigationConfigs[ROOT_ROUTES.BOTTOM],
  rootNavigationConfigs[ROOT_ROUTES.CHECKOUT],
  rootNavigationConfigs[ROOT_ROUTES.OUTLET_LIST],
  rootNavigationConfigs[ROOT_ROUTES.MENU_SEARCH],
  rootNavigationConfigs[ROOT_ROUTES.LAUNDRY],
  rootNavigationConfigs[ROOT_ROUTES.SHARE_PROFILE_QR],
  rootNavigationConfigs[ROOT_ROUTES.STREAK],
  rootNavigationConfigs[ROOT_ROUTES.LOGIN],
  rootNavigationConfigs[ROOT_ROUTES.REGISTER],
  rootNavigationConfigs[ROOT_ROUTES.ORDER_STATUS],
  rootNavigationConfigs[ROOT_ROUTES.HELP],
  rootNavigationConfigs[ROOT_ROUTES.WEBVIEW],
  rootNavigationConfigs[ROOT_ROUTES.LEADERBOARD],
];
