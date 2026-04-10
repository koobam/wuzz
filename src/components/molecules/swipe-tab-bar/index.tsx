import React, { Fragment, memo, useCallback, useMemo } from 'react';
import { Dimensions, StyleSheet, Pressable, View, Easing } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
  useDerivedValue,
  useSharedValue,
  useAnimatedReaction,
  SharedValue,
} from 'react-native-reanimated';
import { BoxAnimated, Flex, FlexAnimated, HStack, theme } from '@components/atoms';
import {
  NavigationState,
  ParamListBase,
  PartialState,
  NavigationHelpers,
  Descriptor,
} from '@react-navigation/native';
import {
  Home,
  Camera,
  SearchNormal1,
  Sms,
  ProfileCircle,
  Paperclip,
  Map,
} from 'iconsax-react-native';
import { EasingGradient } from '@components/atoms/easing-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { BlurGradient } from '@components/atoms/blur-gradient';
import { IS_IOS } from '../../../../env';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DEVICE_WIDTH = Dimensions.get('window').width;
const TAB_BAR_HEIGHT = 64;
const TAB_BAR_HORIZONTAL_INSET = 15;
const TAB_BAR_INNER_PADDING = 10;
const TAB_BAR_PILL_HEIGHT = 48;
const TAB_BAR_BORDER_RADIUS = 50;
const TAB_BAR_BORDER_WIDTH = 1;

const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
  mass: 0.8,
};

type TabBarProps = {
  activeIndex: SharedValue<number>;
  descriptorsRef: React.MutableRefObject<
    Record<string, Descriptor<any, any, any>>
  >;
  getIsFocused: (index: number) => boolean;
  jumpTo: (key: string) => void;
  navigation: NavigationHelpers<ParamListBase, any>;
  stateRef: React.MutableRefObject<
    | NavigationState<ParamListBase>
    | PartialState<NavigationState<ParamListBase>>
  >;
};

type RouteType = {
  key: string;
  name: string;
  params?: object | undefined;
  path?: string | undefined;
};

type TabIconProps = {
  accentColor: string;
  activeIndex: SharedValue<number>;
  index: number;
  onPress: ({
    route,
    index,
    tabBarIcon,
  }: {
    route: RouteType;
    index: number;
    tabBarIcon: string;
  }) => void;
  onLongPress: ({
    route,
    tabBarIcon,
  }: {
    route: RouteType;
    tabBarIcon: string;
  }) => void;
  route: RouteType;
  tabBarIcon: string;
};

const TAB_ICONS: Record<string, string> = {
  SwipeNavbarCamera: 'camera',
  SwipeNavbarHome: 'home',
  SwipeNavbarMaps: 'maps',
  SwipeNavbarExplorer: 'explorer',
  SwipeNavbarMessage: 'message',
  SwipeNavbarProfile: 'profile',
};

