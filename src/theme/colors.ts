export const colors = {
  // Primary palette
  primary: {
    50: '#EBF8FF',
    100: '#BEE3F8',
    200: '#90CDF4',
    300: '#63B3ED',
    400: '#4299E1',
    500: '#3182CE',
    600: '#2B6CB0',
    700: '#2C5282',
    800: '#2A4365',
    900: '#1A365D',
  },

  // Purple accent (for special actions)
  purple: {
    500: '#805AD5',
    600: '#6B46C1',
  },

  // Neutral/Gray scale
  gray: {
    50: '#F7FAFC',
    100: '#EDF2F7',
    200: '#E2E8F0',
    300: '#CBD5E0',
    400: '#A0AEC0',
    500: '#718096',
    600: '#4A5568',
    700: '#2D3748',
    800: '#1A202C',
    900: '#171923',
  },

  // Semantic colors
  success: {
    50: '#F0FFF4',
    500: '#48BB78',
    700: '#2F855A',
  },

  error: {
    50: '#FFF5F5',
    100: '#FED7D7',
    500: '#FC8181',
    600: '#F56565',
    700: '#E53E3E',
    800: '#C53030',
    900: '#742A2A',
    dark: '#9B2C2C',
  },

  warning: {
    50: '#FFFAF0',
    500: '#ED8936',
    700: '#C05621',
  },

  info: {
    50: '#EBF8FF',
    500: '#4299E1',
    700: '#2C5282',
  },

  // Category colors
  category: {
    food: '#FF6B6B',
    transport: '#4ECDC4',
    entertainment: '#95E1D3',
    utilities: '#F38181',
    shopping: '#AA96DA',
    healthcare: '#FCBAD3',
    other: '#A8DADC',
  },

  // Semantic UI colors
  background: '#F7FAFC',
  surface: '#FFFFFF',
  text: {
    primary: '#2D3748',
    secondary: '#4A5568',
    tertiary: '#718096',
    disabled: '#A0AEC0',
    inverse: '#FFFFFF',
  },
  border: '#E2E8F0',
  divider: '#E2E8F0',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
} as const;

export type ColorTheme = typeof colors;
