/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { queryClient } from '@core/query-client';
import Root from '@navigation/root';
import Mapbox from '@rnmapbox/maps';
import { AppState, BottomNavHeightProvider } from '@services/contexts';
import { QuerySyncWithAppState } from '@services/contexts/app-state';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { HotUpdater } from '@hot-updater/react-native';
import '@core/i18n';

require('./ReactotronConfig');
// Initialize Mapbox with access token (set MAPBOX_ACCESS_TOKEN in .env)
Mapbox.setAccessToken(
  'pk.eyJ1Ijoia29vYmFtIiwiYSI6ImNtZWxtajNncjBmeWMyd3FyM3V3NzUwMzUifQ.eusnZIscj38jvv9zmm1tHA',
);

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const appVersion =  HotUpdater.getAppVersion();
  console.log('appVersion', appVersion);
  return (
    <SafeAreaProvider>
      <AppState.Provider>
        <QueryClientProvider client={queryClient}>
          <QuerySyncWithAppState />
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <AppContent />
        </QueryClientProvider>
      </AppState.Provider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  return (
    <GestureHandlerRootView style={styles.flex1}>
      <BottomSheetModalProvider>
        <BottomNavHeightProvider>
          <Root />
        </BottomNavHeightProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

export default HotUpdater.wrap({
  baseURL:
    'https://ichexcegvboekweqmkmy.supabase.co/functions/v1/update-server',
  updateStrategy: 'appVersion', // or "fingerprint"
  updateMode: 'auto',
})(App);

const styles = StyleSheet.create({
  flex1: { flex: 1 },
});

const updateFallbackStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
