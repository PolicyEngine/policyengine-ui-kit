/**
 * @policyengine/ui-kit/legacy
 *
 * @deprecated Backwards-compatibility shim that re-exports the API surface of
 * the legacy `@policyengine/design-system` package. Use the canonical exports
 * from `@policyengine/ui-kit` (root) and the `tokens` / `theme.css` /
 * `quarto.scss` subpath exports for new code.
 *
 * This module exists to make the migration from `@policyengine/design-system`
 * a pure import-path rename:
 *
 *   - import … from '@policyengine/design-system'           → '@policyengine/ui-kit/legacy'
 *   - import … from '@policyengine/design-system/tokens'    → '@policyengine/ui-kit/legacy/tokens'
 *   - import … from '@policyengine/design-system/charts'    → '@policyengine/ui-kit/legacy/charts'
 *   - import … from '@policyengine/design-system/tokens/colors'  → '@policyengine/ui-kit/legacy/tokens/colors'
 *
 * Mapping to canonical ui-kit exports for net-new code:
 *
 *   colors.primary[N]        → palette.teal[N]
 *   colors.gray[N]           → palette.gray[N]
 *   colors.warning           → semanticFills.warning
 *   colors.error             → semanticFills.error
 *   colors.text.warning      → rootColorsLight['--text-warning']  (or `var(--text-warning)`)
 *   typography.fontFamily.primary → typography.fontFamily.sans
 *   spacing.{layout,…}       → namedSpacing  (only `header`, `sidebar`, `content` exposed today)
 *   chartColors / chartLayout → see charts/chartDefaults.ts (Recharts) or chartPalette (resolved hex)
 *
 * This module will be removed in a future major release once consumers migrate.
 */

// Subpath re-exports use explicit `/index` to dodge the same
// file-shadowing-folder ambiguity fixed in src/index.ts. Without the
// `/index` pin, TypeScript's `bundler` resolution picks the Vite-emitted
// `dist/legacy/tokens.js` over the tsc-emitted `dist/legacy/tokens/index.d.ts`
// and silently drops the re-exports.
export * from "./tokens/index";
export * from "./charts/index";
