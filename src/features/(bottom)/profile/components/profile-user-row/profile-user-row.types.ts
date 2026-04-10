export type ProfileUserRowProps = {
  profilePhotoUri?: string | null;
  displayName?: string;
  onAvatarPress?: () => void;
  onSharePress?: () => void;
  onEditPress?: () => void;
  onStatsSharePress?: () => void;
  onStreakPress?: () => void;
  streak?: number;
  pesananCount?: number;
  poin?: number;
  level?: string;
};
