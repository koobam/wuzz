import {
    Box,
    FlexAnimated,
    HStack,
    Icon,
    Pressable,
    ReanimatedText,
    theme,
  } from '@components/atoms';
  import { useTheme } from '@react-navigation/native';
  import { Dimensions } from 'react-native';
  import {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
    useDerivedValue,
  } from 'react-native-reanimated';
import { TabBarPilPropsType, TabItemPilProps } from './pil.type';
  
  
  
  const TabItemPil = (props: TabItemPilProps) => {
    const { name, onPress, activeIndex, currentIndex } = props;
      // Animated Color Text
    const isActive = useDerivedValue(() => {
      // Support floating point activeIndex by mapping nearest index to active
      // For example, if activeIndex.value is close to currentIndex (within 0.5), consider it active.
      return Math.abs(activeIndex.value - currentIndex) < 0.5 ? 1 : 0;
    });
  
    const textAnimatedStyle = useAnimatedStyle(() => {
      const textColor = interpolateColor(
        isActive.value,
        [0, 1],
        [theme.pallate.neutral['04'], theme.pallate.neutral['01']],
      );
  
      return {
        color: textColor,
      };
    });
  
    return (
      <Pressable
        key={name}
        onPress={() => onPress(name)}
        accessibilityRole="tab"
        borderRadius={999}
        padding={{
          paddingVertical: theme.spacing.standard,
          paddingHorizontal: theme.spacing.large,
        }}
        fill
        height={55}
        items="center"
        justify="center"
        spacing={8}
      >
        <Icon size={18} icon="Box" />
        <ReanimatedText
          weight="semibold"
          text={name}
          type="b2"
          style={textAnimatedStyle}
        />
      </Pressable>
    );
  };
  
  export const TabBarPil = (props: TabBarPilPropsType) => {
    const navigationTheme = useTheme();
    const screenWidth = Dimensions.get('screen').width - theme.spacing.large * 2 - theme.spacing.small * 2;
    const widthIndicator = screenWidth / props.tabNames.length;
  
    const animatedIndicatorStyle = useAnimatedStyle(() => {
      const translateX = interpolate(
        props.activeIndex.value,
        props.tabNames.map((_, index: number) => index),
        props.tabNames.map((_, index: number) => index * widthIndicator),
        'clamp',
      );
  
      return {
        width: widthIndicator,
        transform: [{ translateX }],
      };
    });
  
    return (
      <Box
        margin={{
          marginHorizontal: theme.spacing.large,
        }}
        padding={theme.spacing.small}
        borderRadius={999}
        backgroundColor={navigationTheme.colors.card}
        borderColor={theme.pallate.neutral['02']}
      >
        <HStack borderRadius={999} borderColor={theme.pallate.neutral['04']}>
          <FlexAnimated
            height={55}
            position="absolute"
            borderRadius={999}
            backgroundColor={theme.pallate.neutral['06']}
            style={animatedIndicatorStyle}
          />
          {props.tabNames.map((name: string, idx) => {
            return (
              <TabItemPil
                key={name}
                name={name}
                onPress={props.onPress}
                activeIndex={props.activeIndex}
                currentIndex={idx}
              />
            );
          })}
        </HStack>
      </Box>
    );
  };
  
  export default TabBarPil;
  