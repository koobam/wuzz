import type { SharedValue } from 'react-native-reanimated';

export type MenuSearchWavesOverlayProps = {
  wavesSvgWidth: number;
  wavesSvgHeight: number;
  sprinkleSvgHeight: number;
  sprinkleSvgWidth: number;
  wavesOverlayHeight: number;
  searchProgress: SharedValue<number>;
  scrollY: SharedValue<number>;
};
