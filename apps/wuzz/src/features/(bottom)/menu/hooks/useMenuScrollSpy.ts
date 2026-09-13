import {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

const ACTIVE_SECTION_OFFSET = 80;

function findActiveCategoryId(
  scrollY: number,
  offsets: Record<string, number>,
  orderedIds: string[],
  threshold: number,
): string {
  'worklet';
  if (orderedIds.length === 0) return '';
  let active = orderedIds[0];
  const y = scrollY + threshold;
  for (let i = 0; i < orderedIds.length; i++) {
    const id = orderedIds[i];
    const sectionY = offsets[id] ?? 0;
    if (sectionY <= y) active = id;
  }
  return active;
}

export interface UseMenuScrollSpyParams {
  onActiveCategoryChange: (categoryId: string) => void;
}

export interface UseMenuScrollSpyResult {
  scrollHandler: ReturnType<typeof useAnimatedScrollHandler>;
  sectionOffsetsSv: SharedValue<Record<string, number>>;
  orderedIdsSv: SharedValue<string[]>;
}

export function useMenuScrollSpy({
  onActiveCategoryChange,
}: UseMenuScrollSpyParams): UseMenuScrollSpyResult {
  const sectionOffsetsSv = useSharedValue<Record<string, number>>({});
  const orderedIdsSv = useSharedValue<string[]>([]);
  const lastActiveIdSv = useSharedValue<string>('');

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const scrollY = event.contentOffset.y;
      const offsets = sectionOffsetsSv.value;
      const orderedIds = orderedIdsSv.value;
      const activeId = findActiveCategoryId(
        scrollY,
        offsets,
        orderedIds,
        ACTIVE_SECTION_OFFSET,
      );
      if (activeId && activeId !== lastActiveIdSv.value) {
        lastActiveIdSv.value = activeId;
        runOnJS(onActiveCategoryChange)(activeId);
      }
    },
  });

  return {
    scrollHandler,
    sectionOffsetsSv,
    orderedIdsSv,
  };
}
