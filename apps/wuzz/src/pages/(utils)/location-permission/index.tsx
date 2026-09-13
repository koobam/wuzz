import { Box, Button, Text, theme, VStack } from '@components/atoms';
import { WoozlyMascot } from '@assets/index';
import { useLocationPermission } from '@features/(utils)/location-permission/hooks/useLocationPermission';
import { useLocationActions } from '@services/contexts/location';
import { ROOT_ROUTES } from '@navigation/root/_routes';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/root/root.types';
import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Location } from 'iconsax-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const ANIM = {
  fadeIn: 300,
  fadeOut: 200,
};

const LocationPermissionPage = memo(() => {
  const { bottom, top } = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const isFocused = useIsFocused();
  const { status, requestPermission, openSettings } = useLocationPermission();
  const { setSkipped } = useLocationActions();

  const permissionGranted = status === 'granted';

  // Home does its own nearest-outlet search independently (useCurrentLocation
  // + useFetchNearestOutlet), so this page just handles the permission prompt
  // and moves on, without fetching/displaying an outlet here too.
  const handleAllow = async () => {
    if (status === 'blocked') {
      openSettings();
      return;
    }
    await requestPermission();
    navigation.replace(ROOT_ROUTES.BOTTOM);
  };

  const handleSkip = () => {
    setSkipped();
    navigation.replace(ROOT_ROUTES.BOTTOM);
  };

  const showButtons = isFocused && !permissionGranted && status !== 'checking';

  return (
    <VStack
      fill
      justify="space-between"
      padding={{
        paddingHorizontal: theme.spacing.large,
        paddingTop: top + theme.spacing.large,
        paddingBottom: bottom + theme.spacing.large,
      }}
    >
      <VStack fill justify="center" items="center" gap={theme.spacing.large}>
        <Box style={styles.iconWrap}>
          <WoozlyMascot width={180} height={180} />
          <Box style={styles.locationBadge}>
            <Location
              size={24}
              variant="Bulk"
              color={theme.pallate.neutral['01']}
            />
          </Box>
        </Box>

        <VStack items="center" gap={theme.spacing.small}>
          <Animated.View
            entering={FadeIn.duration(ANIM.fadeIn)}
            exiting={FadeOut.duration(ANIM.fadeOut)}
          >
            <Text type="h3" weight="bold" align="center" color={theme.pallate.neutral['05']}>
              Find the nearest Wuzz outlet
            </Text>
            <Text type="b2" align="center" color={theme.pallate.neutral['04']}>
              We need your location to show outlets closest to you and calculate distance.
            </Text>
          </Animated.View>
        </VStack>
      </VStack>

      {showButtons && (
        <Animated.View
          entering={FadeIn.duration(ANIM.fadeIn)}
          exiting={FadeOut.duration(ANIM.fadeOut)}
        >
          <VStack gap={theme.spacing.standard}>
            <Button variant="primary" size="lg" rounded onPress={handleAllow}>
              <Text type="b2" weight="semibold" color={theme.pallate.neutral['01']}>
                {status === 'blocked' ? 'Open Settings' : 'Allow Location'}
              </Text>
            </Button>
            <Button variant="link" size="lg" rounded onPress={handleSkip}>
              <Text type="b2" weight="semibold" color={theme.pallate.neutral['04']}>
                Skip for now
              </Text>
            </Button>
          </VStack>
        </Animated.View>
      )}
    </VStack>
  );
});

const styles = StyleSheet.create({
  iconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: theme.pallate.primary['03'],
    borderRadius: 999,
    padding: 8,
  },
});

LocationPermissionPage.displayName = 'LocationPermissionPage';

export default LocationPermissionPage;
