import { useCallback, useState } from 'react';

const INITIAL_PAGE = 1; // start on Silver where current user sits

export interface UseLeaderboardPagerResult {
  activeIndex: number;
  handleTabPress: (index: number) => void;
}

export function useLeaderboardPager(): UseLeaderboardPagerResult {
  const [activeIndex, setActiveIndex] = useState(INITIAL_PAGE);

  const handleTabPress = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  return { activeIndex, handleTabPress };
}
