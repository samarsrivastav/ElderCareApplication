/**
 * Responsive utility functions and breakpoints
 */

export const BREAKPOINTS = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
} as const;

/**
 * Get responsive grid columns based on screen size
 * @param xs - Extra small screens
 * @param sm - Small screens
 * @param md - Medium screens
 * @param lg - Large screens
 * @param xl - Extra large screens
 * @returns Object with responsive column configuration
 */
export const getResponsiveColumns = (
  xs: number = 1,
  sm: number = 2,
  md: number = 3,
  lg: number = 4,
  xl: number = 5
) => ({
  xs,
  sm,
  md,
  lg,
  xl,
});

/**
 * Get responsive spacing based on screen size
 * @param mobile - Mobile spacing
 * @param desktop - Desktop spacing
 * @returns Responsive spacing object
 */
export const getResponsiveSpacing = (mobile: number = 16, desktop: number = 24) => ({
  xs: mobile,
  sm: mobile,
  md: desktop,
  lg: desktop,
  xl: desktop,
});

/**
 * Get responsive font sizes
 * @param mobile - Mobile font size
 * @param desktop - Desktop font size
 * @returns Responsive font size classes
 */
export const getResponsiveFontSize = (mobile: string, desktop: string) => ({
  [`text-${mobile}`]: true,
  [`md:text-${desktop}`]: true,
});

/**
 * Common responsive configurations
 */
export const RESPONSIVE_CONFIG = {
  // Grid configurations
  roomGrid: getResponsiveColumns(1, 1, 2, 3, 4),
  featureGrid: getResponsiveColumns(1, 2, 2, 4, 4),
  comparisonGrid: getResponsiveColumns(1, 1, 2, 2, 3),
  
  // Spacing configurations
  sectionSpacing: getResponsiveSpacing(16, 32),
  cardSpacing: getResponsiveSpacing(12, 24),
  
  // Font sizes
  heroTitle: getResponsiveFontSize('3xl', '6xl'),
  sectionTitle: getResponsiveFontSize('2xl', '4xl'),
  cardTitle: getResponsiveFontSize('lg', 'xl'),
} as const;
