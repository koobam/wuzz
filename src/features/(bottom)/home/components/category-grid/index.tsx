import { memo, useMemo } from 'react';
import { HStack, Text, theme, VStack } from '@components/atoms';
import type { CategoryGridProps } from './category-grid.types';
import { CategoryCard } from './category-card';
import { CategoryGridError } from './category-grid-error';
import { CategoryGridLoading } from './category-grid-loading';
import { useTranslation } from 'react-i18next';

export const CategoryGrid = memo(
  ({
    onCategoryPress,
    items: itemsProp,
    isLoading = false,
    isError = false,
    error,
  }: CategoryGridProps) => {
    const { t } = useTranslation("home");
    const items = itemsProp;
    const errorMessage = useMemo(() => {
      if (error instanceof Error) return error.message;
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error
      ) {
        return String((error as { message?: string }).message);
      }
      if (isError) return 'Gagal memuat layanan';
      return null;
    }, [error, isError]);

    return (
      <VStack
        spacing={theme.spacing.standard}
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingBottom: theme.spacing.large,
        }}
      >
        <VStack>
          <Text type="s2" weight="semibold">
            {t('category.title')}
          </Text>
          <Text type="l1" color={theme.pallate.neutral['04']}>
            {t('category.description')}
          </Text>
        </VStack>
        {isLoading ? (
          <CategoryGridLoading />
        ) : (
          <HStack items="flex-start" spacing={theme.spacing.standard}>
            {items.map((item) => (
              <CategoryCard
                key={item.name}
                item={item}
                onPress={() => onCategoryPress(item)}
              />
            ))}
          </HStack>
        )}
        {isError && errorMessage ? (
          <CategoryGridError message={errorMessage} />
        ) : null}
      </VStack>
    );
  },
);

CategoryGrid.displayName = 'CategoryGrid';
