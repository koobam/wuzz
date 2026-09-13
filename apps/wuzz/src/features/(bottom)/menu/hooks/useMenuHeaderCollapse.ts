import { useSharedValue, withTiming } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { useCallback, useEffect, useRef } from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { MENU_HEADER_COLLAPSE_THRESHOLD } from '../utils/constants';

/** Progress < this → snap to expanded (0), else snap to collapsed (1). */
const SNAP_THRESHOLD = 0.5;

const SNAP_DURATION_MS = 200;

/** After scroll ends, wait this long with no scroll then auto-expand outlet. */
const IDLE_EXPAND_DELAY_MS = 1500;

export interface UseMenuHeaderCollapseResult {
  /** 0 = outlet visible, 1 = outlet fully collapsed. Driven by scroll distance (current vs previous). */
  collapseProgress: SharedValue<number>;
  scrollHandler: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  /** Call when scroll ends to snap; after idle delay outlet auto-expands. */
  scrollEndHandler: () => void;
}

export function useMenuHeaderCollapse(): UseMenuHeaderCollapseResult {
  const collapseProgress = useSharedValue(0);
  const prevScrollY = useSharedValue(0);
  const idleExpandTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearIdleTimer = useCallback(() => {
    if (idleExpandTimerRef.current != null) {
      clearTimeout(idleExpandTimerRef.current);
      idleExpandTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearIdleTimer;
  }, [clearIdleTimer]);

  const scrollHandler = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      clearIdleTimer();
      const currentY = event.nativeEvent.contentOffset.y;
      const delta = currentY - prevScrollY.value;

      if (currentY <= 0) {
        collapseProgress.value = 0;
      } else {
        const next =
          collapseProgress.value + delta / MENU_HEADER_COLLAPSE_THRESHOLD;
        collapseProgress.value = Math.max(0, Math.min(1, next));
      }
      prevScrollY.value = currentY;
    },
    [collapseProgress, prevScrollY, clearIdleTimer],
  );

  const scrollEndHandler = useCallback(() => {
    clearIdleTimer();
    const target = collapseProgress.value < SNAP_THRESHOLD ? 0 : 1;
    collapseProgress.value = withTiming(target, {
      duration: SNAP_DURATION_MS,
    });

    idleExpandTimerRef.current = setTimeout(() => {
      idleExpandTimerRef.current = null;
      collapseProgress.value = withTiming(0, {
        duration: SNAP_DURATION_MS,
      });
    }, IDLE_EXPAND_DELAY_MS);
  }, [collapseProgress, clearIdleTimer]);

  return {
    collapseProgress,
    scrollHandler,
    scrollEndHandler,
  };
}

export { MENU_HEADER_COLLAPSE_THRESHOLD };
