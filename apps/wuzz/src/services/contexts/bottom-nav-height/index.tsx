import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { LayoutChangeEvent, ReactNode } from 'react';

interface BottomNavHeightValue {
  navHeight: number;
  onLayout: (e: LayoutChangeEvent) => void;
}

const BottomNavHeightContext = createContext<BottomNavHeightValue>({
  navHeight: 0,
  onLayout: () => {},
});

export function BottomNavHeightProvider({ children }: { children: ReactNode }) {
  const [navHeight, setNavHeight] = useState(0);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setNavHeight(e.nativeEvent.layout.height);
  }, []);

  const value = useMemo<BottomNavHeightValue>(
    () => ({ navHeight, onLayout }),
    [navHeight, onLayout],
  );

  return (
    <BottomNavHeightContext.Provider value={value}>
      {children}
    </BottomNavHeightContext.Provider>
  );
}

export function useBottomNavHeight(): BottomNavHeightValue {
  return useContext(BottomNavHeightContext);
}
