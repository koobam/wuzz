import React from 'react';
import {
  FlexAnimated,
  HStack,
  Pressable,
  ReanimatedText,
  theme,
} from '@components/atoms';
import { Dimensions } from 'react-native';
import {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { TabBarLineProps, TabItemLineProps } from './line.type.tsx';

const TabItemLine = (props: TabItemLineProps) => {
  const { name, onPress, activeIndex, currentIndex } = props;

  const isActive = useDerivedValue(() => {
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
      borderRadius={0}
      padding={{
        paddingVertical: theme.spacing.standard,
        paddingHorizontal: theme.spacing.large,
      }}
      fill
      height={48}
      items="center"
      justify="center"
      spacing={8}
    >
      {/* Optionally replace or remove icon if not needed */}
      <ReanimatedText
        weight="semibold"
        text={name}
        type="b2"
        style={textAnimatedStyle}
      />
    </Pressable>
  );
};

const TabBarLine = (props: TabBarLineProps) => {
  const screenWidth = Dimensions.get('screen').width;
  const widthEach = screenWidth / props.tabNames.length;

  const indicatorStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      props.activeIndex.value,
      props.tabNames.map((_, idx) => idx),
      props.tabNames.map((_, idx) => idx * widthEach),
      'clamp',
    );
    return {
      width: widthEach,
      height: 3,
      backgroundColor: theme.pallate.primary['01'],
      position: 'absolute',
      bottom: 0,
      transform: [{ translateX }],
      borderRadius: 1.5,
    };
  });

  return (
    <HStack
      borderWidth={{
        borderBottomWidth: 0.5,
      }}
      borderColor={theme.pallate.neutral['05']}
      height={50}
      position="relative"
    >
      <FlexAnimated style={indicatorStyle} />
      {props.tabNames.map((name: string, idx: number) => (
        <TabItemLine
          key={name}
          name={name}
          onPress={props.onPress}
          activeIndex={props.activeIndex}
          currentIndex={idx}
        />
      ))}
    </HStack>
  );
};

export default TabBarLine;
