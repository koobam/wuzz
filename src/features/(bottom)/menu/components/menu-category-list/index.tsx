import { Box, Pressable, Text, theme, VStack } from '@components/atoms';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { memo, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import type { MenuCategory } from '../../types';
import type { MenuCategoryListProps } from './menu-category-list.types';

const CATEGORY_ITEM_HEIGHT = 88;
const DUMMY_IMAGE_SIZE = 40;

const styles = StyleSheet.create({
  listContainer: {
    flexGrow: 0,
    backgroundColor: theme.pallate.neutral['02'],
    position: 'relative',
  },
  listFill: {
    flex: 1,
  },
  categoryItem: {
    position: 'relative',
    height: CATEGORY_ITEM_HEIGHT,
    paddingVertical: theme.spacing.standard,
    paddingHorizontal: theme.spacing.standard,
  },
  categoryItemActive: {
    backgroundColor: theme.pallate.neutral['01'],
  },
  categoryItemInner: {
    flex: 1,
  },
  dummyImage: {
    width: DUMMY_IMAGE_SIZE,
    height: DUMMY_IMAGE_SIZE,
    borderRadius: 8,
    backgroundColor: theme.pallate.neutral['03'],
  },
});

const CATEGORY_LIST_WIDTH = 90;

const keyExtractor = (item: MenuCategory) => item.id;

export const MenuCategoryList = memo((props: MenuCategoryListProps) => {
  const { categories, selectedCategoryId, onSelectCategory, listRef } = props;

  const renderItem = useCallback(
    ({ item }: { item: MenuCategory }) => {
      const isActive = selectedCategoryId === item.id;
      return (
        <Pressable
          onPress={() => onSelectCategory(item.id)}
          style={styles.categoryItem}
        >
          <VStack spacing={theme.spacing.tiny} items="center" style={styles.categoryItemInner}>
            <Box style={styles.dummyImage} />
            <Text
              type="l2"
              weight={isActive ? 'semibold' : 'regular'}
              text={item.name}
              align="center"
              color={
                isActive
                  ? theme.pallate.coffee['03']
                  : theme.pallate.neutral['04']
              }
              numberOfLines={2}
            />
          </VStack>
        </Pressable>
      );
    },
    [selectedCategoryId, onSelectCategory],
  );

  const contentContainerStyle = useMemo(
    () => ({ paddingBottom: theme.spacing.large }),
    [],
  );

  return (
    <Box width={CATEGORY_LIST_WIDTH} borderWidth={{
      borderRightWidth: 1,
    }} borderColor={theme.pallate.neutral['02']}>
      <FlashList
        ref={listRef}
        data={categories}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        style={styles.listFill}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </Box>
  );
});

MenuCategoryList.displayName = 'MenuCategoryList';

export { CATEGORY_ITEM_HEIGHT, CATEGORY_LIST_WIDTH };
export type { MenuCategoryListProps } from './menu-category-list.types';
