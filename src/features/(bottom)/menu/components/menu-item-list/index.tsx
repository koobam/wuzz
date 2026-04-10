import {
  Box,
  Divider,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import { MenuEmptyPlaceholder } from '@assets/index';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { Fragment, memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, Image, StyleSheet, useWindowDimensions } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import type { MenuItem } from '../../types';
import { CATEGORY_LIST_WIDTH } from '../menu-category-list';
import { MenuBanner } from '../menu-banner';
import { MenuListEmpty } from '../menu-list-empty';
import type {
  FlatMenuRow,
  MenuItemListProps,
  MenuSectionItem,
} from './menu-item-list.types';

const ACTIVE_CATEGORY_DEBOUNCE_MS = 120;
/** Ignore viewability updates for this long after programmatic scroll (tap category). */
const IGNORE_VIEWABILITY_AFTER_SCROLL_MS = 400;

const styles = StyleSheet.create({
  listFill: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.spacing.standard,
    paddingBottom: theme.spacing.extraLarge,
    flexGrow: 1,
  },
  sectionHeader: {
    paddingVertical: theme.spacing.small,
    paddingHorizontal: theme.spacing.tiny,
  },
  menuPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 10,
  },
});

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
}

export const MenuItemList = memo((props: MenuItemListProps) => {
  const {
    items,
    searchQuery,
    categories,
    categoryListWidth = CATEGORY_LIST_WIDTH,
    onActiveCategoryChange,
    scrollToSectionRef,
    onScroll,
    onScrollEnd,
    scrollEventThrottle = 16,
    isError = false,
    onRetry,
    onRequestMenu,
    onClearSearch,
  } = props;

  const { width: windowWidth } = useWindowDimensions();
  const bannerWidth = useMemo(
    () =>
      Math.max(
        0,
        windowWidth - categoryListWidth - theme.spacing.standard * 2,
      ),
    [windowWidth, categoryListWidth],
  );

  const listRef = useRef<FlashListRef<FlatMenuRow>>(null);
  const lastActiveIdRef = useRef<string>('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const programmaticScrollUntilRef = useRef<number>(0);
  const onActiveCategoryChangeRef = useRef(onActiveCategoryChange);
  onActiveCategoryChangeRef.current = onActiveCategoryChange;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScroll?.(event);
    },
    [onScroll],
  );

  const filteredItems = searchQuery.trim()
    ? items.filter(
        i =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (i.description?.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : items;

  const groupedByCategory: MenuSectionItem[] = useMemo(
    () =>
      categories
        .map(cat => ({
          category: cat,
          items: filteredItems.filter(i => i.categoryId === cat.id),
        }))
        .filter(g => g.items.length > 0),
    [categories, filteredItems],
  );

  const flatData: FlatMenuRow[] = useMemo(() => {
    const rows: FlatMenuRow[] = [];
    groupedByCategory.forEach(group => {
      rows.push({ type: 'section', category: group.category });
      group.items.forEach((item, idx) => {
        rows.push({
          type: 'item',
          item,
          isLastInSection: idx === group.items.length - 1,
        });
      });
    });
    return rows;
  }, [groupedByCategory]);

  const scrollToSection = useCallback(
    (categoryId: string) => {
      const index = flatData.findIndex(
        row =>
          row.type === 'section' && row.category.id === categoryId,
      );
      if (index >= 0) {
        programmaticScrollUntilRef.current =
          Date.now() + IGNORE_VIEWABILITY_AFTER_SCROLL_MS;
        lastActiveIdRef.current = categoryId;
        onActiveCategoryChangeRef.current?.(categoryId);
        listRef.current?.scrollToIndex({
          index,
          animated: true,
        });
      }
    },
    [flatData],
  );

  useEffect(() => {
    if (scrollToSectionRef) {
      scrollToSectionRef.current = scrollToSection;
      return () => {
        scrollToSectionRef.current = null;
      };
    }
  }, [scrollToSection, scrollToSectionRef]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 10,
    minimumViewTime: 0,
  }).current;

  const handleViewableItemsChanged = useCallback(
    (info: { viewableItems: Array<{ item: FlatMenuRow }> }) => {
      if (Date.now() < programmaticScrollUntilRef.current) return;

      const first = info.viewableItems[0]?.item;
      const categoryId =
        first?.type === 'section'
          ? first.category.id
          : first?.type === 'item'
            ? first.item.categoryId
            : undefined;
      if (!categoryId || categoryId === lastActiveIdRef.current) return;

      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        debounceTimerRef.current = null;
        lastActiveIdRef.current = categoryId;
        onActiveCategoryChangeRef.current?.(categoryId);
      }, ACTIVE_CATEGORY_DEBOUNCE_MS);
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const renderMenuItem = useCallback(
    (item: MenuItem) => (
        <Pressable key={item.id} padding={{
          paddingVertical: theme.spacing.standard,
          paddingHorizontal: theme.spacing.small,
        }} spacing={theme.spacing.standard} items="center">
          <Image
            source={MenuEmptyPlaceholder}
            style={styles.menuPlaceholder}
            resizeMode="contain"
          />
          <VStack spacing={theme.spacing.small}>
            <Box>
              <Text
                type="b2"
                weight="semibold"
                text={item.name}
                color={theme.pallate.neutral['05']}
              />
              {item.description ? (
                <Text
                  type="l1"
                  text={item.description}
                  color={theme.pallate.neutral['04']}
                    numberOfLines={2}
                  />
                ) : null}
            </Box>
            <Text
              type="l1"
              weight="semibold"
              text={formatPrice(item.price)}
              color={theme.pallate.neutral['05']}
            />
          </VStack>
        </Pressable>
    ),
    [],
  );

  const renderRow = useCallback(
    ({ item }: { item: FlatMenuRow }) => {
      if (item.type === 'section') {
        return (
          <Text
            type="s2"
            padding={{
              paddingHorizontal: theme.spacing.tiny,
            }}
            weight="semibold"
            text={item.category.name}
            color={theme.pallate.neutral['05']}
          />
        );
      }
      return (
        <Fragment>
          {renderMenuItem(item.item)}
          {item.isLastInSection ? (
            <Divider
              thickness={StyleSheet.hairlineWidth}
              color={theme.pallate.neutral['03']}
              margin={{ marginVertical: theme.spacing.small }}
            />
          ) : null}
        </Fragment>
      );
    },
    [renderMenuItem],
  );

  const keyExtractor = useCallback((row: FlatMenuRow) => {
    if (row.type === 'section') return `section-${row.category.id}`;
    return `item-${row.item.id}`;
  }, []);

  const getItemType = useCallback((row: FlatMenuRow) => row.type, []);

  const listHeaderComponent = useMemo(
    () => (bannerWidth > 0 ? <MenuBanner width={bannerWidth} /> : null),
    [bannerWidth],
  );

  const handleScrollEnd = useCallback(() => {
    onScrollEnd?.();
  }, [onScrollEnd]);

  const isSearchEmpty = searchQuery.trim().length > 0;

  const listEmptyComponent = useMemo(
    () => (
      <MenuListEmpty
        isSearchEmpty={isSearchEmpty}
        isError={isError}
        onRetry={onRetry}
        onRequestMenu={onRequestMenu}
        onClearSearch={onClearSearch}
      />
    ),
    [
      isSearchEmpty,
      isError,
      onRetry,
      onRequestMenu,
      onClearSearch,
    ],
  );

  if (filteredItems.length === 0) {
    return (
      <FlashList
        ref={listRef}
        data={[]}
        renderItem={() => null}
        ListEmptyComponent={listEmptyComponent}
        style={styles.listFill}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
    );
  }

  return (
    <FlatList
      ref={listRef}
      data={flatData}
      renderItem={renderRow}
      keyExtractor={keyExtractor}
      getItemType={getItemType}
      ListHeaderComponent={listHeaderComponent}
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={handleViewableItemsChanged}
      onScroll={handleScroll}
      onMomentumScrollEnd={handleScrollEnd}
      onScrollEndDrag={handleScrollEnd}
      scrollEventThrottle={scrollEventThrottle}
      bounces={false}
      alwaysBounceVertical={false}
      overScrollMode="never"
      showsVerticalScrollIndicator
      keyboardShouldPersistTaps="handled"
    />
  );
});

MenuItemList.displayName = 'MenuItemList';

export type {
  FlatMenuRow,
  MenuItemListProps,
  MenuSectionItem,
} from './menu-item-list.types';
