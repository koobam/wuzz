import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './root.types';

// Prefix only for now, no custom `config.screens` path map — React Navigation
// falls back to each screen's own name as its path (e.g. wuzz://home,
// wuzz://login), which is enough for every screen to be linkable without
// hand-mapping ~40 routes. Add a `config` here once specific screens need a
// nicer public path (e.g. wuzz://laundry/:serviceId) or a shareable link.
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['wuzz://'],
};
