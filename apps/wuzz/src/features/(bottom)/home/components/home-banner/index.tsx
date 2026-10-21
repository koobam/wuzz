import { memo, useCallback, useState } from 'react';
import { Box, Flex, HStack, theme } from '@components/atoms';
import { FlashList } from '@shopify/flash-list';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import Image from '@components/atoms/image';
import { BANNER_IMAGES } from '../../utils';
import { useBannerPager, useStretchyBannerStyle } from '../../hooks';
import { BannerDot } from '../banner-dot';
import { WoozlyMascot } from '@assets/index';
import type { HomeBannerProps } from './home-banner.types';

/**
 * How far the banner bleeds above the content.
 *
 * Only has to outlast a fast flick, and it sits off-screen at rest, so the
 * number is generous rather than measured.
 */
const BLEED_HEIGHT = 400;

/** How far the banner picture reaches below the banner's own layout box, down
 *  to the League card: quick-actions row (+ its spacing) sits in this stretch. */
const BANNER_OVERLAP = 64;

/** How far above the banner's layout edge the mascot sits (it is 80px tall). */
const MASCOT_LIFT = 54;

const styles = StyleSheet.create({
  overflowHidden: { overflow: 'hidden' },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // Anchored to the bottom of the bleed box and flipped, so the image's own top
  // row lands exactly on the banner's top edge: the join is seamless by
  // construction rather than by a colour someone has to keep in sync.
  bleedImage: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    transform: [{ scaleY: -1 }],
  },
});

export const HomeBanner = memo(({ screenWidth, scrollY }: HomeBannerProps) => {
  const {
    bannerListRef,
    scrollOffsetX,
    handleBannerScrollUpdate,
    handleDotPress,
  } = useBannerPager();

  // height : width. The banner spans the full screen width, so the height
  // follows from it rather than being a fixed number that reads small on most
  // devices. Capped against the window height so a wide/short screen doesn't
  // get a banner taller than itself.
  const { height: windowHeight } = useWindowDimensions();
  const BANNER_RATIO = 0.85;
  const MAX_HEIGHT_SHARE = 0.65;
  const bannerHeight = Math.min(
    screenWidth * BANNER_RATIO,
    windowHeight * MAX_HEIGHT_SHARE,
  );
  // The picture runs this much further down than the space the banner takes in
  // the layout, so what follows (quick actions, then the League card) sits on
  // the photo instead of on white. Layout height is still `bannerHeight`.
  const imageHeight = bannerHeight + BANNER_OVERLAP;

  // Stands in when the screen doesn't pass a scroll offset, so the hook is
  // still called unconditionally and the banner just keeps its fixed height.
  const idleScrollY = useSharedValue(0);
  const stretchyStyle = useStretchyBannerStyle({
    scrollY: scrollY ?? idleScrollY,
    height: imageHeight,
  });

  const renderBannerItem = useCallback(
    ({ item }: { item: string }) => (
      <Box
        width={screenWidth}
        height={imageHeight}
        style={styles.overflowHidden}
      >
        <Image uri={item} resizeMode="cover" style={styles.bannerImage} />
      </Box>
    ),
    [screenWidth, imageHeight],
  );

  const keyExtractor = useCallback(
    (_: string, index: number) => ['banner', index].join('-'),
    [],
  );

  // Which banner the bleed mirror should show. Derived on the UI thread and
  // pushed to JS only when the page actually changes, not on every scroll frame.
  const [activeIndex, setActiveIndex] = useState(0);
  useAnimatedReaction(
    () => Math.round(scrollOffsetX.value / screenWidth),
    (index, previous) => {
      if (index !== previous) {
        runOnJS(setActiveIndex)(index);
      }
    },
  );
  const bleedUri =
    BANNER_IMAGES[Math.min(Math.max(activeIndex, 0), BANNER_IMAGES.length - 1)];

  return (
    <>
      {/* What the screen would otherwise show as white when the banner cannot
          cover the gap. The stretch is driven by scroll events, and a native
          scroll can always move a frame before the transform that follows it is
          committed — on a fast flick that one frame is a white band across the
          top. No amount of tuning removes it: it is a race, not a mis-measure.

          So the area above the content is already filled, with the banner
          itself mirrored upward. It sits entirely off-screen while the page is
          at rest. */}
      {bleedUri ? (
        <Box
          position={{ top: -BLEED_HEIGHT, left: 0, right: 0 }}
          height={BLEED_HEIGHT}
          style={styles.overflowHidden}
          pointerEvents="none"
        >
          <Image
            uri={bleedUri}
            resizeMode="cover"
            style={[styles.bleedImage, { height: bannerHeight }]}
          />
        </Box>
      ) : null}
      <Box
        height={imageHeight}
        // Gives back the overlap, so the layout below starts at `bannerHeight`.
        margin={{ marginBottom: -BANNER_OVERLAP }}
      >
        <Animated.View style={[{ height: imageHeight }, stretchyStyle]}>
          <FlashList
            ref={bannerListRef}
            data={BANNER_IMAGES}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleBannerScrollUpdate}
            renderItem={renderBannerItem}
            keyExtractor={keyExtractor}
          />
        </Animated.View>
        <Box
          position={{
            bottom: 0,
            left: 0,
            right: 0,
          }}
          as={
            <LinearGradient
              colors={[
                'transparent',
                'transparent',
                theme.pallate.neutral['01'],
              ]}
              locations={[0, 0.62, 1]}
            />
          }
          height={imageHeight}
          pointerEvents="none"
        />
      </Box>
      <HStack
        items="center"
        margin={{
          marginTop: theme.spacing.large * 3.5 * -1,
          marginHorizontal: theme.spacing.large,
        }}
        gap={theme.spacing.small}
      >
        {BANNER_IMAGES.map((_, index) => (
          <BannerDot
            key={['banner-dot', index].join('-')}
            index={index}
            scrollOffsetX={scrollOffsetX}
            screenWidth={screenWidth}
            onPress={handleDotPress}
          />
        ))}
      </HStack>
      <Flex direction="column" items="center" justify="space-between">
        <Box
          as={<WoozlyMascot width={80} height={80} />}
          width={80}
          height={80}
          position={{
            // High enough that most of it shows above the search field it sits
            // behind; only its feet are tucked in.
            top: -MASCOT_LIFT,
            right: theme.spacing.large,
          }}
          zIndex={2}
        />
      </Flex>
    </>
  );
});

HomeBanner.displayName = 'HomeBanner';
