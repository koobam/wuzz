import { EmptyStatePlaceholder } from '@components/molecules';
import { MenuEmptyPlaceholder } from '@assets/index';
import { memo, useMemo } from 'react';
import { Image, StyleSheet } from 'react-native';
import { MENU_EMPTY } from '../../utils/constants';
import type { MenuListEmptyProps } from './menu-list-empty.types';

const styles = StyleSheet.create({
  icon: {
    width: 120,
    height: 120,
  },
});

export const MenuListEmpty = memo((props: MenuListEmptyProps) => {
  const {
    isSearchEmpty,
    isError = false,
    onRetry,
    onRequestMenu,
    onClearSearch,
  } = props;

  const icon = useMemo(
    () => (
      <Image
        source={MenuEmptyPlaceholder}
        style={styles.icon}
        resizeMode="contain"
      />
    ),
    [],
  );

  const content = useMemo(() => {
    if (isSearchEmpty) {
      return (
        <EmptyStatePlaceholder
          icon={icon}
          title={MENU_EMPTY.search.title}
          description={MENU_EMPTY.search.description}
          primaryButton={
            onClearSearch
              ? {
                  label: MENU_EMPTY.search.clearSearchLabel,
                  onPress: onClearSearch,
                }
              : undefined
          }
        />
      );
    }

    const title = isError ? MENU_EMPTY.error.title : MENU_EMPTY.data.title;
    const description = isError
      ? MENU_EMPTY.error.description
      : MENU_EMPTY.data.description;
    const refreshLabel = isError
      ? MENU_EMPTY.error.refreshLabel
      : MENU_EMPTY.data.refreshLabel;
    const requestMenuLabel = isError
      ? MENU_EMPTY.error.requestMenuLabel
      : MENU_EMPTY.data.requestMenuLabel;

    return (
      <EmptyStatePlaceholder
        icon={icon}
        title={title}
        description={description}
        primaryButton={
          onRetry ? { label: refreshLabel, onPress: onRetry } : undefined
        }
        secondaryButton={
          onRequestMenu
            ? { label: requestMenuLabel, onPress: onRequestMenu }
            : undefined
        }
      />
    );
  }, [
    isSearchEmpty,
    isError,
    icon,
    onRetry,
    onRequestMenu,
    onClearSearch,
  ]);

  return content;
});

MenuListEmpty.displayName = 'MenuListEmpty';

export type { MenuListEmptyProps } from './menu-list-empty.types';
