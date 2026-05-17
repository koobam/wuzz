import { memo } from 'react';
import { Image, StyleSheet, useWindowDimensions, View } from 'react-native';
import {
  BlurStyle,
  Canvas,
  Group,
  Path,
  Skia,
  Text as SkiaText,
  useFont,
  vec,
} from '@shopify/react-native-skia';
import { Box, Flex, HStack, Text, theme, VStack } from '@components/atoms';
import useOnLayout from '@hooks/utils/useOnLayout';
import type { LeaderboardEntry } from '../../types';
import { TIER_COLOR, TIER_COLOR_LIGHT } from '../../utils/constants';
import type { LeaguePodiumProps } from './league-podium.types';

// ─── 3D face path helper ─────────────────────────────────────────────────────────

const create3DFaces = (
  x: number,
  y: number,
  width: number,
  height: number,
  depth: number,
) => {
  const frontPath = Skia.Path.Make();
  frontPath.moveTo(x, y);
  frontPath.lineTo(x + width, y);
  frontPath.lineTo(x + width - 30, y + height);
  frontPath.lineTo(x + 30, y + height);
  frontPath.close();

  const topPath = Skia.Path.Make();
  topPath.moveTo(x, y);
  topPath.lineTo(x + depth, y - depth);
  topPath.lineTo(x + width - depth, y - depth);
  topPath.lineTo(x + width, y);
  topPath.close();

  return { frontPath, topPath };
};

// ─── Single 3D Skia block ────────────────────────────────────────────────────────

interface PodiumBlock3DProps {
  x: number;
  y: number;
  width: number;
  height: number;
  depth: number;
  color: string;
  borderColor?: string;
  isDark: boolean;
  number: number;
  rotation?: number;
}

const PodiumBlock3D = ({
  x,
  y,
  width,
  height,
  depth,
  color,
  borderColor,
  isDark,
  number,
  rotation = 0,
}: PodiumBlock3DProps) => {
  const { frontPath, topPath } = create3DFaces(x, y, width, height, depth);
  const font = useFont(require('@fonts/Poppins-Bold.ttf'), 80);

  const origin = vec(x + width / 2, y + height / 2);
  const transform = [{ rotate: rotation }];

  if (!font) return null;

  const text = number.toString();
  const textWidth = font.measureText(text).width;

  const shadowPaint = Skia.Paint();
  shadowPaint.setColor(Skia.Color('rgba(255,255,255,0.05)'));
  shadowPaint.setMaskFilter(
    Skia.MaskFilter.MakeBlur(BlurStyle.Normal, 20, true),
  );

  const innerShadowDark = Skia.Paint();
  innerShadowDark.setColor(
    Skia.Color(isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)'),
  );
  innerShadowDark.setMaskFilter(
    Skia.MaskFilter.MakeBlur(BlurStyle.Inner, 1, true),
  );

  const strokePaint = borderColor ? Skia.Paint() : null;
  if (strokePaint && borderColor) {
    strokePaint.setColor(Skia.Color(borderColor));
    strokePaint.setStyle(1); // stroke
    strokePaint.setStrokeWidth(1);
  }

  return (
    <Group transform={transform} origin={origin}>
      <Path path={frontPath} paint={shadowPaint} />
      <Path path={topPath} paint={shadowPaint} />
      <Path path={topPath} opacity={0.8} color={color} style="fill" />
      <Path path={frontPath} color={color} style="fill" />
      {strokePaint && (
        <>
          <Path path={frontPath} paint={strokePaint} />
          <Path path={topPath} paint={strokePaint} />
        </>
      )}
      <SkiaText
        font={font}
        x={x + width / 2 - textWidth / 2}
        y={y + 180 / 2}
        text={text}
        color={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'}
      />
    </Group>
  );
};

// ─── Player card (RN overlay) ────────────────────────────────────────────────────

interface PlayerCardProps {
  entry: LeaderboardEntry | undefined;
  avatarSize: number;
  topPadding: number;
}

const PlayerCard = memo(function PlayerCard({
  entry,
  avatarSize,
  topPadding,
}: PlayerCardProps) {
  if (!entry) return null;

  return (
    <VStack
      gap={theme.spacing.small}
      width={100}
      items="center"
      justify="center"
      padding={{ paddingTop: topPadding }}
    >
      <Image
        source={{
          uri: `https://placehold.co/${avatarSize}x${avatarSize}.webp`,
        }}
        style={{
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
        }}
      />
      <VStack items="center">
        <Text type="l1" weight="semibold" color={theme.pallate.neutral['05']}>
          {entry.displayName}
        </Text>
        <Text type="l1" color={theme.pallate.neutral['05']}>
          {entry.xp.toLocaleString()} XP
        </Text>
      </VStack>
    </VStack>
  );
});

// ─── Styles ──────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  canvas: { position: 'absolute', top: 0, left: 0 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0 },
});

