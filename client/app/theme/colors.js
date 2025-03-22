// Base colors
export const colors = {
  // Primary colors
  primary: {
    main: '#4F46E5',    // Main brand color (Indigo)
    light: '#EEF2FF',   // Light background for primary elements
    dark: '#4338CA',    // Darker shade for hover/active states
  },

  // Secondary colors for different categories/actions
  secondary: {
    purple: '#8B5CF6',  // Mental Health
    pink: '#EC4899',    // Meditation
    green: '#10B981',   // Success/Positive
    amber: '#F59E0B',   // Warning/Alert
    red: '#EF4444',     // Error/Urgent
  },

  // Gray scale
  gray: {
    50: '#F9FAFB',     // Page background
    100: '#F3F4F6',    // Card background
    200: '#E5E7EB',    // Borders
    300: '#D1D5DB',    // Disabled
    400: '#9CA3AF',    // Placeholder
    500: '#6B7280',    // Secondary text
    600: '#4B5563',    // Body text
    700: '#374151',    // Strong text
    800: '#1F2937',    // Headings
    900: '#111827',    // Extra dark text
  },

  // Common colors
  common: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
  },

  // Status colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
};

// Semantic color mapping
export const semantic = {
  text: {
    primary: colors.gray[900],
    secondary: colors.gray[500],
    disabled: colors.gray[400],
    inverse: colors.common.white,
  },
  background: {
    default: colors.gray[50],
    paper: colors.common.white,
    card: colors.gray[100],
  },
  border: {
    light: colors.gray[200],
    main: colors.gray[300],
  },
  action: {
    active: colors.primary.main,
    hover: colors.primary.dark,
    disabled: colors.gray[300],
  },
};

// Component-specific colors
export const components = {
  button: {
    primary: {
      background: colors.primary.main,
      text: colors.common.white,
    },
    secondary: {
      background: colors.primary.light,
      text: colors.primary.main,
    },
  },
  input: {
    background: colors.gray[100],
    border: colors.gray[200],
    placeholder: colors.gray[400],
  },
  card: {
    background: colors.common.white,
    border: colors.gray[200],
    shadow: colors.common.black,
  },
  navigation: {
    active: colors.primary.main,
    inactive: colors.gray[500],
    background: colors.common.white,
    border: colors.gray[200],
  },
};

// Shadow configurations
export const shadows = {
  sm: {
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primary: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

export default {
  colors,
  semantic,
  components,
  shadows,
}; 