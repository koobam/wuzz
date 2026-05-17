import { Box, Button, Text, theme, VStack } from '@components/atoms';
import { WoozlyMascot } from '@assets/index';
import { useLocationPermission } from '@features/(utils)/location-permission/hooks/useLocationPermission';
import { useLocationActions, useLocationState } from '@services/contexts/location';
import { ROOT_ROUTES } from '@navigation/root/_routes';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/root/root.types';
import { memo, useEffect, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Location } from 'iconsax-react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useFetchNearestOutlet } from '@hooks/apis';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Phase = 'idle' | 'finding' | 'found';

const ANIM = {
  fadeIn: 300,
  fadeOut: 200,
  foundIn: 500,
  pulseBeat: 700,
  navigateDelay: 1800,
};

const LocationPermissionPage = memo(() => {
  const { bottom, top } = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const isFocused = useIsFocused();
  const { status, requestPermission, openSettings } = useLocationPermission();
  const { setSkipped, setGPSCoords } = useLocationActions();
  const [phase, setPhase] = useState<Phase>('idle');
  const navigateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const permissionGranted = status === 'granted';

  const { coords } = useLocationState();
  const {
    data: nearestOutlet,
    isFetching: isFetchingOutlet,
    isError: isOutletError,
  } = useFetchNearestOutlet({
    lat: coords?.lat ?? 0,
    long: coords?.long ?? 0,
  });

  const pulseOpacity = useSharedValue(1);
  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulseOpacity.value }));

  const startPulse = () => {
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: ANIM.pulseBeat, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: ANIM.pulseBeat, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  };

  const stopPulse = () => {
    pulseOpacity.value = withTiming(1);
  };

  // Transition to 'finding' while location or outlet is being fetched
  useEffect(() => {
    if ((isFetchingOutlet) && phase !== 'finding') {
      setPhase('finding');
      startPulse();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchingOutlet]);

  // Transition to 'found' when nearest outlet data arrives
  useEffect(() => {
    if (!nearestOutlet || !coords) return;
    setGPSCoords(coords);
    stopPulse();
    setPhase('found');
    navigateTimer.current = setTimeout(() => {
      navigation.replace(ROOT_ROUTES.BOTTOM);
    }, ANIM.navigateDelay);
    return () => {
      if (navigateTimer.current) clearTimeout(navigateTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nearestOutlet]);

  // Navigate away on outlet fetch error
  useEffect(() => {
    if (isOutletError) navigation.replace(ROOT_ROUTES.BOTTOM);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOutletError]);

  const handleAllow = async () => {
    if (status === 'blocked') {
      openSettings();
      return;
    }
    const result = await requestPermission();
    if (result !== 'granted') {
      navigation.replace(ROOT_ROUTES.BOTTOM);
    }
    // if granted → useGeolocationQuery becomes enabled → triggers automatically
  };

  const handleSkip = () => {
    setSkipped();
    navigation.replace(ROOT_ROUTES.BOTTOM);
  };

  const showButtons = isFocused && phase === 'idle' && !permissionGranted && status !== 'checking';

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
          {phase === 'idle' && (
            <Animated.View
              key="idle"
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
          )}

          {phase === 'finding' && (
            <Animated.View
              key="finding"
              entering={FadeIn.duration(ANIM.fadeIn)}
              exiting={FadeOut.duration(ANIM.fadeOut)}
              style={styles.center}
            >
              <Animated.Text style={[styles.findingText, pulseStyle]}>
                Finding nearest outlet...
              </Animated.Text>
            </Animated.View>
          )}

          {phase === 'found' && nearestOutlet?.name && (
            <Animated.View
              key="found"
              entering={FadeIn.duration(ANIM.foundIn).easing(Easing.out(Easing.ease))}
              style={styles.center}
            >
              <Text type="b2" align="center" color={theme.pallate.neutral['04']}>
                Nearest outlet
              </Text>
              <Text type="h3" weight="bold" align="center" color={theme.pallate.neutral['05']}>
                {nearestOutlet.name}
              </Text>
            </Animated.View>
          )}
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
  center: {
    alignItems: 'center',
  },
  findingText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.pallate.neutral['05'],
    textAlign: 'center',
  },
});

LocationPermissionPage.displayName = 'LocationPermissionPage';

export default LocationPermissionPage;
