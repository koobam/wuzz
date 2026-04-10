import {
  HStack,
  HStackAnimated,
  Pressable,
  PressableAnimated,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React, { Fragment, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScanBarcode } from 'iconsax-react-native';
import { Dimensions } from 'react-native';
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useAuthState } from '@hooks/utils/useAuth';
import { useBottomNavHeight } from '@services/contexts/bottom-nav-height';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';

const TAB_COLOR_DURATION = 500;
const UNFOCUSED_COLOR = theme.pallate.neutral['04'];
const FOCUSED_COLOR_PRIMARY = theme.pallate.primary['03'];
const FOCUSED_COLOR_MENU = theme.pallate.coffee['03'];

const TOTAL_WIDTH = SCREEN_WIDTH - theme.spacing.large * 2;
const SPECIAL_WIDTH = 80;
const REMAINING_WIDTH = TOTAL_WIDTH - SPECIAL_WIDTH;
const ITEM_WIDTH = REMAINING_WIDTH / 4;

type AnimatedTabItemProps = {
  isFocused: boolean;
  onPress: () => void;
  onLongPress: () => void;
  tabBarIcon?: (props: {
    focused: boolean;
    color: string;
    size: number;
  }) => React.ReactNode;
  label: string;
  itemWidth: number;
  focusedColor: string;
};

const AnimatedTabItem = React.memo(
  ({
    isFocused,
    onPress,
    onLongPress,
    tabBarIcon,
    label,
    itemWidth,
    focusedColor,
  }: AnimatedTabItemProps) => {
    return (
      <Pressable
        onPress={onPress}
        spacing={2}
        width={itemWidth}
        height={70}
        items="center"
        justify="center"
        direction="column"
        onLongPress={onLongPress}
      >
        {label !== 'Menu' ? (
          tabBarIcon?.({
            focused: isFocused,
            color: isFocused ? focusedColor : UNFOCUSED_COLOR,
            size: 28,
          })
        ) : (
          <VStack items="center">
            <Text
              color={isFocused ? focusedColor : UNFOCUSED_COLOR}
              type="b1"
              weight="stylized"
              text="Can"
            />
            <Text
              color={isFocused ? focusedColor : UNFOCUSED_COLOR}
              margin={{ marginTop: -8 }}
              type="b1"
              weight="stylized"
              text="teen"
            />
          </VStack>
        )}
        {label !== 'Menu' && (
          <Text
            type="l1"
            color={isFocused ? focusedColor : UNFOCUSED_COLOR}
            weight={isFocused ? 'semibold' : 'regular'}
            text={label}
          />
        )}
      </Pressable>
    );
  },
);

AnimatedTabItem.displayName = 'AnimatedTabItem';

const CART_BG_PRIMARY = theme.pallate.primary['03'];
const CART_BG_MENU = theme.pallate.coffee['03'];
const CART_BUTTON_PRIMARY = theme.pallate.primary['04'];
const CART_BUTTON_MENU = theme.pallate.coffee['04'];
const SECONDARY_BUTTON_PRIMARY = theme.pallate.primary['04'];
const SECONDARY_BUTTON_MENU = theme.pallate.coffee['04'];
const SCAN_CIRCLE_PRIMARY = theme.pallate.primary['03'];
const SCAN_CIRCLE_MENU = theme.pallate.coffee['03'];

