import { onboarding1 } from '@assets/image';
import { theme } from '@components/atoms';

export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: any;
  color: string;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Capture Moments',
    description:
      'Share your life through photos and videos with friends and family',
    image: onboarding1,
    color: theme.pallate.primary['01'],
  },
  {
    id: '2',
    title: 'Connect & Share',
    description: 'Stay connected with people you love and discover new friends',
    image: onboarding1,
    color: theme.pallate.primary['01'],
  },
  {
    id: '3',
    title: 'Chat Instantly',
    description:
      'Send messages, photos, and videos to your friends in real-time',
    image: onboarding1,
    color: theme.pallate.primary['01'],
  },
  {
    id: '4',
    title: 'Explore the World',
    description: 'Discover amazing content from creators around the globe',
    image: onboarding1,
    color: theme.pallate.primary['01'],
  },
];

