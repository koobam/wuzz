import { memo } from 'react';
import { Box, Button, HStack, Icon, Pressable, Text, theme, VStack } from '@components/atoms';
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';
import type { ProfileHeaderProps } from './profile-header.types';
import { IconChevronRight } from 'tabler-icons-react-native';
import { Canvas, Skia, Text as SkiaText, useFont } from '@shopify/react-native-skia';

const AnimatedLinearGradient = Reanimated.createAnimatedComponent(LinearGradient);

const HEADER_HEIGHT = 380;

const GRADIENT_COLORS = [
  theme.pallate.primary['02'],
  theme.pallate.neutral['01'],
];
const GRADIENT_START = { x: 0, y: 0 };
const GRADIENT_END = { x: 0, y: 1 };
const GRADIENT_LOCATIONS = [0, 1];

const FONT_SIZE = 28;
const CANVAS_HEIGHT = FONT_SIZE + 12;

const StrokedText = memo(function StrokedText({
  text,
  color,
  strokeColor,
}: {
  text: string;
  color: string;
  strokeColor: string;
}) {
  const font = useFont(require('@fonts/FredokaOne-Regular.ttf'), FONT_SIZE);

  if (!font) return null;

  const textWidth = font.measureText(text).width;

  const fillPaint = Skia.Paint();
  fillPaint.setColor(Skia.Color(color));

  const strokePaint = Skia.Paint();
  strokePaint.setColor(Skia.Color(strokeColor));
  strokePaint.setStyle(1);
  strokePaint.setStrokeWidth(3);
  strokePaint.setStrokeJoin(2);

  return (
    <Canvas style={{ width: textWidth + 4, height: CANVAS_HEIGHT }}>
      <SkiaText
        font={font}
        x={2}
        y={FONT_SIZE}
        text={text}
        paint={strokePaint}
      />
      <SkiaText
        font={font}
        x={2}
        y={FONT_SIZE}
        text={text}
        paint={fillPaint}
      />
    </Canvas>
  );
});

const styles = StyleSheet.create({
  gradient: {
    width: '100%',
  },
});


export const ProfileHeader = memo(function ProfileHeader({
  topInset = 0,
  scrollY,
}: ProfileHeaderProps) {
  const stretchyStyle = useAnimatedStyle(() => {
    const bounce = scrollY.value < 0 ? -scrollY.value : 0;
    return {
      height: HEADER_HEIGHT + bounce,
      marginTop: -bounce,
    };
  });

  return (
    <>
      <AnimatedLinearGradient
        colors={GRADIENT_COLORS}
        start={GRADIENT_START}
        end={GRADIENT_END}
        locations={GRADIENT_LOCATIONS}
        style={[styles.gradient, stretchyStyle]}
      />
      <HStack
        width="100%"
        padding={{
          paddingHorizontal: theme.spacing.large,
        }}
        items="center"
        justify="space-between"
        position={{
          top: topInset,
        }}
      >
        <VStack>
          <Text type="b2" weight="semibold" color={theme.pallate.neutral['05']}>Hari Runtutan</Text>
          <StrokedText
            text="390 Hari"
            color={theme.pallate.neutral['01']}
            strokeColor={theme.pallate.primary['03']}
          />
        </VStack>
        <Pressable backgroundColor={theme.pallate.neutral['01']} padding={{
          paddingHorizontal: theme.spacing.standard,
        }} borderRadius={{
          borderTopRightRadius: 999,
          borderBottomRightRadius: 999,
        }} items="center" height={32} spacing={theme.spacing.small}>
          <Box position={{left:-45}}>
          <Icon icon="outfit" size={55} color={theme.pallate.neutral['05']} />
          </Box>
          <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
            Outfit
          </Text>
          <IconChevronRight size={16} color={theme.pallate.neutral['05']} />
        </Pressable>
      </HStack>
    </>
  );
});

export type { ProfileHeaderProps } from './profile-header.types';
