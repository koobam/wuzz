import { Flex, HStack, Pressable, theme } from '@components/atoms';
import Input from '@components/atoms/input';
import { IconX } from 'tabler-icons-react-native';
import { memo, useEffect, useState } from 'react';
import Animated from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';
import { SearchScrollList } from '../search-scroll-list';
import type { MenuSearchInnerProps } from './menu-search-inner.types';

const styles = StyleSheet.create({
  searchBarWrap: { zIndex: 1 },
});

export const MenuSearchInner = memo((props: MenuSearchInnerProps) => {
  const {
    top,
    listPaddingTop,
    listContainerStyle,
    searchBarAnimatedStyle,
    scrollY,
    onClose,
    onQueryChange,
    children,
  } = props;

  const [query, setQuery] = useState('');

  useEffect(() => {
    onQueryChange(query.length > 0);
  }, [query, onQueryChange]);

  return (
    <>
      <Animated.View style={[searchBarAnimatedStyle, styles.searchBarWrap]}>
        <HStack
          padding={{
            paddingTop: top + theme.spacing.standard,
            paddingBottom: theme.spacing.standard,
            paddingHorizontal: theme.spacing.standard,
          }}
          items="center"
          justify="center"
          spacing={theme.spacing.standard}
          backgroundColor={theme.pallate.coffee['03']}
        >
          <Flex fill>
            <Input
              placeholder="Search"
              cursorColor={theme.pallate.coffee['03']}
              selectionColor={theme.pallate.coffee['03']}
              placeholderTextColor={theme.pallate.neutral['04']}
              onChangeText={setQuery}
              autoFocus
            />
          </Flex>
          <Pressable
            width={40}
            height={40}
            items="center"
            justify="center"
            borderRadius={10}
            backgroundColor={theme.pallate.neutral['01']}
            onPress={onClose}
          >
            <IconX size={24} color={theme.pallate.coffee['03']} />
          </Pressable>
        </HStack>
      </Animated.View>
      <View style={listContainerStyle}>
        <SearchScrollList
          query={query}
          scrollY={scrollY}
          listPaddingTop={listPaddingTop}
        />
        {children}
      </View>
    </>
  );
});

MenuSearchInner.displayName = 'MenuSearchInner';

export type { MenuSearchInnerProps } from './menu-search-inner.types';
