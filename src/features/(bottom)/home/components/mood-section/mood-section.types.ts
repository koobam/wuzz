import type { MoodApi } from '@api/moods.types';

export type MoodItemProps = {
  icon: string;
  name: string;
  index: number;
};

export type MoodDisplayItem = {
  id: number;
  name: string;
  icon: string;
};

export type MoodSectionProps = {
  /** Moods from API (id, code, label). Mapped to display (name, icon) inside. */
  moods?: MoodApi[] | null;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | { message?: string } | null;
};
