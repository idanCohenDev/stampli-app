import { borderRadius } from "./borderRadius";
import { colors } from "./colors";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { typography } from "./typography";
export * from "./borderRadius";
export * from "./colors";
export * from "./shadows";
export * from "./spacing";
export * from "./typography";

/**
 * Unified theme object
 * Import this to access all theme values
 *
 * @example
 * import { theme } from '@/src/theme';
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: theme.colors.background,
 *     padding: theme.spacing[4],
 *     borderRadius: theme.borderRadius.md,
 *     ...theme.shadows.md,
 *   },
 * });
 */
export const theme = {
  colors,
  spacing,
  typography,
  shadows,
  borderRadius,
} as const;

export type Theme = typeof theme;
