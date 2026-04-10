import { SharedTransition } from 'react-native-reanimated';

/**
 * Shared transitions used between news card and popup
 */
export const cardTransition = SharedTransition.duration(550).springify();

export const titleTransition = SharedTransition.duration(400).easing((t) => {
  'worklet';
  return t * (2 - t); // ease-out
});

export const categoryTransition = SharedTransition.duration(300).easing((t) => {
  'worklet';
  return t * t * (3 - 2 * t); // smoothstep
});

export const descriptionTransition = SharedTransition.duration(350).easing((t) => {
  'worklet';
  return t * t * (3 - 2 * t); // smoothstep
});

export const repostedByTransition = SharedTransition.duration(450).springify();