// ─── Podium ──────────────────────────────────────────────────────────────────────

export const LeaguePodium = memo(function LeaguePodium({
  top3,
  tier,
}: LeaguePodiumProps) {
  const { width } = useWindowDimensions();
  const [layout, onLayout] = useOnLayout();

  const podiumWidth = (width - theme.spacing.large * 2) / 3;
  const depth = 15;

  const x1 = 40;
  const x2 = podiumWidth - x1 / 2;
  const x3 = x2 + podiumWidth - x1 * 1.5;

  const heightPodium1 = layout.height > 0 ? layout.height - 150 : 0;
  const heightPodium2 = layout.height > 0 ? layout.height - 190 : 0;
  const heightPodium3 = layout.height > 0 ? layout.height - 210 : 0;

  return (
    <VStack style={styles.container} onLayout={onLayout}>
      <Canvas
        style={[styles.canvas, { width: layout.width, height: layout.height }]}
      >
        {layout.height > 0 && (
          <Group
            transform={[
              { translateX: theme.spacing.large + 25, translateY: 0 },
            ]}
          >
            {/* LEFT: 2nd place */}
            <PodiumBlock3D
              x={x1}
              y={layout.height - heightPodium2}
              width={podiumWidth}
              height={heightPodium2}
              depth={depth}
              color={theme.pallate.neutral['04']}
              borderColor={theme.pallate.neutral['03']}
              isDark={false}
              number={2}
              rotation={(Math.PI / 18) * -1}
            />
            {/* RIGHT: 3rd place */}
            <PodiumBlock3D
              x={x3}
              y={layout.height - heightPodium3}
              width={podiumWidth}
              height={heightPodium3}
              depth={depth}
              color={theme.pallate.neutral['04']}
              borderColor={theme.pallate.neutral['03']}
              isDark={false}
              number={3}
              rotation={Math.PI / 18}
            />
            {/* CENTER: 1st place — color follows selected tier */}
            <PodiumBlock3D
              x={x2}
              y={layout.height - heightPodium1}
              width={podiumWidth}
              height={heightPodium1}
              depth={depth}
              color={TIER_COLOR[tier]}
              borderColor={TIER_COLOR_LIGHT[tier]}
              isDark={true}
              number={1}
            />
          </Group>
        )}
      </Canvas>

      {/* Player cards overlaid on canvas */}
      <View style={[styles.overlay, { width }]}>
        <HStack
          items="center"
          justify="space-between"
          padding={{ paddingHorizontal: theme.spacing.extraLarge }}
        >
          <PlayerCard entry={top3[1]} avatarSize={64} topPadding={50} />
          <PlayerCard entry={top3[0]} avatarSize={70} topPadding={0} />
          <PlayerCard entry={top3[2]} avatarSize={55} topPadding={60} />
        </HStack>
      </View>
    </VStack>
  );
});

export type { LeaguePodiumProps } from './league-podium.types';
