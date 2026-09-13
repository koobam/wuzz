import { createContext, RefObject } from 'react';
import { SharedValue } from 'react-native-reanimated';
import type { FlashList } from '@shopify/flash-list';
import type { Gesture } from 'react-native-gesture-handler';

// State that changes (causes re-renders when used)
export interface ScrollStateContextType {
  scrollY: SharedValue<number>;
  scrollRef: RefObject<FlashList<any>> | null;
  scrollGestureHandler: Gesture | null;
}

// Actions that never change (never cause re-renders)
export interface ScrollActionsContextType {
  registerScrollRef: (ref: RefObject<FlashList<any>>) => void;
  registerScrollGestureHandler: (gesture: Gesture) => void;
  unregisterScrollRef: () => void;
  unregisterScrollGestureHandler: () => void;
}

export const ScrollStateContext = createContext<ScrollStateContextType | undefined>(
  undefined
);

export const ScrollActionsContext = createContext<ScrollActionsContextType | undefined>(
  undefined
);

// For backward compatibility
export const ScrollYContext = ScrollStateContext;
export const ScrollRefContext = ScrollStateContext;

