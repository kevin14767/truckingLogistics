/**
 * Central theme exports
 * Provides a unified import point for all theme elements
 */
import { Dimensions } from 'react-native';
import Colors from './Colors';
import ApplicationStyles from './ApplicationStyles';

// Window dimensions (replacing separate Dimensions.ts file)
const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// Responsive scaling utilities (from Metrics.ts)
// Guideline sizes based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size: number): number => 
  (windowWidth / guidelineBaseWidth) * size;

const verticalScale = (size: number): number => 
  (windowHeight / guidelineBaseHeight) * size;

const moderateScale = (size: number, factor = 0.5): number =>
  size + (horizontalScale(size) - size) * factor;

// Typography presets
const Typography = {
  header: {
    large: {
      fontSize: moderateScale(28),
      fontWeight: '700',
      lineHeight: moderateScale(34),
    },
    medium: {
      fontSize: moderateScale(22),
      fontWeight: '600',
      lineHeight: moderateScale(28),
    },
    small: {
      fontSize: moderateScale(18),
      fontWeight: '600',
      lineHeight: moderateScale(24),
    },
  },
  body: {
    large: {
      fontSize: moderateScale(16),
      lineHeight: moderateScale(24),
    },
    medium: {
      fontSize: moderateScale(14),
      lineHeight: moderateScale(20),
    },
    small: {
      fontSize: moderateScale(12),
      lineHeight: moderateScale(18),
    },
  },
  button: {
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
};

// Spacing presets
const Spacing = {
  xs: moderateScale(4),
  s: moderateScale(8),
  m: moderateScale(16),
  l: moderateScale(24),
  xl: moderateScale(32),
  xxl: moderateScale(48),
};

// Border radius presets
const BorderRadius = {
  small: moderateScale(4),
  medium: moderateScale(8),
  large: moderateScale(16),
  pill: moderateScale(999),
  circle: (size: number) => size / 2,
};

// Shadow presets
const Shadow = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Theme object for combined access
const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadow: Shadow,
};

// Export all theme elements in an organized way
export {
  Colors,
  ApplicationStyles,
  Typography,
  Spacing,
  BorderRadius,
  Shadow,
  horizontalScale,
  verticalScale,
  moderateScale,
  windowWidth,
  windowHeight,
  Theme as default,
};