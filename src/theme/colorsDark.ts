const palette = {
  neutral900: "#F5F6F5", // Off-white for dark theme text
  neutral800: "#ECEFF1", // Soft gray for secondary text
  neutral700: "#B0BEC5", // Mid-tone gray for subtle contrasts
  neutral600: "#78909C", // Balanced gray for borders
  neutral500: "#546E7A", // Darker gray for elements
  neutral400: "#455A64", // Slate for backgrounds
  neutral300: "#37474F", // Deep slate for panels
  neutral200: "#263238", // Near-black for depth
  neutral100: "#0A1419", // True black alternative for backgrounds

  primary600: "#B2DFDB", // Soft teal for hover states
  primary500: "#4DB6AC", // Mid-tone teal for buttons
  primary400: "#26A69A", // Vibrant teal for primary actions
  primary300: "#00897B", // Deep teal for core branding
  primary200: "#00695C", // Dark teal for emphasis
  primary100: "#004D40", // Deepest teal for accents

  secondary500: "#D1C4E9", // Light lavender for subtle accents
  secondary400: "#B39DDB", // Muted purple for secondary elements
  secondary300: "#9575CD", // Rich purple for interactive elements
  secondary200: "#7E57C2", // Deep violet for strong accents
  secondary100: "#673AB7", // Darker violet for depth

  accent500: "#FFF8E1", // Pale gold for highlights
  accent400: "#FFECB3", // Warm gold for hover states
  accent300: "#FFCA28", // Bright gold for key actions
  accent200: "#FFB300", // Vibrant amber for bold accents
  accent100: "#FFA000", // D`eep amber for emphasis

  angry100: "#FFEBEE", // Soft red for error backgrounds
  angry500: "#D32F2F", // Muted red for error states

  overlay20: "rgba(10, 20, 25, 0.2)", // Subtle overlay for modals
  overlay50: "rgba(10, 20, 25, 0.5)", // Stronger overlay for emphasis
} as const

export const colors = {
  /**
   * The palette is available to use, but prefer using the name.
   * This is only included for rare, one-off cases. Try to use
   * semantic names as much as possible.
   */
  palette,
  /**
   * A helper for making something see-thru.
   */
  transparent: "rgba(0, 0, 0, 0)",
  /**
   * The default text color in many components.
   */
  text: palette.neutral900,
  /**
   * Secondary text information.
   */
  textDim: palette.neutral800,
  /**
   * The default color of the screen background.
   */
  background: palette.neutral100,
  /**
   * The default border color.
   */
  border: palette.neutral600,
  /**
   * The main tinting color.
   */
  tint: palette.primary400,
  /**
   * The inactive tinting color.
   */
  tintInactive: palette.neutral700,
  /**
   * A subtle color used for lines.
   */
  separator: palette.neutral700,
  /**
   * Error messages.
   */
  error: palette.angry500,
  /**
   * Error Background.
   */
  errorBackground: palette.angry100,
} as const