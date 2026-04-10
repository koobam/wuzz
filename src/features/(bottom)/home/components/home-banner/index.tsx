import { memo, useCallback } from 'react';
import { Box, Flex, HStack, theme } from '@components/atoms';
import { FlashList } from '@shopify/flash-list';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from 'react-native';
import Image from '@components/atoms/image';
import { BANNER_IMAGES } from '../../utils';
import { useBannerPager } from '../../hooks';
import { BannerDot } from '../banner-dot';
import { WoozlyMascot } from '@assets/index';
import type { HomeBannerProps } from './home-banner.types';

const styles = StyleSheet.create({
  overflowHidden: { overflow: 'hidden' },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});

export const HomeBanner = memo(({ screenWidth }: HomeBannerProps) => {
  const {
    bannerListRef,
    scrollOffsetX,
    handleBannerScrollUpdate,
    handleDotPress,
  } = useBannerPager();

  const renderBannerItem = useCallback(
    ({ item }: { item: string }) => (
      <Box width={screenWidth} height={screenWidth} style={styles.overflowHidden}>
        <Image uri={item} resizeMode="cover" style={styles.bannerImage} />
      </Box>
    ),
    [screenWidth],
  );

  const keyExtractor = useCallback(
    (_: string, index: number) => ['banner', index].join('-'),
    [],
  );

  return (
    <>
      <Box height={screenWidth}>
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
        <Box
          position={{
            bottom: 0,
            left: 0,
            right: 0,
          }}
          as={
            <LinearGradient
              colors={['transparent', theme.pallate.neutral['01']]}
              locations={[0, 1]}
            />
          }
          height={screenWidth}
          pointerEvents="none"
        />
      </Box>
      <HStack
        items="center"
        margin={{
          marginTop: theme.spacing.large * 3.5 * -1,
          marginHorizontal: theme.spacing.large,
        }}
        spacing={theme.spacing.small}
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
          as={<WoozlyMascot width={100} height={100} />}
          width={100}
          height={100}
          position={{
            top: -70,
            right: theme.spacing.large,
          }}
          zIndex={2}
        />
      </Flex>
    </>
  );
});

HomeBanner.displayName = 'HomeBanner';