const BaseTabIcon = memo(function BaseTabIcon({
  accentColor,
  activeIndex,
  index,
  onPress,
  onLongPress,
  route,
  tabBarIcon,
}: TabIconProps) {
  const isFocused = useDerivedValue(() => activeIndex.value === index);

  const animatedStyle = useAnimatedStyle(() => {
    const isActive = isFocused.value;
    return {
      opacity: withSpring(isActive ? 1 : 0.5, SPRING_CONFIG),
      transform: [{ scale: withSpring(isActive ? 1 : 0.9, SPRING_CONFIG) }],
    };
  });

  const handlePress = useCallback(() => {
    onPress({ route, index, tabBarIcon });
  }, [route, index, tabBarIcon, onPress]);

  const handleLongPress = useCallback(() => {
    onLongPress({ route, tabBarIcon });
  }, [route, tabBarIcon, onLongPress]);

  const getIcon = () => {
    const iconProps = {
      size: 24,
      color: accentColor,
      variant: 'Linear' as const,
    };

    switch (tabBarIcon) {
      case 'camera':
        return <Camera {...iconProps} />;
      case 'home':
        return <Paperclip {...iconProps} />;
      case 'explorer':
        return <SearchNormal1 {...iconProps} />;
      case 'maps':
        return <Map {...iconProps} />;
      case 'message':
        return <Sms {...iconProps} />;
      case 'profile':
        return <ProfileCircle {...iconProps} />;
      default:
        return <Home {...iconProps} />;
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      style={styles.tabIconContainer}
    >
      <Animated.View style={[styles.tabIcon, animatedStyle]}>
        {getIcon()}
      </Animated.View>
    </Pressable>
  );
});

export const TabBar = memo(function TabBar({
  activeIndex,
  descriptorsRef: _descriptorsRef,
  jumpTo,
  navigation,
  stateRef,
}: TabBarProps) {
  const accentColor = theme.pallate.neutral['01'];
  const {bottom} = useSafeAreaInsets();
  // Filter out camera tab for calculations
  const visibleRoutes = useMemo(
    () => (stateRef.current.routes || []).filter((route: any) => route.name !== 'SwipeNavbarCamera'),
    [stateRef]
  );
  
  const numberOfTabs = visibleRoutes.length;

  // Calculate tab bar container width (device width minus horizontal insets)
  const tabBarContainerWidth = DEVICE_WIDTH - TAB_BAR_HORIZONTAL_INSET * 2;
  
  // Calculate available width for tabs (container width minus inner padding on both sides)
  const availableWidth = tabBarContainerWidth - TAB_BAR_INNER_PADDING * 2 - TAB_BAR_BORDER_WIDTH * 2;
  
  // Each tab takes equal space
  const tabWidth = availableWidth / numberOfTabs;

  const reanimatedPosition = useSharedValue(0);

  // Calculate tab positions: pill starts at the beginning of each tab
  // Position = inner padding + (tab width * tab index)
  // Store as shared values for worklet access
  const tabWidthShared = useSharedValue(tabWidth);
  const numberOfTabsShared = useSharedValue(numberOfTabs);
  
  // Update shared values when they change
  React.useEffect(() => {
    tabWidthShared.value = tabWidth;
    numberOfTabsShared.value = numberOfTabs;
  }, [tabWidth, numberOfTabs, tabWidthShared, numberOfTabsShared]);

  // Calculate positions in worklet context
  const tabPositions = useDerivedValue(() => {
    const tabs = numberOfTabsShared.value;
    const width = tabWidthShared.value;
    const inputRange = Array.from({ length: tabs }, (_, i) => i);
    const outputRange = Array.from(
      { length: tabs },
      (_, i) => TAB_BAR_INNER_PADDING + (width * i),
    );
    console.log('outputRange', outputRange);
    return { inputRange, outputRange };
  });

  const backgroundPillStyle = useAnimatedStyle(() => {
    const positions = tabPositions.value;
    const translateX = interpolate(
      reanimatedPosition.value,
      positions.inputRange,
      positions.outputRange,
      'clamp',
    );

    return {
      backgroundColor: theme.pallate.neutral['06'],
      width: tabWidthShared.value,
      transform: [{ translateX: withSpring(translateX, SPRING_CONFIG) }],
    };
  });

  useAnimatedReaction(
    () => activeIndex.value,
    (current, previous) => {
      if (current !== previous && previous !== undefined) {
        // Adjust index: camera is at index 0, so subtract 1 from all tabs after it
        const adjustedIndex = current > 0 ? current - 1 : 0;
        reanimatedPosition.value = adjustedIndex;
      }
    },
  );

  const onPress = useCallback(
    ({
      route,
      index,
    }: {
      route: RouteType;
      index: number;
      tabBarIcon: string;
    }) => {
        reanimatedPosition.value = index;
        jumpTo(route.key);
      
    },
    [jumpTo, reanimatedPosition],
  );

  const onLongPress = useCallback(
    ({ route }: { route: RouteType; tabBarIcon: string }) => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    },
    [navigation],
  );

  const renderedTabs = useMemo(
    () =>
      visibleRoutes.map((route: any, visibleIndex: number) => {
        const tabBarIcon = TAB_ICONS[route.name] || 'home';

        return (
          <BaseTabIcon
            key={route.name}
            accentColor={accentColor}
            activeIndex={reanimatedPosition}
            index={visibleIndex}
            onLongPress={onLongPress}
            onPress={onPress}
            route={route}
            tabBarIcon={tabBarIcon}
          />
        );
      }),
    [accentColor, onLongPress, onPress, reanimatedPosition, visibleRoutes],
  );

  return (
    <Fragment>
      <MaskedView
        maskElement={
          <EasingGradient
            easing={Easing.inOut(Easing.quad)}
            endColor={theme.pallate.neutral['06']}
            endOpacity={0}
            startColor={theme.pallate.neutral['06']}
            startOpacity={0.5}
            endPosition="top"
            startPosition="bottom"
            style={stylesFadeTabBar.tabBarBackgroundFade}
          />
        }
        style={stylesFadeTabBar.tabBarBackgroundFade}
      >
        <View
          style={[
            stylesFadeTabBar.tabBarBackgroundFade,
            { backgroundColor: theme.pallate.neutral['06'] },
          ]}
        />
      </MaskedView>

      <View
        style={{
          alignSelf: 'center',
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 20 },
          shadowRadius: 18,
          shadowOpacity: 0.3,
          elevation: 10,
        }}
        pointerEvents="box-none"
      >
        <BoxAnimated
          borderColor={'rgba(255, 255, 255, 0.095)'}
          borderWidth={TAB_BAR_BORDER_WIDTH}
          borderRadius={TAB_BAR_BORDER_RADIUS}
          height={TAB_BAR_HEIGHT}
          pointerEvents="box-none"
          position={{
            bottom,
          }}
          width={tabBarContainerWidth}
          style={{ alignSelf: 'center', overflow: 'hidden' }}
        >
          <Flex height={TAB_BAR_HEIGHT} fill>
            {IS_IOS ? (
                <BlurGradient
                  gradientPoints={[
                    { x: 0.5, y: 0.5 },
                    { x: 0.5, y: 1.5 },
                  ]}
                  height={TAB_BAR_HEIGHT}
                  intensity={50}
                  width={tabBarContainerWidth}
                />
            ) : (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: theme.pallate.neutral['06'] },
                ]}
              />
            )}
          </Flex>
          <HStack height={TAB_BAR_HEIGHT} padding={{ paddingHorizontal: TAB_BAR_INNER_PADDING }} items="center">
           <FlexAnimated
              borderRadius={TAB_BAR_BORDER_RADIUS - TAB_BAR_INNER_PADDING}
              height={TAB_BAR_PILL_HEIGHT}
              style={backgroundPillStyle}
              position="absolute"
              self="center"
            />
            {renderedTabs}
          </HStack>
        </BoxAnimated>
      </View>
    </Fragment>
  );
});

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: DEVICE_WIDTH - TAB_BAR_HORIZONTAL_INSET * 2,
    height: TAB_BAR_HEIGHT,
    shadowColor: theme.pallate.neutral['05'],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 10,
  },
  tabBarContent: {
    height: TAB_BAR_HEIGHT,
    borderRadius: TAB_BAR_BORDER_RADIUS,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.64)',
  },
  tabBarBackground: {
    backgroundColor: theme.pallate.neutral['06'],
    opacity: 0.95,
  },
  backgroundPill: {
    position: 'absolute',
    borderRadius: TAB_BAR_BORDER_RADIUS - TAB_BAR_INNER_PADDING,
  },
  tabsContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  tabIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: TAB_BAR_PILL_HEIGHT,
  },
  tabIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const stylesFadeTabBar = StyleSheet.create({
  tabBarBackgroundFade: {
    bottom: 0,
    height: TAB_BAR_HEIGHT + 50,
    pointerEvents: 'none',
    position: 'absolute',
    width: DEVICE_WIDTH,
  },
});

export default TabBar;
