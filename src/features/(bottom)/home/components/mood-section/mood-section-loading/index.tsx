import { HStack, Shimmer, theme, VStack } from '@components/atoms';
import { memo } from 'react';
import { Dimensions, StyleSheet } from 'react-native';

const PILL_HEIGHT = 48;
const ITEM_TOP_WIDTH =
  Dimensions.get('screen').width / 3 - theme.spacing.standard * 2;

const styles = StyleSheet.create({
  pill: {
    marginHorizontal: theme.spacing.tiny,
  },
  row: {
    marginBottom: theme.spacing.small,
  },
});

export const MoodSectionLoading = memo(() => (
  <VStack spacing={0}>
    <HStack items="center" justify="space-between" style={styles.row}>
      <Shimmer
        width={ITEM_TOP_WIDTH}
        height={PILL_HEIGHT}
        borderRadius={50}
        style={styles.pill}
      />
      <Shimmer
        width={ITEM_TOP_WIDTH}
        height={PILL_HEIGHT}
        borderRadius={50}
        style={styles.pill}
      />
      <Shimmer
        width={ITEM_TOP_WIDTH}
        height={PILL_HEIGHT}
        borderRadius={50}
        style={styles.pill}
      />
    </HStack>
    <HStack items="center" justify="center" style={styles.row}>
      <Shimmer
        width={ITEM_TOP_WIDTH}
        height={PILL_HEIGHT}
        borderRadius={50}
        style={styles.pill}
      />
      <Shimmer
        width={ITEM_TOP_WIDTH}
        height={PILL_HEIGHT}
        borderRadius={50}
        style={styles.pill}
      />
    </HStack>
  </VStack>
));

MoodSectionLoading.displayName = 'MoodSectionLoading';
