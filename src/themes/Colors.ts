/**
 * Application color palette
 * Uses consistent naming convention with semantic grouping
 */
const Colors = {
    // Base colors
    white: '#FFFFFF',
    black: '#000000',
    
    // Grayscale palette
    gray: {
      light: '#b0b0b0',    // Previously 'grey'
      medium: '#6c6c6e',    // Previously used directly in TabBarIcon
      dark: '#29292b',     // Previously 'darkGrey'
      darker: '#1c1c1e',   // Previously 'black_grey'
      transparent: '#b6b9bf', // Previously 'transParent'
    },
    
    // Theme colors
    primary: {
      main: '#004d40',     // Previously 'greenThemeColor'
      light: '#00796b',    // Previously 'thirdOnboardingColor'
    },
    
    // Semantic colors
    status: {
      error: '#FF3B30',
      success: '#4CAF50',  // Added for consistency 
      warning: '#FFC107',  // Added for consistency
      info: '#2196F3',     // Added for consistency
    },
    
    // UI specific
    background: {
      main: '#1c1c1e',     // Previously 'black_grey'
      card: '#29292b',     // Previously 'darkGrey'
      elevated: '#38393d',  // New, slightly lighter than card for layering
    },
    text: {
      primary: '#FFFFFF',  // White text
      secondary: '#b0b0b0', // Gray text
    },
    
    // Utility - backwards compatibility layer (use sparingly in new code)
    grey: '#b0b0b0',
    darkGrey: '#29292b',
    black_grey: '#1c1c1e',
    transParent: '#b6b9bf',
    greenThemeColor: '#004d40',
    thirdOnboardingColor: '#00796b',
    offWhite: '#f3f3ec',
  } as const;
  
  export default Colors;