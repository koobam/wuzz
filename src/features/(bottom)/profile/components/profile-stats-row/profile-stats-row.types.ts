export type ProfileStatItem = {
  value: string | number;
  label: string;
  icon: React.ReactNode;
  color: string;
};

export type ProfileStatsRowProps = {
  streak?: number;
  pesananCount?: number;
  poin?: number;
  level?: string;
  onSharePress?: () => void;
  onStreakPress?: () => void;
};
