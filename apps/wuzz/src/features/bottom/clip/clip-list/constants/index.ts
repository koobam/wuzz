import { theme } from "@components/atoms";

export const STORY_CONSTANTS = {
  WIDTH: 95,
  HEIGHT_RATIO: 4 / 3,
  BORDER_WIDTH: 1.2,
  BORDER_RADIUS: 20,
  CONTAINER_PADDING: 3,
  GRADIENT_COLORS: {
    ACTIVE: ['#E0FF63', '#FF8102'],
    INACTIVE: [theme.pallate.neutral['03'], theme.pallate.neutral['04']], // Will use theme colors in component
  },
} as const;

export const POST_CONSTANTS = {
  WIDTH: 250,
  HEIGHT_RATIO: 4 / 3,
} as const;

export const MOCK_STORY_DATA = [
  'janfalih',
  'muhammad',
  'arif',
  'rizky',
  'sultan',
  'taufiq',
  'satrio',
] as const;

export const MOCK_POST_DATA = [
  { color: '#ECFFA1' },
  { color: '#E0FF63' },
  { color: '#d9fa52' },
  { color: '#AED900' },
  { color: '#894AFF' },
  { color: '#6C26E6' },
  { color: '#5010B3' },
] as const;

export const LOGO_ANIMATION_CONFIG = {
  INPUT_RANGE: [-60, -360, -60],
  OUTPUT_RANGE: [0, 360, 0],
} as const;

