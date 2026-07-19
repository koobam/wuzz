import { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Icon, Pressable, Text, theme } from '@components/atoms';
import type { CategoryCardProps } from './category-card.types';

const ICON_SIZE = 60;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  // Pull the icon up so it pokes above the card's top edge (no overflow clipping).
  icon: {
    marginTop: -ICON_SIZE / 1.7 - theme.spacing.tiny,
  },
});

export const CategoryCard = memo(
  ({ item, backgroundColor, rotation = 0, width, overlap, index, onPress }: CategoryCardProps) => (
    <Pressable
      direction="column"
      onPress={onPress}
      justify="center"
      items="center"
      opacity={0}
      width={width}
      rotation={rotation}
      margin={index === 0 ? undefined : { marginLeft: -overlap }}
      padding={theme.spacing.medium}
      borderWidth={2}
      borderColor={theme.pallate.neutral['01']}
      borderRadius={25}
      backgroundColor={backgroundColor}
      gap={theme.spacing.tiny}
      style={[styles.shadow, { zIndex: index }]}
    >
      <Icon
        icon={item.icon}
        size={ICON_SIZE}
        color={theme.pallate.neutral['01']}
        style={styles.icon}
      />
      <Text type="b2" color={theme.pallate.neutral['01']} weight="bold">
        {item.name}
      </Text>
    </Pressable>
  ),
);

CategoryCard.displayName = 'CategoryCard';
