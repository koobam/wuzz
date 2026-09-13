import {
  Flex,
  Pressable,
  Text,
  theme,
} from '@components/atoms';
import { memo, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { formatServicePriceSubtitle } from '../../utils/format';
import type { ServiceTypeCardProps } from './service-type-card.types';

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
    borderColor: 'transparent',
  },
  selectedBorder: {
    borderColor: theme.pallate.primary['03'],
  },
  badgeContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
  },
});

export const ServiceTypeCard = memo(function ServiceTypeCard({
  option,
  selected,
  onPress,
  cardWidth,
  hideKgLabel = false,
}: ServiceTypeCardProps) {
  const priceSubtitle = useMemo(
    () =>
      formatServicePriceSubtitle(
        option.extraPerKg,
        option.extraSatuan,
        hideKgLabel,
      ),
    [option.extraPerKg, option.extraSatuan, hideKgLabel],
  );

  return (
    <Pressable
      onPress={onPress}
      direction="column"
      items="center"
      padding={theme.spacing.standard}
      width={cardWidth}
      borderRadius={theme.spacing.standard}
      backgroundColor={theme.pallate.neutral['02']}
      style={[styles.card, selected && styles.selectedBorder]}
    >
      {option.promo != null && option.promo !== '' && (
        <Flex
          style={styles.badgeContainer}
          padding={{
            paddingHorizontal: theme.spacing.small,
            paddingVertical: theme.spacing.tiny,
          }}
          borderRadius={{
            borderTopRightRadius: theme.spacing.small,
            borderBottomLeftRadius: theme.spacing.small,
          }}
          backgroundColor={theme.pallate.primary['03']}
        >
          <Text type="l2" weight="semibold" color={theme.pallate.neutral['01']}>
            {option.promo}
          </Text>
        </Flex>
      )}
      <Flex
        width={56}
        height={56}
        items="center"
        justify="center"
        margin={{ marginBottom: theme.spacing.small }}
        borderRadius={theme.spacing.standard}
        backgroundColor={theme.pallate.primary['01']}
      >
        {option.icon}
      </Flex>
      <Text type="b2" weight="semibold" color={theme.pallate.neutral['05']}>
        {option.title}
      </Text>
      {priceSubtitle != null && priceSubtitle !== '' && (
        <Text type="l2" color={theme.pallate.neutral['04']}>
          {priceSubtitle}
        </Text>
      )}
    </Pressable>
  );
});

export type { ServiceTypeCardProps } from './service-type-card.types';
