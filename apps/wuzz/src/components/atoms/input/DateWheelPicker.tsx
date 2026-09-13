import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WheelPicker } from './WheelPicker';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const CURRENT_YEAR = new Date().getFullYear();
const MAX_YEAR = CURRENT_YEAR - 13;
const MIN_YEAR = CURRENT_YEAR - 100;

const YEARS = Array.from(
  { length: MAX_YEAR - MIN_YEAR + 1 },
  (_, i) => String(MAX_YEAR - i),
);

function getDaysInMonth(monthIndex: number, year: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function buildDays(monthIndex: number, year: number): string[] {
  return Array.from(
    { length: getDaysInMonth(monthIndex, year) },
    (_, i) => String(i + 1).padStart(2, '0'),
  );
}

export interface DateWheelPickerProps {
  value: Date;
  onChange: (date: Date) => void;
  overlayColor?: string;
}

export const DateWheelPicker = ({ value, onChange, overlayColor }: DateWheelPickerProps) => {
  const [monthIndex, setMonthIndex] = useState(value.getMonth());
  const [yearIndex, setYearIndex] = useState(() => {
    const idx = YEARS.indexOf(String(value.getFullYear()));
    return idx >= 0 ? idx : 0;
  });
  const [dayIndex, setDayIndex] = useState(value.getDate() - 1);

  const selectedYear = parseInt(YEARS[yearIndex], 10);

  const days = useMemo(
    () => buildDays(monthIndex, selectedYear),
    [monthIndex, selectedYear],
  );

  const safeDayIndex = Math.min(dayIndex, days.length - 1);

  const emit = useCallback(
    (di: number, mi: number, yi: number) => {
      const year = parseInt(YEARS[yi], 10);
      const maxDay = getDaysInMonth(mi, year);
      const clampedDay = Math.min(di, maxDay - 1);
      onChange(new Date(year, mi, clampedDay + 1));
    },
    [onChange],
  );

  const handleDayChange = useCallback(
    (index: number) => {
      setDayIndex(index);
      emit(index, monthIndex, yearIndex);
    },
    [monthIndex, yearIndex, emit],
  );

  const handleMonthChange = useCallback(
    (index: number) => {
      const year = parseInt(YEARS[yearIndex], 10);
      const maxDay = getDaysInMonth(index, year);
      const newDay = Math.min(safeDayIndex, maxDay - 1);
      setMonthIndex(index);
      setDayIndex(newDay);
      emit(newDay, index, yearIndex);
    },
    [yearIndex, safeDayIndex, emit],
  );

  const handleYearChange = useCallback(
    (index: number) => {
      const year = parseInt(YEARS[index], 10);
      const maxDay = getDaysInMonth(monthIndex, year);
      const newDay = Math.min(safeDayIndex, maxDay - 1);
      setYearIndex(index);
      setDayIndex(newDay);
      emit(newDay, monthIndex, index);
    },
    [monthIndex, safeDayIndex, emit],
  );

  return (
    <View style={styles.container}>
      <WheelPicker
        items={days}
        selectedIndex={safeDayIndex}
        onIndexChange={handleDayChange}
        width={64}
        overlayColor={overlayColor}
      />
      <WheelPicker
        items={MONTHS}
        selectedIndex={monthIndex}
        onIndexChange={handleMonthChange}
        width={148}
        overlayColor={overlayColor}
      />
      <WheelPicker
        items={YEARS}
        selectedIndex={yearIndex}
        onIndexChange={handleYearChange}
        width={88}
        overlayColor={overlayColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
