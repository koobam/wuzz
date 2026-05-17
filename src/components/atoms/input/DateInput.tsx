import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '../text';
import { Input, InputProps } from './index';
import theme from '../theme';
import { DateWheelPicker } from './DateWheelPicker';

const DEFAULT_DATE = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 20);
  return d;
})();

function formatDate(date: Date): string {
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export interface DateInputRef {
  close: () => void;
}

export interface DateInputProps extends Omit<InputProps, 'value' | 'onChangeText' | 'onChange' | 'type'> {
  value?: Date | null;
  onChange?: (date: Date) => void;
  placeholder?: string;
}

export const DateInput = forwardRef<DateInputRef, DateInputProps>(({
  value,
  onChange,
  placeholder = 'Pilih tanggal lahir',
  label,
  error,
  disabled,
  ...rest
}, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [internalDate, setInternalDate] = useState<Date>(value ?? DEFAULT_DATE);

  useImperativeHandle(ref, () => ({
    close: () => setIsEditing(false),
  }));

  const handlePress = useCallback(() => {
    if (!disabled) setIsEditing(true);
  }, [disabled]);

  const handleChange = useCallback((date: Date) => {
    setInternalDate(date);
    onChange?.(date);
  }, [onChange]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setInternalDate(value ?? DEFAULT_DATE);
  }, [value]);

  if (isEditing) {
    return (
        <DateWheelPicker
          value={internalDate}
          onChange={handleChange}
        />
    );
  }

  return (
    <Pressable onPress={handlePress}>
      <View pointerEvents="none">
        <Input
          label={label}
          value={value ? formatDate(value) : ''}
          placeholder={placeholder}
          editable={false}
          error={error}
          disabled={disabled}
          {...rest}
        />
      </View>
    </Pressable>
  );
});

DateInput.displayName = 'DateInput';

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: theme.spacing.small,
    paddingBottom: theme.spacing.small,
  },
});

export default DateInput;