export const BottomNavigationBar = React.memo((props: BottomTabBarProps) => {
  const { state, descriptors, navigation } = props;
  const { bottom } = useSafeAreaInsets();
  const { isAuthenticated } = useAuthState();
  const { onLayout } = useBottomNavHeight();
  const isMenuTab = state.routes[state.index]?.name === 'menu';
  const menuProgress = useSharedValue(isMenuTab ? 1 : 0);

  useEffect(() => {
    menuProgress.value = withTiming(isMenuTab ? 1 : 0, {
      duration: TAB_COLOR_DURATION,
    });
  }, [isMenuTab, menuProgress]);

  const animatedCartBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      menuProgress.value,
      [0, 1],
      [CART_BG_PRIMARY, CART_BG_MENU],
    ),
  }));

  const animatedButtonBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      menuProgress.value,
      [0, 1],
      [CART_BUTTON_PRIMARY, CART_BUTTON_MENU],
    ),
  }));

  const animatedSecondaryButtonBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      menuProgress.value,
      [0, 1],
      [SECONDARY_BUTTON_PRIMARY, SECONDARY_BUTTON_MENU],
    ),
  }));

  const animatedScanCircleBgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      menuProgress.value,
      [0, 1],
      [SCAN_CIRCLE_PRIMARY, SCAN_CIRCLE_MENU],
    ),
  }));

  return (
    <VStack onLayout={onLayout}>
      <HStackAnimated
        style={animatedCartBgStyle}
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingVertical: theme.spacing.large,
          paddingBottom: theme.spacing.large * 2,
        }}
        borderRadius={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        items="center"
        spacing={theme.spacing.small}
      >
        {isAuthenticated ? (
          <Fragment>
            <VStack fill>
              <Text
                type="b2"
                weight="semibold"
                color={theme.pallate.neutral['01']}
              >
                10 Item (Rp 285.000)
              </Text>
              <Text
                numberOfLines={2}
                type="l2"
                color={theme.pallate.neutral['01']}
              >
                {/* Example: 2x Setrika (5 kg), 3x Cuci Kering (4 kg), 1x Cuci Premium (2 kg) */}
                2x Setrika (5 kg), 3x Cuci Kering (4 kg), 1x Cuci Premium (2 kg)
              </Text>
            </VStack>
            <PressableAnimated
              onPress={() => navigation.navigate('checkout')}
              padding={{
                paddingHorizontal: theme.spacing.large,
                paddingVertical: theme.spacing.standard,
              }}
              borderRadius={999}
              style={animatedButtonBgStyle}
            >
              <Text
                type="l1"
                color={theme.pallate.neutral['01']}
                weight="semibold"
              >
                Lihat Pesanan
              </Text>
            </PressableAnimated>
          </Fragment>
        ) : (
          <HStack spacing={theme.spacing.small}>
            <Text
              type="l1"
              fill
              numberOfLines={2}
              color={theme.pallate.neutral['01']}
            >
              Laundry, food & coffee, dalam satu aplikasi.
            </Text>

            <PressableAnimated
              onPress={() => navigation.getParent()?.navigate('login')}
              padding={{
                paddingHorizontal: theme.spacing.large,
                paddingVertical: theme.spacing.standard,
              }}
              borderRadius={999}
              style={animatedButtonBgStyle}
            >
              <Text
                type="l1"
                color={theme.pallate.neutral['01']}
                weight="semibold"
              >
                Masuk
              </Text>
            </PressableAnimated>

            <PressableAnimated
              onPress={() => navigation.getParent()?.navigate('register')}
              padding={{
                paddingHorizontal: theme.spacing.large,
                paddingVertical: theme.spacing.standard,
              }}
              borderRadius={999}
              style={animatedSecondaryButtonBgStyle}
            >
              <Text
                type="l1"
                color={theme.pallate.neutral['01']}
                weight="semibold"
              >
                Daftar
              </Text>
            </PressableAnimated>
          </HStack>
        )}
      </HStackAnimated>
      <HStack
        padding={{
          paddingBottom: bottom,
        }}
        height={bottom + 70}
        justify="center"
        items="center"
        backgroundColor={theme.pallate.neutral['01']}
        borderColor={theme.pallate.neutral['02']}
        borderRadius={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        margin={{
          marginTop: -theme.spacing.large,
        }}
        borderWidth={{
          borderTopWidth: 1,
          borderRightWidth: 1,
          borderLeftWidth: 1,
        }}
      >
        {state.routes.map((route: any, index: any) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              if (route.name === 'profile' && !isAuthenticated) {
                navigation.getParent()?.navigate('login');
                return;
              }
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          if (route.name === 'scan') {
            return (
              <Pressable
                key={route.key}
                width={SPECIAL_WIDTH}
                direction="column"
                onPress={onPress}
                spacing={theme.spacing.tiny}
                margin={{
                  marginTop: -20,
                }}
                onLongPress={onLongPress}
                items="center"
                justify="center"
              >
                <PressableAnimated
                  onPress={onPress}
                  width={55}
                  height={55}
                  borderRadius={999}
                  items="center"
                  justify="center"
                  borderWidth={2}
                  borderColor={theme.pallate.neutral['01']}
                  style={animatedScanCircleBgStyle}
                >
                  <ScanBarcode
                    size={28}
                    color={theme.pallate.neutral['01']}
                    variant="Bulk"
                  />
                </PressableAnimated>
                <Text
                  type="l1"
                  color={theme.pallate.neutral['04']}
                  weight="medium"
                  text="Scan QR"
                />
              </Pressable>
            );
          }
          const focusedColor =
            route.name === 'menu' ? FOCUSED_COLOR_MENU : FOCUSED_COLOR_PRIMARY;

          return (
            <AnimatedTabItem
              key={route.key}
              isFocused={isFocused}
              onPress={onPress}
              onLongPress={onLongPress}
              tabBarIcon={options.tabBarIcon}
              label={label as string}
              itemWidth={ITEM_WIDTH}
              focusedColor={focusedColor}
            />
          );
        })}
      </HStack>
    </VStack>
  );
});

BottomNavigationBar.displayName = 'components/molecules/BottomNavigationBar';
export default BottomNavigationBar;
