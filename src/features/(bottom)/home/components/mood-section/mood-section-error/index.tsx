import { memo } from 'react';
import { Text, theme } from '@components/atoms';
import { StyleSheet } from 'react-native';
import type { MoodSectionErrorProps } from './mood-section-error.types';

const styles = StyleSheet.create({
  errorText: {
    marginTop: theme.spacing.small,
  },
});

export const MoodSectionError = memo(({ message }: MoodSectionErrorProps) => (
  <Text type="l2" color={theme.pallate.danger['03']} style={styles.errorText}>
    {message}
  </Text>
));

MoodSectionError.displayName = 'MoodSectionError';
