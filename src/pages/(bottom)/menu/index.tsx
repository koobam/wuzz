import { Box, HStack, Icon, Text, theme, VStack } from '@components/atoms';
import {
  CATEGORY_LIST_WIDTH,
  FloatingDraggable,
  MenuCategoryList,
  MenuHeader,
  MenuItemList,
  MENU_CATEGORIES,
  useMenuData,
  useMenuHeaderCollapse,
} from '@features/(bottom)/menu';
import { useOutletListData } from '@features/(outlet)/outlet-list';
import type { FlashListRef } from '@shopify/flash-list';
import type { MenuCategory } from '@features/(bottom)/menu/types';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { MenuScreenProps } from '@features/(bottom)/menu/types';
import { useBottomNavHeight } from '@services/contexts/bottom-nav-height';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FLOAT_SIZE = 100;
const FLOAT_EDGE_MARGIN = 16;

const styles = StyleSheet.create({
  floatButton: {
    width: FLOAT_SIZE,
    height: FLOAT_SIZE,
    borderRadius: FLOAT_SIZE / 2,
    backgroundColor: theme.pallate.primary['03'],
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.elevations[8],
  },
});

export const Menu = memo((props: MenuScreenProps) => {
  const { navigation } = props;
  const { top } = useSafeAreaInsets();
  const { navHeight } = useBottomNavHeight();
  const { outletList } = useOutletListData();
  const { items: menuItems, isError: menuError, refetch: refetchMenu } = useMenuData();

  const showCategoryList =
    !menuError && menuItems.length > 0;

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    () => MENU_CATEGORIES[0]?.id ?? null,
  );

  const scrollToSectionRef = useRef<((categoryId: string) => void) | null>(null);
  const categoryListRef = useRef<FlashListRef<MenuCategory> | null>(null);
  const { collapseProgress, scrollHandler, scrollEndHandler } = useMenuHeaderCollapse();

  const selectedIndex = useMemo(
    () => MENU_CATEGORIES.findIndex((c) => c.id === selectedCategoryId),
    [selectedCategoryId],
  );

  useEffect(() => {
    if (selectedIndex >= 0) {
      categoryListRef.current?.scrollToIndex({
        index: selectedIndex,
        animated: true,
      });
    }
  }, [selectedIndex]);

  const defaultOutlet = outletList[0] ?? null;

  const handleOutletPress = useCallback(() => {
    navigation.navigate('outletlist');
  }, [navigation]);

  const handleSearchPress = useCallback(() => {
    navigation.navigate('menusearch');
  }, [navigation]);

  const handleSelectCategory = useCallback((id: string) => {
    setSelectedCategoryId(id);
    scrollToSectionRef.current?.(id);
  }, []);

  const handleActiveCategoryChange = useCallback((id: string) => {
    setSelectedCategoryId(id);
  }, []);

  return (
    <VStack fill>
      <MenuHeader
        topInset={top}
        outletName={defaultOutlet?.name}
        outletAddress={defaultOutlet?.address}
        distanceKm={defaultOutlet?.distanceKm}
        outletServices={defaultOutlet?.services}
        onOutletPress={handleOutletPress}
        onSearchPress={handleSearchPress}
        collapseProgress={collapseProgress}
      />
      <HStack fill>
        {showCategoryList && (
          <MenuCategoryList
            categories={MENU_CATEGORIES}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={handleSelectCategory}
            listRef={categoryListRef}
          />
        )}
        <MenuItemList
          items={menuItems}
          searchQuery=""
          selectedCategoryId={selectedCategoryId}
          categories={MENU_CATEGORIES}
          categoryListWidth={showCategoryList ? CATEGORY_LIST_WIDTH : 0}
          onActiveCategoryChange={handleActiveCategoryChange}
          scrollToSectionRef={scrollToSectionRef}
          onScroll={scrollHandler}
          onScrollEnd={scrollEndHandler}
          scrollEventThrottle={16}
          isError={menuError}
          onRetry={refetchMenu}
          onRequestMenu={refetchMenu}
        />
      </HStack>
      <FloatingDraggable
        boxWidth={FLOAT_SIZE}
        boxHeight={FLOAT_SIZE}
        edgeMargin={FLOAT_EDGE_MARGIN}
        initialX={SCREEN_WIDTH - FLOAT_SIZE - FLOAT_EDGE_MARGIN}
        initialY={SCREEN_HEIGHT * 0.65}
        minY={top}
        maxY={SCREEN_HEIGHT - navHeight}
      >
        <VStack spacing={theme.spacing.small} width={FLOAT_SIZE} height={FLOAT_SIZE} items="center" justify="center" fill backgroundColor={theme.pallate.neutral['01']}>
          <Box width={FLOAT_SIZE} height={50} backgroundColor={theme.pallate.neutral['02']} />
          <Text type="l2" align="center" weight="stylized" text={`Custom\nYour Coffee`} />
        </VStack>
      </FloatingDraggable>
    </VStack>
  );
});

Menu.displayName = 'Menu';
export default Menu;
