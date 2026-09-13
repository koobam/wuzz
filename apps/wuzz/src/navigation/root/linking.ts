import type { LinkingOptions } from '@react-navigation/native';
import { ROOT_ROUTES } from './_routes';
import type { RootStackParamList } from './root.types';

// RootStackParamList declares far more screens than are actually registered
// (see _config.tsx / rootRoutes) — most of its entries are unused/aspirational
// types. Only the screens that exist in rootRoutes (plus the bottom tabs
// nested inside `bottom`, from navigation/bottom/index.tsx) can ever be
// navigated to, so only those get a path here; mapping the rest would just be
// dead config pointing at screens that don't exist.
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['wuzz://'],
  config: {
    screens: {
      [ROOT_ROUTES.BOTTOM]: {
        screens: {
          home: 'home',
          menu: 'menu',
          scan: 'scan',
          history: 'history',
          profile: 'profile',
        },
      },
      [ROOT_ROUTES.LOGIN]: 'login',
      [ROOT_ROUTES.REGISTER]: 'register',
      // phone is optional and arrives as a query param (wuzz://verification?phone=...)
      [ROOT_ROUTES.VERIFICATION]: 'verification',
      [ROOT_ROUTES.CHECKOUT]: 'checkout',
      [ROOT_ROUTES.OUTLET_LIST]: 'outlets',
      [ROOT_ROUTES.MENU_SEARCH]: 'menu/search',
      // type is optional and arrives as a query param (?type=...)
      [ROOT_ROUTES.LAUNDRY]: 'laundry/:serviceId',
      [ROOT_ROUTES.ORDER_STATUS]: 'orders/:orderId',
      [ROOT_ROUTES.SHARE_PROFILE_QR]: 'profile/share-qr',
      [ROOT_ROUTES.STREAK]: 'streak',
      [ROOT_ROUTES.LOCATION_PERMISSION]: 'location-permission',
      [ROOT_ROUTES.HELP]: 'help',
      // uri/title can contain characters unsafe for a path segment — query
      // params only (wuzz://webview?uri=...&title=...)
      [ROOT_ROUTES.WEBVIEW]: 'webview',
      [ROOT_ROUTES.LEADERBOARD]: 'leaderboard',
      [ROOT_ROUTES.DELIVERY_ADDRESS]: 'addresses',
      [ROOT_ROUTES.ADD_ADDRESS]: 'addresses/add',
    },
  },
};
