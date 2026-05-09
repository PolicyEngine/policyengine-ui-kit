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
 * Mapping to canonical ui-kit exports for net-new code. ⚠ Several mappings
 * shift visible color values (usually for WCAG accessibility). Don't bulk
 * `sed`-replace — pick per usage:
 *
 *   colors.primary[N]        → palette.teal[N]                       (same hex)
 *   colors.gray[N]           → palette.gray[N]                       (DIFFERENT hex —
 *                                                                     legacy is Tailwind-3
 *                                                                     gray, canonical is
 *                                                                     Slate-flavored. e.g.
 *                                                                     legacy gray.500
 *                                                                     #6B7280 vs canonical
 *                                                                     gray.500 #64748B)
 *   colors.blue[N]           → palette.blue[N]                       (same hex)
 *   colors.warning           → semanticFills.warning                 (same: #FEC601)
 *   colors.error             → semanticFills.error                   (same: #EF4444)
 *   colors.success           → semanticFills.success                 (same: #22C55E)
 *   colors.text.warning      → rootColorsLight['--text-warning']     (DIFFERENT hex —
 *                                                                     legacy #d9480f
 *                                                                     fails WCAG AA at
 *                                                                     small text;
 *                                                                     canonical #c2410c
 *                                                                     clears 5.18:1)
 *   typography.fontFamily.primary → typography.fontFamily.sans        (same stack)
 *   spacing.{layout,…}       → namedSpacing                           (only `header`,
 *                                                                     `sidebar`, `content`
 *                                                                     exposed today —
 *                                                                     scale values aren't)
 *   chartColors / chartLayout → see charts/chartDefaults.ts (Recharts) or chartPalette
 *                              (resolved hex)
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
