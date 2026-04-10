import { moods } from '@api/moods';
import type { MoodsResponse } from '@api/moods.types';
import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import { useQuery } from '@tanstack/react-query';

export const moodsQueryKeys = createQueryKeyStore({
  moods: {
    list: () => ({
      queryKey: ['fetchMoods'],
      queryFn: () => moods(),
    }),
  },
});

export const useFetchMoods = () => {
  return useQuery({
    ...moodsQueryKeys.moods.list(),
    select: (data: MoodsResponse) => data.data ?? null,
  });
};
