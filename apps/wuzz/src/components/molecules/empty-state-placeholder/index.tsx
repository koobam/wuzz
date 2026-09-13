import { Box, Button, HStack, Text, theme, VStack } from '@components/atoms';
import { memo, useMemo } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

const DEFAULT_ICON_SIZE = 120;

const styles = StyleSheet.create({
  iconWrap: {
    width: DEFAULT_ICON_SIZE,
    height: DEFAULT_ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export interface EmptyStatePlaceholderProps {
  /**
   * Icon above title. Can be SVG or Image:
   * - SVG: <WoozlyMascot width={120} height={120} />
   * - Image: <Image source={require('...')} style={{ width: 120, height: 120 }} resizeMode="contain" />
   */
  icon: React.ReactNode;
  title: string;
  description?: string;
  /** Optional wrapper style (e.g. padding for list empty). */
  style?: ViewStyle;
  /** Icon container size (default 120). */
  iconSize?: number;
  /** Primary action (single button or first of two). */
  primaryButton?: { label: string; onPress: () => void };
  /** Secondary action (only shown when primaryButton is set; renders next to primary). */
  secondaryButton?: { label: string; onPress: () => void };
}

export const EmptyStatePlaceholder = memo(
  (props: EmptyStatePlaceholderProps) => {
    const {
      icon,
      title,
      description,
      style,
      iconSize = DEFAULT_ICON_SIZE,
      primaryButton,
      secondaryButton,
    } = props;

    const iconWrapStyle = useMemo(
      () => [styles.iconWrap, { width: iconSize, height: iconSize }],
      [iconSize],
    );

    const buttonsNode = useMemo(() => {
      if (!primaryButton) return null;
      const primary = (
        <Button
          variant="primary"
          size="md"
          rounded
          onPress={primaryButton.onPress}
        >
          <Text type="b2" weight="semibold" color={theme.pallate.neutral['01']}>
            {primaryButton.label}
          </Text>
        </Button>
      );
      if (secondaryButton) {
        return (
          <HStack
            width="100%"
            padding={{ paddingHorizontal: theme.spacing.large }}
            gap={theme.spacing.standard}
            items="center"
            justify="center"
          >
            {primary}
            <Button
              variant="outline"
              size="md"
              rounded
              onPress={secondaryButton.onPress}
            >
              <Text
                type="b2"
                weight="semibold"
                color={theme.pallate.neutral['05']}
              >
                {secondaryButton.label}
              </Text>
            </Button>
          </HStack>
        );
      }
      return primary;
    }, [primaryButton, secondaryButton]);

    return (
      <VStack
        padding={{
          paddingHorizontal: theme.spacing.large,
          paddingVertical: theme.spacing.extraLarge,
        }}
        gap={theme.spacing.standard}
        items="center"
        justify="center"
        style={style}
      >
        <Box style={iconWrapStyle}>{icon}</Box>
        <Box>
          <Text
            type="b1"
            weight="semibold"
            text={title}
            color={theme.pallate.neutral['05']}
            align="center"
          />
          {description ? (
            <Text
              type="l1"
              text={description}
              color={theme.pallate.neutral['04']}
              align="center"
            />
          ) : null}
        </Box>
        {buttonsNode}
      </VStack>
    );
  },
);

EmptyStatePlaceholder.displayName = 'EmptyStatePlaceholder';
