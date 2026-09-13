import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './index';

// Custom scheme only for now — add an https:// prefix here once station has
// a real associated domain (apple-app-site-association / assetlinks.json)
// to serve for universal/app links.
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['wuzzstation://'],
  config: {
    screens: {
      Home: 'home',
    },
  },
};
