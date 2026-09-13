import { useCallback, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { TabName } from '../types';
import { TAB_NAMES } from '../types';

export const useCheckoutTabs = () => {
  const activeIndex = useSharedValue(0);
  const [selectedTab, setSelectedTab] = useState<TabName>('Pickup');

  const handleTabPress = useCallback((tab: string) => {
    const index = TAB_NAMES.indexOf(tab as TabName);
    if (index !== -1) {
      activeIndex.value = index;
      setSelectedTab(tab as TabName);
    }
  }, []);

  const setSelectedIndex = useCallback((index: number) => {
    if (index >= 0 && index < TAB_NAMES.length) {
      activeIndex.value = index;
      setSelectedTab(TAB_NAMES[index]);
    }
  }, []);

  return { activeIndex, selectedTab, handleTabPress, setSelectedIndex };
};
