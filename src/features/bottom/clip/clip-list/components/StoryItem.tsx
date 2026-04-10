import { memo } from 'react';
import { StyleSheet } from 'react-native';
import {
  Box,
  HStack,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import Image from '@components/atoms/image';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { StoryItemProps } from '../types';
import { STORY_CONSTANTS } from '../constants';

export const StoryItem = memo(
  ({ item, index }: StoryItemProps) => {
    const STORY_WIDTH = STORY_CONSTANTS.WIDTH;
    const STORY_HEIGHT = STORY_WIDTH * STORY_CONSTANTS.HEIGHT_RATIO;
    const BORDER_WIDTH = STORY_CONSTANTS.BORDER_WIDTH;
    const BORDER_RADIUS = STORY_CONSTANTS.BORDER_RADIUS;
    const CONTAINER_PADDING = STORY_CONSTANTS.CONTAINER_PADDING;
    const showBorder = index === 0;

    const containerWidth =
      STORY_WIDTH + BORDER_WIDTH * 2 + CONTAINER_PADDING * 2;
    const containerHeight =
      STORY_HEIGHT + BORDER_WIDTH * 2 + CONTAINER_PADDING * 2;

    const gradientColors = showBorder
      ? STORY_CONSTANTS.GRADIENT_COLORS.ACTIVE
      : STORY_CONSTANTS.GRADIENT_COLORS.INACTIVE;

    const itemStyles = StyleSheet.create({
      cardContainer: {
        width: containerWidth,
        height: containerHeight,
        borderRadius: BORDER_RADIUS + BORDER_WIDTH + CONTAINER_PADDING,
        padding: CONTAINER_PADDING,
        justifyContent: 'center',
        alignItems: 'center',
      },
      maskBorder: {
        borderWidth: BORDER_WIDTH,
        borderRadius: BORDER_RADIUS + 3,
      },
      imageContainer: {
        position: 'absolute',
        top: BORDER_WIDTH + CONTAINER_PADDING,
        left: BORDER_WIDTH + CONTAINER_PADDING,
        width: STORY_WIDTH,
        height: STORY_HEIGHT,
        borderRadius: BORDER_RADIUS,
        overflow: 'hidden',
      },
    });

    return (
      <Pressable direction="column" items="center">
        <Box style={itemStyles.cardContainer}>
          <MaskedView
            maskElement={
              <Box
                pointerEvents="none"
                style={[StyleSheet.absoluteFill, itemStyles.maskBorder]}
              />
            }
            style={[StyleSheet.absoluteFill]}
          >
            <LinearGradient
              colors={[...gradientColors]}
              pointerEvents="none"
              style={StyleSheet.absoluteFill}
            />
          </MaskedView>
          <Box style={itemStyles.imageContainer}>
            <Image
              uri={`https://picsum.photos/seed/${item || index}/200/300`}
              resizeMode="cover"
              style={{
                width: STORY_WIDTH,
                height: STORY_HEIGHT,
                borderRadius: BORDER_RADIUS,
              }}
            />
            <Box position={{
              top: 8,
              left: 8,
            }} width={40} height={40} borderRadius={15} backgroundColor={theme.pallate.neutral['05']}/>
          </Box>
        </Box>
        <VStack
          justify="center"
          items="center"
          margin={{
            marginTop: -40,
          }}
          spacing={theme.spacing.small}
        >
          <Text type="l1" color={theme.pallate.neutral['01']} weight="bold">
            {item}
          </Text>
          <HStack
            items="center"
            justify="center"
            spacing={theme.spacing.small}
          >
            {[1, 2, 3].map((y, i) => (
              <Box
                key={i}
                margin={{
                  marginLeft: i !== 0 ? -10 : 0,
                }}
                borderWidth={1}
                borderColor={theme.pallate.neutral['06']}
                width={25}
                height={25}
                backgroundColor={theme.pallate.neutral['05']}
                borderRadius={15}
              />
            ))}
          </HStack>
        </VStack>
      </Pressable>
    );
  },
  (prevProps, nextProps) =>
    prevProps.item === nextProps.item && prevProps.index === nextProps.index,
);

StoryItem.displayName = 'StoryItem';

