import React, { ReactNode, RefObject, useCallback, useMemo, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import type { FlashList } from '@shopify/flash-list';
import type { Gesture } from 'react-native-gesture-handler';
import {
  ScrollStateContext,
  ScrollActionsContext,
  ScrollStateContextType,
  ScrollActionsContextType,
} from './scroll.context';

interface ScrollProviderProps {
  children: ReactNode;
}

/**
 * Merged ScrollProvider
 * 
 * Combines ScrollY and ScrollRef into a single provider with split contexts
 * for optimal re-render performance.
 * 
 * Benefits:
 * - Components using ONLY actions never re-render
 * - Components using scrollY never re-render (SharedValue magic)
 * - Components using scrollRef only re-render when ref changes (once per mount)
 * - Cleaner provider hierarchy (one provider instead of two)
 */
export const ScrollProvider: React.FC<ScrollProviderProps> = ({ children }) => {
  // SharedValue for scroll position (never causes re-renders)
  const scrollY = useSharedValue<number>(0);

  // State for scroll ref and gesture handler (causes re-renders when changed)
  const [scrollRef, setScrollRef] = useState<RefObject<typeof FlashList<any>> | null>(null);
  const [scrollGestureHandler, setScrollGestureHandler] = useState<typeof Gesture | null>(null);

  // Actions - memoized with useCallback, stable references
  const registerScrollRef = useCallback((ref: RefObject<typeof FlashList<any>>) => {
    setScrollRef(ref);
  }, []);

  const registerScrollGestureHandler = useCallback((gesture: typeof Gesture) => {
    setScrollGestureHandler(gesture);
  }, []);

  const unregisterScrollRef = useCallback(() => {
    setScrollRef(null);
  }, []);

  const unregisterScrollGestureHandler = useCallback(() => {
    setScrollGestureHandler(null);
  }, []);

  // State value - only re-creates when scrollRef or scrollGestureHandler changes
  // scrollY SharedValue reference never changes, so it's stable
  const stateValue = useMemo<ScrollStateContextType>(
    () => ({
      scrollY,
      scrollRef,
      scrollGestureHandler,
    }),
    [scrollY, scrollRef, scrollGestureHandler]
  );

  // Actions value - NEVER changes, prevents re-renders for components that only need actions
  const actionsValue = useMemo<ScrollActionsContextType>(
    () => ({
      registerScrollRef,
      registerScrollGestureHandler,
      unregisterScrollRef,
      unregisterScrollGestureHandler,
    }),
    [
      registerScrollRef,
      registerScrollGestureHandler,
      unregisterScrollRef,
      unregisterScrollGestureHandler,
    ]
  );

  return (
    <ScrollStateContext.Provider value={stateValue}>
      <ScrollActionsContext.Provider value={actionsValue}>
        {children}
      </ScrollActionsContext.Provider>
    </ScrollStateContext.Provider>
  );
};

