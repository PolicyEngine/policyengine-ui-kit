/**
 * @deprecated Compatibility shim mirroring the API of the legacy
 * `@policyengine/design-system/tokens` module. Use the canonical
 * `@policyengine/ui-kit` exports (`palette`, `semanticFills`, `typography`,
 * `namedSpacing`, `tokens`) for new code.
 *
 * PolicyEngine Design Tokens
 * Re-exports all design tokens for convenient access
 */

export * from './colors';
export * from './typography';
export * from './spacing';

// Combined tokens object for JSON/YAML export
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const tokens = {
  colors,
  typography,
  spacing,
} as const;

export type Tokens = typeof tokens;
