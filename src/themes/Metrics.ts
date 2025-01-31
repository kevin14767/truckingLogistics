import { Dimensions } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const width = windowWidth < windowHeight ? windowWidth : windowHeight;
const height = windowWidth < windowHeight ? windowHeight : windowWidth;

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size: number): number => 
  (width / guidelineBaseWidth) * size;

const verticalScale = (size: number): number => 
  (height / guidelineBaseHeight) * size;

const moderateScale = (size: number, factor = 0.5): number =>
  size + (horizontalScale(size) - size) * factor;

export { horizontalScale, verticalScale, moderateScale };