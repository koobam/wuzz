import { memo } from 'react';
import { Text, theme } from '@components/atoms';
import { StyleSheet } from 'react-native';
import type { CategoryGridErrorProps } from './category-grid-error.types';

const styles = StyleSheet.create({
  errorText: {
    marginTop: theme.spacing.small,
  },
});

export const CategoryGridError = memo(({ message }: CategoryGridErrorProps) => (
  <Text
    type="l2"
    color={theme.pallate.danger['03']}
    style={styles.errorText}
  >
    {message}
  </Text>
));

CategoryGridError.displayName = 'CategoryGridError';
