import { Category } from '@core/api/category.types';

export type BottomNavigationParamList = {
  home: undefined;
  menu: undefined;
  history: undefined;
  scan: undefined;
  profile: undefined;
};

export type RootStackParamList = {
  bottom: undefined;
  checkout: undefined;
  walkthrough: undefined;
  outletlist: undefined;
  menusearch: undefined;
  laundry: { type?: string; serviceId: string };
  orderstatus: { orderId: string };
  // (auth) group
  login: undefined;
  onboarding: undefined;
  verification: {
    phone?: string;
  };
  register: undefined;

  // (bottom) group
  activity: undefined;
  chat: undefined;
  dashboard: undefined;
  home: undefined;
  profile: undefined;

  // (Gamification) group
  avatar: undefined;
  checkin: undefined;
  gatcha: undefined;
  league: undefined;
  level: undefined;
  shop: undefined;
  shareProfileQr: undefined;
  streak: undefined;
  //  (Gamification) milestone group
  milestonelist: undefined;
  milestonedetail: undefined;
  //  (Gamification) Challenge Group
  challengelist: undefined;
  challengedetail: undefined;

  // (Main) Group
  category: {
    activeID: number;
    onPress: (item: Category, index: number) => void;
  };
  changeprofile: undefined;
  chatdetail: undefined;
  explore: undefined;
  // (Main) Friend Group
  friendlist: undefined;
  frienddetail: undefined;
  notification: undefined;
  spot: undefined;
  stats: undefined;

  survey: undefined;
  // (utils) group
  help: undefined;
  webview: {
    uri: string;
    title?: string;
  };
  leaderboard: undefined;
  locationpermission: undefined;
  textbenchmark: undefined;
};
