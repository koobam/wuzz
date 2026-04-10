import {Platform} from 'react-native';

const spacing = {
  tiny: 4,
  small: 6,
  standard: 12,
  medium: 18,
  large: 24,
  extraLarge: 30,
};

/** Shadow data per elevation: [offsetY, opacity, radius]. Index = elevation level. */
const ELEVATION_SHADOW_DATA: [number, number, number][] = [
  [0, 0, 0],
  [1, 0.18, 1.0],
  [1, 0.2, 1.41],
  [1, 0.22, 2.22],
  [2, 0.23, 2.62],
  [2, 0.25, 3.84],
  [3, 0.27, 4.65],
  [3, 0.29, 4.65],
  [4, 0.3, 4.65],
  [4, 0.32, 5.46],
  [5, 0.34, 6.27],
  [5, 0.36, 6.68],
  [6, 0.37, 7.49],
  [6, 0.39, 8.3],
  [7, 0.41, 9.11],
  [7, 0.43, 9.51],
  [8, 0.44, 10.32],
  [8, 0.46, 11.14],
  [9, 0.48, 11.95],
  [9, 0.5, 12.35],
  [10, 0.51, 13.16],
  [10, 0.53, 13.97],
  [11, 0.55, 14.78],
  [11, 0.57, 15.19],
  [12, 0.58, 16.0],
];

/** Web boxShadow strings per elevation. Index = elevation level. */
const ELEVATION_BOX_SHADOW: (string | null)[] = [
  'none',
  '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
  '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
  '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
  '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
  '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
  '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
  '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
  '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
  '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
  '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
  '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
  '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
  '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
  '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
  '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
  '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
  '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
  '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
  '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
  '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
  '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
  '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)',
];

function createElevation(level: number) {
  const [offsetY, opacity, radius] = ELEVATION_SHADOW_DATA[level] ?? [0, 0, 0];
  const boxShadow = ELEVATION_BOX_SHADOW[level] ?? 'none';
  return Platform.select({
    android: { elevation: level },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    web: { boxShadow },
  });
}

const elevations: Record<number, ReturnType<typeof createElevation>> = {};
for (let i = 0; i <= 24; i++) {
  elevations[i] = createElevation(i);
}

export const theme = {
  colorScheme: 'light',
  elevations: elevations,
  pallate: {
    primary: {
      '01': '#E6E9FF', // lightest tint
      '02': '#99A8FF', // light tint
      '03': '#0009FF', // base
      '04': '#0007CC', // darker shade
      '05': '#000599', // darkest shade
    },
  secondary: {
    '01': '#FFFBEA', // Lightest tint (yellowish tint)
    '02': '#FFE29A', // Lighter tint (yellow tint)
    '03': '#FF9500', // Base (orange/yellow, often used for 'secondary' in harmony with primary blue)
    '04': '#CC7600', // Darker shade (deeper orange)
    '05': '#994F00', // Darkest shade (even deeper orange-brown)
  },
    coffee: {
      '01': '#F5EDE4', // Lightest (soft cream)
      '02': '#E8D5C4', // Light tint
      '03': '#8B6F47', // Base (soft brown)
      '04': '#6B5344', // Darker shade
      '05': '#4A3328', // Darkest
    },
    teal: {
      '01': '#E0FFFA', // Lightest tint (lightened per "kurang light" instruction)
      '02': '#99F6E4', // Light tint
      '03': '#0D9488', // Base
      '04': '#0F766E', // Darker shade
      '05': '#134E4A', // Darkest
    },
    success: {
      '01': '#F0FDF4', // Lightest tint
      '02': '#DCFCE7', // Light tint
      '03': '#22C55E', // Base
      '04': '#16A34A', // Darker shade
      '05': '#15803D', // Darkest
    },
    neutral: {
      '01': '#FFFFFF',
      '02': '#F2F2F2',
      '03': '#EEEEEE',
      '04': '#909090',
      '05': '#000000',
    },
    warning: {
      '01': '#444444',
      '02': '#FEF08A',
      '03': '#FB9D22',
      '04': '#A16207',
      '05': '#713F12',
    },
    danger: {
      '01': '#FEF2F2',
      '02': '#FECACA',
      '03': '#EF4444',
      '04': '#CE2F2F',
      '05': '#7F1D1D',
    },
    info: {
      '01': '#EFF6FF',
      '02': '#BFDBFE',
      '03': '#1999FF',
      '04': '#176EFC',
      '05': '#1E3A8A',
    },
    bronze: {
      '01': '#fdecd6', // bg tint
      '02': '#ffad51', // gem highlight
      '03': '#f07f00', // front face (primary)
      '04': '#a75900', // mid shadow
      '05': '#8c4a00', // deep shadow
    },
    silver: {
      '01': '#f0f0f0', // bg tint
      '02': '#e0e0e0', // gem highlight
      '03': '#cbcbcb', // front face (primary)
      '04': '#959595', // mid shadow
      '05': '#828282', // deep shadow
    },
    gold: {
      '01': '#fff8e1', // bg tint
      '02': '#ffcc65', // gem highlight
      '03': '#ffd04b', // front face (primary)
      '04': '#e89d00', // mid shadow
      '05': '#bd7800', // deep shadow
    },
    diamond: {
      '01': '#e6f9ff', // bg tint
      '02': '#49d7ff', // gem highlight
      '03': '#00b1e3', // front face (primary)
      '04': '#009fcc', // mid shadow
      '05': '#0089b0', // deep shadow
    },
  },
  breakpoints: {
    sm: 0,
    md: 400,
    lg: 768,
  },
  spacing,
};

export const navigationTheme: ReactNavigation.Theme = {
  dark: false,
  colors: {
    primary: theme.pallate.primary['03'],
    background: theme.pallate.neutral['01'],
    card: theme.pallate.neutral['04'],
    text: theme.pallate.neutral['01'],
    border: theme.pallate.neutral['03'],
    notification: theme.pallate.neutral['03'],
  },
  fonts: {
    regular: {
      fontFamily: '',
      fontWeight: 'bold',
    },
    medium: {
      fontFamily: '',
      fontWeight: 'bold',
    },
    bold: {
      fontFamily: '',
      fontWeight: 'bold',
    },
    heavy: {
      fontFamily: '',
      fontWeight: 'bold',
    },
  },
};

export default theme;
