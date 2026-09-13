import { MENU_ITEMS } from './constants';
import type { MenuItem } from '../types';

export const SEARCH_SLIDE_DURATION_MS = 280;
export const SEARCH_SLIDE_OFFSET = 100;
export const SPRING_CONFIG = { damping: 20, stiffness: 200 };
export const WAVES_PATH_STROKE_WIDTH = 5;
export const WAVES_VIEWBOX_WIDTH = 1440;
export const WAVES_VIEWBOX_HEIGHT = 320;
export const SPRINKLE_VIEWBOX_HEIGHT = 492;
const WAVES_WIDTH_INSET = 10 * WAVES_PATH_STROKE_WIDTH;

export function getWavesDimensions(windowWidth: number) {
  const wavesSvgWidth = windowWidth + WAVES_WIDTH_INSET;
  const wavesSvgHeight =
    wavesSvgWidth * (WAVES_VIEWBOX_HEIGHT / WAVES_VIEWBOX_WIDTH);
  const sprinkleSvgWidth = windowWidth + WAVES_WIDTH_INSET;
  const sprinkleSvgHeight =
    sprinkleSvgWidth * (SPRINKLE_VIEWBOX_HEIGHT / WAVES_VIEWBOX_WIDTH);
  const wavesOverlayHeight = wavesSvgHeight + sprinkleSvgHeight;
  return {
    wavesSvgWidth,
    wavesSvgHeight,
    sprinkleSvgWidth,
    sprinkleSvgHeight,
    wavesOverlayHeight,
  };
}

export const WAVES_PATH_D =
  'M0,64L18.5,106.7C36.9,149,74,235,111,245.3C147.7,256,185,192,222,144C258.5,96,295,64,332,80C369.2,96,406,160,443,202.7C480,245,517,267,554,261.3C590.8,256,628,224,665,218.7C701.5,213,738,235,775,234.7C812.3,235,849,213,886,218.7C923.1,224,960,256,997,277.3C1033.8,299,1071,309,1108,277.3C1144.6,245,1182,171,1218,149.3C1255.4,128,1292,160,1329,181.3C1366.2,203,1403,213,1422,218.7L1440,224L1440,0L1421.5,0C1403.1,0,1366,0,1329,0C1292.3,0,1255,0,1218,0C1181.5,0,1145,0,1108,0C1070.8,0,1034,0,997,0C960,0,923,0,886,0C849.2,0,812,0,775,0C738.5,0,702,0,665,0C627.7,0,591,0,554,0C516.9,0,480,0,443,0C406.2,0,369,0,332,0C295.4,0,258,0,222,0C184.6,0,148,0,111,0C73.8,0,37,0,18,0L0,0Z';

export const formatSearchPrice = (price: number): string =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);

export function filteredMenuItems(q: string): MenuItem[] {
  const trimmed = q.trim().toLowerCase();
  if (!trimmed) return [];
  return MENU_ITEMS.filter(
    i =>
      i.name.toLowerCase().includes(trimmed) ||
      (i.description?.toLowerCase().includes(trimmed) ?? false),
  );
}
