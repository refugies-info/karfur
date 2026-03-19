/**
 * RI Design Tokens - TypeScript Constants
 *
 * These constants mirror the CSS custom properties in ri-tokens.css.
 * Use these when you need token values in JavaScript/TypeScript.
 *
 * For CSS, use the custom properties directly:
 *   padding: var(--u-4);
 *   font: var(--text-normal);
 *   color: var(--color-blue);
 */

// ============================================================================
// SPACING TOKENS (based on u() function: value * 4px)
// ============================================================================

export const spacing = {
  u0: 0,
  u0_5: 2,
  u1: 4,
  u1_5: 6,
  u2: 8,
  u2_5: 10,
  u3: 12,
  u4: 16,
  u5: 20,
  u6: 24,
  u7: 28,
  u8: 32,
  u9: 36,
  u10: 40,
  u11: 44,
  u12: 48,
  u14: 56,
  u16: 64,
  u18: 72,
  u20: 80,
  u24: 96,
  u28: 112,
  u32: 128,
} as const;

// ============================================================================
// TYPOGRAPHY TOKENS (DSFR compliant - pixel based)
// ============================================================================

export const typography = {
  // Body text
  verySmall: { fontSize: 12, lineHeight: 20 },
  small: { fontSize: 14, lineHeight: 24 },
  normal: { fontSize: 16, lineHeight: 24 },
  large: { fontSize: 18, lineHeight: 28 },
  chapo: { fontSize: 20, lineHeight: 32 },

  // Headings
  h6: { fontSize: 20, lineHeight: 28 },
  h5: { fontSize: 22, lineHeight: 28 },
  h4: { fontSize: 24, lineHeight: 32 },
  h3: { fontSize: 28, lineHeight: 36 },
  h2: { fontSize: 32, lineHeight: 40 },
  h1: { fontSize: 40, lineHeight: 48 },

  // Alternative titles
  altTitle: { fontSize: 48, lineHeight: 56 },
  altTitleBig: { fontSize: 56, lineHeight: 64 },
} as const;

// ============================================================================
// BREAKPOINT TOKENS (em-based for accessibility)
// ============================================================================

export const breakpoints = {
  phoneDown: 31.25, // 500px
  smLimit: 36.0625, // 577px
  tabletUp: 48, // 768px
  mdLimit: 48.0625, // 769px
  lgLimit: 62, // 992px
  desktopUp: 64, // 1024px
  xlLimit: 75, // 1200px
  widescreenUp: 90, // 1440px
  drawer: 48, // 768px
} as const;

// ============================================================================
// RI BRAND COLORS
// ============================================================================

export const colors = {
  // Base
  white: "#fff",
  dark: "#212121",
  darkColor: "#212121", // alias for dark
  light: "#f2f2f2",
  lightColor: "#f2f2f2", // alias for light

  // Brand blue
  bleuCharte: "#0421b1",
  blue: "#0a54bf",
  focus: "#2d9cdb",
  bgFocus: "#d2edfc",
  lightBlue: "#d2edfc", // alias for bgFocus (backward compat)

  // Gray scale
  gray10: "#fbfbfb",
  gray20: "#f2f2f2",
  gray30: "#f6f6f6",
  gray40: "#e5e5e5",
  gray40b: "#edebeb",
  gray50: "#cdcdcd",
  gray60: "#c6c6c6",
  gray70: "#828282",
  gray70b: "#ababab",
  gray80: "#5e5e5e",
  gray90: "#212121",
  darkGrey: "#5e5e5e",
  lightGrey: "#edebeb",
  grey2: "#e0e0e0",
  grey50b: "#e0e0e0",

  // Green / Success
  green: "#137f3a",
  vert: "#2ca12a",
  vert2: "#008205",
  vertFonce: "#219653",
  greenValidate: "#bdf0c7",
  lightgreen: "#def6c2", // note: lowercase for backward compat
  lightGreen: "#def6c2", // alias
  validation: "#def6c2",
  validationDefault: "#8bc34a",
  validationHover: "#4caf50",

  // Orange / Warning
  orange: "#ff9800",
  orangeDark: "#ea6206",
  darkOrange: "#ea6206",
  lightOrange: "#ffe2b8",
  standby: "#fdd497",

  // Yellow
  yellow: "#ffeb3b",
  lightYellow: "#fff7ae",

  // Red / Error
  redDark: "#b50437",
  rouge: "#e55039",
  error: "#f44336",
  erreur: "#ffcecb",

  // DSFR Dark Mode
  darkBackgroundActionHighBlueFrance: "#8585f6",
  darkBackgroundAltBlueFrance: "#1b1b35",
  darkBackgroundAltGrey: "#1e1e1e",
  darkBackgroundContrastGrey: "#242424",
  darkBackgroundElevationContrast: "#2f2f2f",
  darkBorderPlainError: "#ff5655",
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert u() function value to pixels
 * @param value - The unit multiplier
 * @returns The pixel value (value * 4)
 */
export function u(value: number): number {
  return value * 4;
}

/**
 * Get responsive media query for min-width
 * @param breakpoint - The breakpoint name
 * @returns The media query string
 */
export function mediaMin(breakpoint: keyof typeof breakpoints): string {
  const value = breakpoints[breakpoint];
  return `@media (min-width: ${value}em)`;
}

/**
 * Get responsive media query for max-width
 * @param breakpoint - The breakpoint name
 * @returns The media query string
 */
export function mediaMax(breakpoint: keyof typeof breakpoints): string {
  const value = breakpoints[breakpoint];
  return `@media (max-width: ${value - 0.0625}em)`;
}
