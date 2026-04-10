import { useContext } from 'react';
import {
  ScrollStateContext,
  ScrollActionsContext,
} from '@services/contexts/scroll/scroll.context';

/**
 * Hook to access scroll state (scrollY, scrollRef, scrollGestureHandler)
 * 
 * Components using this hook will re-render when scrollRef or scrollGestureHandler changes
 * (scrollY updates don't cause re-renders due to SharedValue)
 * 
 * Use cases:
 * - Reading scrollY for animations
 * - Accessing scrollRef to scroll programmatically
 * - Reading scrollGestureHandler
 * 
 * @example
 * const { scrollY, scrollRef } = useScrollState();
 * 
 * // Use scrollY in animated styles (no re-render on scroll)
 * const animatedStyle = useAnimatedStyle(() => ({
 *   opacity: interpolate(scrollY.value, [0, 100], [1, 0])
 * }));
 * 
 * // Scroll to top programmatically
 * scrollRef?.current?.scrollToOffset({ offset: 0 });
 */
export const useScrollState = () => {
  const context = useContext(ScrollStateContext);

  if (context === undefined) {
    throw new Error('useScrollState must be used within a ScrollProvider');
  }

  return context;
};

/**
 * Hook to access scroll actions (register/unregister)
 * 
 * Components using ONLY this hook will NEVER re-render when scroll state changes
 * Perfect for components that only need to register refs or handlers
 * 
 * Use cases:
 * - Registering scroll ref on mount
 * - Registering gesture handler
 * - Cleanup on unmount
 * 
 * @example
 * const { registerScrollRef, unregisterScrollRef } = useScrollActions();
 * 
 * useEffect(() => {
 *   registerScrollRef(scrollRef);
 *   return () => unregisterScrollRef();
 * }, [registerScrollRef, unregisterScrollRef]);
 */
export const useScrollActions = () => {
  const context = useContext(ScrollActionsContext);

  if (context === undefined) {
    throw new Error('useScrollActions must be used within a ScrollProvider');
  }

  return context;
};

/**
 * Hook to access both scroll state and actions
 * 
 * Components using this will re-render when scrollRef or scrollGestureHandler changes
 * Use this for convenience when you need both state and actions
 * 
 * @example
 * const { scrollY, scrollRef, registerScrollRef } = useScroll();
 */
export const useScroll = () => {
  const state = useScrollState();
  const actions = useScrollActions();

  return {
    ...state,
    ...actions,
  };
};

// Backward compatibility aliases
export const useScrollY = useScrollState;
export const useScrollRef = useScroll;

