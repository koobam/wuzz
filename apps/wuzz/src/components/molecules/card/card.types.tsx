export interface CardBaseProps {
  onPress?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
}

export interface NewsCardProps extends CardBaseProps {
  type: 'news';
  id: number;
  title: string;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  userName?: string;
  category?: string;
  location?: string;
  repostedBy?: Array<{ id: number; name: string; avatar?: string }>;
}

export interface PostCardProps extends CardBaseProps {
  type: 'post';
  id: number;
  title: string;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  userName?: string;
  userAvatar?: string;
  likes?: number;
  comments?: number;
  reposts?: number;
}

export interface VideosCardProps extends CardBaseProps {
  type: 'videos';
  id: number;
  title: string;
  description?: string;
  thumbnail?: string;
  videoUrl?: string;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  userName?: string;
  userAvatar?: string;
  views?: number;
  likes?: number;
}

export type CardProps = NewsCardProps | PostCardProps | VideosCardProps;

