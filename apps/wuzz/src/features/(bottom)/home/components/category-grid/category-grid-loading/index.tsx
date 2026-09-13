import { memo } from 'react';
import { Flex, theme } from '@components/atoms';
import { ActivityIndicator, StyleSheet } from 'react-native';
import type { CategoryGridLoadingProps } from './category-grid-loading.types';

const styles = StyleSheet.create({
  loadingRow: {
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const CategoryGridLoading = memo((_props: CategoryGridLoadingProps) => (
  <Flex style={styles.loadingRow}>
    <ActivityIndicator size="small" color={theme.pallate.primary['03']} />
  </Flex>
));

CategoryGridLoading.displayName = 'CategoryGridLoading';
