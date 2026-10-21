import { Button, HStack, Icon, Text, theme, VStack } from '@components/atoms';
import { useOrderDraft, type OrderDraftItem } from '@services/contexts';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/root/root.types';
import { Add, Minus } from 'iconsax-react-native';
import { memo, useCallback } from 'react';
import { Pressable as RNPressable, StyleSheet, View } from 'react-native';
import { EstimateNotice } from '../estimate-notice';
import { formatPriceRupiah } from '@features/(order)/laundry/utils/format';

type LineProps = {
  item: OrderDraftItem;
  isLast: boolean;
  onEdit: (item: OrderDraftItem) => void;
  onRemove: (id: string) => void;
  onStep: (item: OrderDraftItem, step: number) => void;
};

/**
 * One line of the order with everything the customer can still do to it, laid out
 * as in the Reddog checkout: the line and its price, then "Edit" and "Hapus" at
 * the left and the quantity stepper at the right. A review screen that only lists
 * what is about to be bought sends anyone who spots a mistake back a screen.
 */
const OrderLine = memo(function OrderLine({
  item,
  isLast,
  onEdit,
  onRemove,
  onStep,
}: LineProps) {
  const quantity = item.quantity ?? 1;
  const atMinimum = quantity <= (item.minQuantity ?? 1);
  const atMaximum = quantity >= (item.maxQuantity ?? 99);
  const handleEdit = useCallback(() => onEdit(item), [onEdit, item]);
  const handleRemove = useCallback(
    () => onRemove(item.id),
    [onRemove, item.id],
  );
  const handleDecrement = useCallback(() => onStep(item, -1), [onStep, item]);
  const handleIncrement = useCallback(() => onStep(item, 1), [onStep, item]);

  return (
    <VStack
      gap={theme.spacing.small}
      padding={{ paddingVertical: theme.spacing.medium }}
      style={isLast ? undefined : styles.line}
    >
      <HStack gap={theme.spacing.standard} style={styles.head}>
        {/* The service's icon on a plain tile, the same icons as the Home grid. */}
        <View style={styles.thumb}>
          {item.icon ? (
            <Icon
              icon={item.icon}
              size={THUMB_SIZE - 12}
              color={theme.pallate.neutral['01']}
            />
          ) : null}
        </View>
        <VStack fill style={styles.text}>
          <Text type="b2" weight="bold" numberOfLines={1}>
            {item.name}
          </Text>
          <Text numberOfLines={2} type="l1" color={theme.pallate.neutral['04']}>
            {[item.tierName, ...item.addOns].filter(Boolean).join(' · ')}
          </Text>
        </VStack>
        <VStack items="flex-end">
          <Text type="l1" weight="bold">
            {formatPriceRupiah(item.price * quantity)}
          </Text>
          {item.unit ? (
            <Text type="l2" color={theme.pallate.neutral['04']}>
              {`${quantity} ${item.unit} × ${formatPriceRupiah(item.price)}`}
            </Text>
          ) : null}
        </VStack>
      </HStack>

      <HStack items="center">
        <HStack gap={theme.spacing.small} fill>
          <Button rounded size="sm" variant="default" onPress={handleEdit}>
            <Text
              type="l1"
              weight="semibold"
              color={theme.pallate.neutral['05']}
              text="Edit"
            />
          </Button>
          <Button rounded size="sm" variant="default" onPress={handleRemove}>
            <Text
              type="l1"
              weight="semibold"
              color={theme.pallate.neutral['05']}
              text="Hapus"
            />
          </Button>
        </HStack>

        <HStack items="center" gap={theme.spacing.standard}>
          {/* At the lowest amount there is nowhere down to go; "Hapus" removes the
              line. Dimmed and inert rather than hidden: a control that vanishes
              moves the two beside it. */}
          <RNPressable
            style={atMinimum ? styles.stepDisabled : styles.step}
            onPress={handleDecrement}
            disabled={atMinimum}
            hitSlop={6}
          >
            <Minus size={18} color={theme.pallate.neutral['05']} />
          </RNPressable>
          <Text type="b1" weight="bold" color={theme.pallate.neutral['05']}>
            {item.unit ? `${quantity} ${item.unit}` : String(quantity)}
          </Text>
          <RNPressable
            style={atMaximum ? styles.stepDisabled : styles.step}
            onPress={handleIncrement}
            disabled={atMaximum}
            hitSlop={6}
          >
            <Add size={18} color={theme.pallate.neutral['05']} />
          </RNPressable>
        </HStack>
      </HStack>
      {item.unit === 'kg' ? <EstimateNotice /> : null}
    </VStack>
  );
});

export const PurchaseListSection = memo(function PurchaseListSection() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { items, removeItem, setQuantity } = useOrderDraft();

  // Opens the service again with this line's choices; saving there replaces the
  // line rather than adding another.
  const handleEdit = useCallback(
    (item: OrderDraftItem) => {
      navigation.navigate('laundry', {
        serviceId: item.serviceId,
        editId: item.id,
      });
    },
    [navigation],
  );

  const handleStep = useCallback(
    (item: OrderDraftItem, step: number) => {
      setQuantity(item.id, (item.quantity ?? 1) + step);
    },
    [setQuantity],
  );

  if (items.length === 0) {
    return (
      <Text
        type="l1"
        color={theme.pallate.neutral['04']}
        padding={{ paddingVertical: theme.spacing.large }}
      >
        Belum ada layanan yang dipilih.
      </Text>
    );
  }

  return (
    <VStack>
      {items.map((item, index) => (
        <OrderLine
          key={item.id}
          item={item}
          isLast={index === items.length - 1}
          onEdit={handleEdit}
          onRemove={removeItem}
          onStep={handleStep}
        />
      ))}
    </VStack>
  );
});

export type { PurchaseItem } from './purchase-list-section.types';

/** Small: it identifies the service, it is not a hero picture. */
const THUMB_SIZE = 56;

const stepButton = {
  width: 28,
  height: 28,
  borderRadius: 999,
  borderCurve: 'continuous',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.pallate.neutral['02'],
} as const;

const styles = StyleSheet.create({
  line: {
    borderBottomWidth: 1,
    borderBottomColor: theme.pallate.neutral['03'],
  },
  head: { alignItems: 'flex-start' },
  text: { minWidth: 0 },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 10,
    borderCurve: 'continuous',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.pallate.neutral['02'],
  },
  step: stepButton,
  stepDisabled: { ...stepButton, opacity: 0.4 },
});
