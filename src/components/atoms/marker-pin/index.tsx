import React, { memo } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, ClipPath, Defs } from 'react-native-svg';
import Image from '@components/atoms/image';
import { Text, theme } from '@components/atoms';

interface MarkerPinProps {
  imageUri: string | number;
  rating?: number;
  size?: number;
  backgroundColor?: string;
  borderColor?: string;
}

const MarkerPin = memo(
  ({
    imageUri,
    rating,
    size = 60,
    backgroundColor = theme.pallate.neutral['02'],
    borderColor = theme.pallate.neutral['05'],
  }: MarkerPinProps) => {
    const width = size;
    const height = size * 1.25; // Height includes the pointed tail
    const borderRadius = size * 0.12; // Rounded corners for top section
    const circleRadius = size * 0.32; // Circle radius for image
    const circleCenterX = width / 2;
    const circleCenterY = size * 0.52; // Position of circle center
    const tailWidth = size * 0.12; // Width of the pointed tail
    const tailHeight = size * 0.18; // Height of the pointed tail

    // Top section (rounded rectangle for rating)
    const topSectionHeight = size * 0.28;
    const topSectionY = 0;
    const circleTopY = circleCenterY - circleRadius;
    const circleBottomY = circleCenterY + circleRadius;

    // Calculate path for the speech bubble shape
    // Top rounded rectangle
    const topRectPath = `
      M ${borderRadius} ${topSectionY}
      L ${width - borderRadius} ${topSectionY}
      Q ${width} ${topSectionY} ${width} ${topSectionY + borderRadius}
      L ${width} ${topSectionHeight - borderRadius}
      Q ${width} ${topSectionHeight} ${width - borderRadius} ${topSectionHeight}
      L ${circleCenterX + circleRadius * 0.85} ${topSectionHeight}
      L ${circleCenterX} ${circleTopY}
      L ${circleCenterX - circleRadius * 0.85} ${topSectionHeight}
      L ${borderRadius} ${topSectionHeight}
      Q 0 ${topSectionHeight} 0 ${topSectionHeight - borderRadius}
      L 0 ${topSectionY + borderRadius}
      Q 0 ${topSectionY} ${borderRadius} ${topSectionY}
      Z
    `;

    // Bottom pointed tail
    const tailPath = `
      M ${circleCenterX} ${circleBottomY}
      L ${circleCenterX - tailWidth / 2} ${circleBottomY + tailHeight * 0.3}
      L ${circleCenterX} ${height}
      L ${circleCenterX + tailWidth / 2} ${circleBottomY + tailHeight * 0.3}
      Z
    `;

    return (
      <View style={{ width, height, alignItems: 'center' }}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <ClipPath id="imageClip">
              <Circle cx={circleCenterX} cy={circleCenterY} r={circleRadius} />
            </ClipPath>
          </Defs>
          {/* Top rounded rectangle section */}
          <Path
            d={topRectPath}
            fill={backgroundColor}
            stroke={borderColor}
            strokeWidth={1}
          />
          {/* Bottom pointed tail */}
          <Path
            d={tailPath}
            fill={backgroundColor}
            stroke={borderColor}
            strokeWidth={1}
            strokeLinejoin="round"
          />
        </Svg>
        {/* Image overlay */}
        <View
          style={{
            position: 'absolute',
            top: circleCenterY - circleRadius,
            left: circleCenterX - circleRadius,
            width: circleRadius * 2,
            height: circleRadius * 2,
            borderRadius: circleRadius,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: borderColor,
          }}
        >
          <Image
            uri={imageUri}
            style={{
              width: circleRadius * 2,
              height: circleRadius * 2,
            }}
            resizeMode="cover"
          />
        </View>
        {/* Rating section (optional) */}
        {rating !== undefined && (
          <View
            style={{
              position: 'absolute',
              top: topSectionY + borderRadius / 2,
              left: borderRadius,
              right: borderRadius,
              height: topSectionHeight - borderRadius,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            {/* Star icon */}
            <Svg width={size * 0.12} height={size * 0.12} viewBox="0 0 24 24">
              <Path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill="#FFD700"
                stroke="#FFA500"
                strokeWidth={0.5}
              />
            </Svg>
            <Text
              type="l1"
              weight="semibold"
              color={theme.pallate.neutral['05']}
              style={{ fontSize: size * 0.15 }}
            >
              {rating.toFixed(1)}
            </Text>
          </View>
        )}
      </View>
    );
  }
);

MarkerPin.displayName = 'MarkerPin';
export default MarkerPin;

