import { theme, VStack, VStackAnimated } from '@components/atoms';
import { memo, useCallback, useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { MenuSearchInner } from '../menu-search-inner';
import { MenuSearchWavesOverlay } from '../menu-search-waves-overlay';
import {
  useMenuSearchAnimation,
  useMenuSearchKeyboardDismiss,
} from '../../hooks';
import { getWavesDimensions } from '../../utils/search';
import type { MenuSearchContentProps } from './menu-search-content.types';

const styles = StyleSheet.create({
  fill: { flex: 1 },
  cardWrap: { flex: 1 },
  listContentWrap: { flex: 1, position: 'relative' as const },
});

export const MenuSearchContent = memo((props: MenuSearchContentProps) => {
  const { onClose } = props;
  const { top } = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();

  const [hasQuery, setHasQuery] = useState(false);

  const dimensions = useMemo(
    () => getWavesDimensions(windowWidth),
    [windowWidth],
  );
  const {
    wavesSvgWidth,
    wavesSvgHeight,
    sprinkleSvgWidth,
    sprinkleSvgHeight,
    wavesOverlayHeight,
  } = dimensions;
  const listPaddingTop = wavesSvgHeight + theme.spacing.large * 2;

  const {
    searchProgress,
    scrollY,
    cardWrapperStyle,
    searchBarAnimatedStyle,
    handleClose,
  } = useMenuSearchAnimation({ onCloseComplete: onClose });

  const handleQueryChange = useCallback((q: boolean) => {
    setHasQuery(q);
  }, []);

  useMenuSearchKeyboardDismiss({
    hasQuery,
    onClose: handleClose,
  });

  return (
    <VStack
      position={{ left: 0, right: 0, bottom: 0, top: 0 }}
      style={styles.fill}
      backgroundColor={
        hasQuery ? theme.pallate.neutral['01'] : 'rgba(0,0,0,0.5)'
      }
    >
      <VStackAnimated style={[cardWrapperStyle, styles.cardWrap]}>
        <MenuSearchInner
          top={top}
          listPaddingTop={listPaddingTop}
          listContainerStyle={styles.listContentWrap}
          searchBarAnimatedStyle={searchBarAnimatedStyle}
          scrollY={scrollY}
          onClose={handleClose}
          onQueryChange={handleQueryChange}
        >
          <MenuSearchWavesOverlay
            wavesSvgWidth={wavesSvgWidth}
            wavesSvgHeight={wavesSvgHeight}
            sprinkleSvgWidth={sprinkleSvgWidth}
            sprinkleSvgHeight={sprinkleSvgHeight}
            wavesOverlayHeight={wavesOverlayHeight}
            searchProgress={searchProgress}
            scrollY={scrollY}
          />
        </MenuSearchInner>
      </VStackAnimated>
      {!hasQuery ? <VStack fill onTouchStart={handleClose} /> : null}
    </VStack>
  );
});

MenuSearchContent.displayName = 'MenuSearchContent';

export type { MenuSearchContentProps } from './menu-search-content.types';
