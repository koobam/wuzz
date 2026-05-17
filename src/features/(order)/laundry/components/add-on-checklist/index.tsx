import {
  Box,
  Flex,
  HStack,
  Icon,
  Pressable,
  Text,
  theme,
  VStack,
} from '@components/atoms';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import type { ChecklistOption } from '../../types';
import {
  ADD_ON_OPTIONS,
  ADD_ON_OPTIONAL_LABEL,
  ADD_ON_SECTION_TITLE,
  ADD_ON_SELECTION_HINT_MULTIPLE,
  ADD_ON_SELECTION_HINT_SINGLE,
} from '../../utils';
import { formatAddOnPriceSubtitle, formatPriceRupiah } from '../../utils/format';
import type { AddOnChecklistProps } from './add-on-checklist.types';

const styles = StyleSheet.create({
  dummyIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.spacing.small,
    backgroundColor: theme.pallate.neutral['03'],
  },
  row: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowSelected: {
    borderColor: theme.pallate.primary['03'],
  },
  priceRight: {
    marginLeft: theme.spacing.small,
  },
});

export const AddOnChecklist = memo(function AddOnChecklist({
  options: optionsProp,
  selectedIds: controlledSelectedIds,
  onSelectionChange,
  title = ADD_ON_SECTION_TITLE,
  optionalLabel = ADD_ON_OPTIONAL_LABEL,
  selectionHint,
  selectionMode = 'multiple',
  canOptOut = true,
}: AddOnChecklistProps) {
  const options = useMemo(
    () => optionsProp ?? ADD_ON_OPTIONS,
    [optionsProp],
  );

  const defaultSelectedIds = useMemo(() => {
    if (!canOptOut && options.length > 0) {
      return new Set<string>([options[0].id]);
    }
    return new Set(options.filter(opt => opt.free === true).map(opt => opt.id));
  }, [options, canOptOut]);

  const [internalSelectedIds, setInternalSelectedIds] = useState<Set<string>>(
    () => defaultSelectedIds,
  );

  const selectedIds = useMemo(
    () =>
      controlledSelectedIds !== undefined
        ? new Set(controlledSelectedIds)
        : internalSelectedIds,
    [controlledSelectedIds, internalSelectedIds],
  );

  const hintText = useMemo(
    () =>
      selectionHint ??
      (selectionMode === 'single'
        ? ADD_ON_SELECTION_HINT_SINGLE
        : ADD_ON_SELECTION_HINT_MULTIPLE),
    [selectionHint, selectionMode],
  );

  const optionalOrRequiredLabel = canOptOut ? optionalLabel : 'Wajib';

  const handleToggle = useCallback(
    (opt: ChecklistOption) => {
      const id = opt.id;
      const checked = selectedIds.has(id);

      if (opt.free === true && checked && canOptOut) {
        Toast.show({
          type: 'info',
          text1: 'Layanan gratis',
          text2: 'Layanan ini gratis dan selalu termasuk dalam pesanan.',
        });
        return;
      }

      const next = new Set(selectedIds);
      if (next.has(id)) {
        if (!canOptOut && next.size <= 1) return;
        next.delete(id);
      } else {
        if (selectionMode === 'single' && opt.free !== true) {
          options.forEach(o => {
            if (o.free !== true && o.id !== id) next.delete(o.id);
          });
        }
        next.add(id);
      }
      const nextArray = Array.from(next);
      if (controlledSelectedIds === undefined) {
        setInternalSelectedIds(next);
      }
      onSelectionChange?.(nextArray);
    },
    [
      controlledSelectedIds,
      selectedIds,
      onSelectionChange,
      selectionMode,
      options,
      canOptOut,
    ],
  );

  const optionsRef = useRef(options);
  const canOptOutRef = useRef(canOptOut);
  useEffect(() => {
    if (
      (optionsRef.current !== options || canOptOutRef.current !== canOptOut) &&
      controlledSelectedIds === undefined
    ) {
      optionsRef.current = options;
      canOptOutRef.current = canOptOut;
      setInternalSelectedIds(
        !canOptOut && options.length > 0
          ? new Set([options[0].id])
          : new Set(options.filter(opt => opt.free === true).map(opt => opt.id)),
      );
    }
  }, [options, canOptOut, controlledSelectedIds]);

  return (
    <VStack
      padding={{ paddingHorizontal: theme.spacing.large }}
      gap={theme.spacing.standard}
    >
      <HStack items="center" justify="space-between">
        <VStack fill>
          <Text type="s3" weight="semibold" color={theme.pallate.neutral['05']}>
            {title}
          </Text>
          <HStack items="center" gap={theme.spacing.small}>
            <Text type="l1" color={theme.pallate.neutral['04']}>
              {optionalOrRequiredLabel}
            </Text>
            <Box width={2} height={2} backgroundColor={theme.pallate.neutral['04']} />
            <Text type="l1" color={theme.pallate.neutral['04']}>
              {hintText}
            </Text>
          </HStack>
        </VStack>
      </HStack>
      <VStack gap={theme.spacing.standard}>
        {options.map(opt => {
          const checked = selectedIds.has(opt.id);
          return (
            <Pressable
              key={opt.id}
              onPress={() => handleToggle(opt)}
              direction="row"
              items="center"
              padding={theme.spacing.standard}
              gap={theme.spacing.standard}
              borderRadius={theme.spacing.standard}
              backgroundColor={theme.pallate.neutral['02']}
              borderColor={checked ? theme.pallate.primary['03'] : theme.pallate.neutral['03']}
              borderWidth={1}
            >
              <Flex items="center" justify="center" width={40} height={40} borderRadius={theme.spacing.small}>
                <Icon icon={opt.icon} size={34} color={theme.pallate.primary['03']} />
              </Flex>
              <VStack fill>
                <Text
                  type="b2"
                  weight="medium"
                  color={theme.pallate.neutral['05']}
                >
                  {opt.label}
                </Text>
                {opt.description != null && (
                  <Text type="l2" color={theme.pallate.neutral['04']}>
                    {opt.description}
                  </Text>
                )}
              </VStack>
              {(opt.free === true ||
                (opt.extraPerKg != null && opt.extraPerKg > 0) ||
                opt.price != null ||
                opt.priceSubtitle != null) && (
                <Text
                  type="l1"
                  weight="medium"
                  color={theme.pallate.neutral['05']}
                  style={styles.priceRight}
                >
                  {opt.free === true
                    ? 'Gratis'
                    : opt.extraPerKg != null && opt.extraPerKg > 0
                      ? formatAddOnPriceSubtitle(opt.extraPerKg)
                      : opt.price != null
                        ? formatPriceRupiah(opt.price)
                        : opt.priceSubtitle ?? ''}
                </Text>
              )}
            </Pressable>
          );
        })}
      </VStack>
    </VStack>
  );
});

export type { AddOnChecklistProps } from './add-on-checklist.types';
