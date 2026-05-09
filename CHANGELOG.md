## [0.8.2] - 2026-05-09

### Fixed

- `@policyengine/ui-kit/legacy` types now resolve correctly under TypeScript `bundler` resolution. Same root cause as 0.8.1's main-entry fix: `src/legacy/index.ts` re-exported `'./tokens'` and `'./charts'`, but Vite's multi-entry build emits `dist/legacy/tokens.js` and `dist/legacy/charts.js` siblings to the tsc-emitted `dist/legacy/tokens/index.d.ts` and `dist/legacy/charts/index.d.ts` folders. With both shapes on disk, TS's `bundler` resolver picks the file (no types) over the folder. Pinning to `'./tokens/index'` and `'./charts/index'` forces folder resolution.


## [0.8.1] - 2026-05-09

### Fixed

- Main-entry type re-exports now resolve from a TypeScript `bundler` consumer. Since 0.4.0 the dist/ tree contains both Vite-emitted `dist/<name>.js`/`.cjs` files and tsc-emitted `dist/<name>/index.d.ts` folders side by side. With both on disk, TypeScript's `bundler` module resolution prefers the file over the folder and reports `Module '"@policyengine/ui-kit"' has no exported member 'Badge'` (and the same for every primitive/layout/charts/visualization/inputs/display/utils/assets symbol) from the main entry. Pinning the source re-exports to the explicit `./<name>/index` folder path forces folder resolution and exposes types correctly. Subpath imports (`@policyengine/ui-kit/primitives`) were unaffected.


## [0.8.0] - 2026-05-09

### Added

- `@policyengine/ui-kit/legacy` compatibility shim that mirrors the API surface of the deprecated `@policyengine/design-system` package. Migrating from design-system is now a pure import-path rename: `@policyengine/design-system` → `@policyengine/ui-kit/legacy`, with matching subpath exports for `/tokens`, `/tokens/colors`, `/tokens/typography`, `/tokens/spacing`, and `/charts`. All legacy exports carry `@deprecated` JSDoc pointing at the canonical ui-kit equivalents (`palette`, `semanticFills`, `typography`, `namedSpacing`, `chartPalette`, etc.).


## [0.7.0] - 2026-05-09

### Added

- Contrast matrix now asserts the focus ring on background (light + dark, WCAG SC 1.4.11 non-text 3:1), dark-mode `primary-foreground` on `primary`, dark-mode `destructive-foreground` on `destructive`, and the default link color (teal-600) on background.

### Fixed

- Dark mode card surfaces are now visible. `--card`/`--popover`/`--muted` bumped from `#131820` (1.08:1 vs background — visually invisible) to `#1A2030` (1.19:1), and `--border`/`--input` bumped from `#1E293B` (1.32:1 vs background, 1.22:1 vs card) to `#334155` (1.87:1 / 1.57:1) so card surfaces and their borders are clearly distinguishable.
- Quarto SCSS `$secondary` now resolves to the secondary surface fill (`#F2F4F7`) instead of the secondary foreground (`#101828`). Bootstrap's `$secondary` is a fill color (e.g. `.btn-secondary` background), so paper renders previously got a near-black secondary button where Bootstrap expects a light gray.


## [0.6.0] - 2026-05-09

### Added

- TS canonical token source (`src/theme/tokens.ts`) with a generator (`scripts/generate-css.ts`) emitting both the CSS theme (`tokens.css`) and a Quarto SCSS theme (`quarto.scss`). Runtime tokens (`colors`, `palette`, `chartPalette`, `semanticFills`, `typography`, `radius`, `breakpoints`, `tokens`) are exported from the package root and from `@policyengine/ui-kit/tokens`.
- WCAG contrast matrix Vitest. `tests/theme/contrast.test.ts` asserts every documented foreground/background token pair clears WCAG AA at 4.5:1 in both light and dark mode. Catches accessible-color regressions before they ship.
- Dark mode tokens (`:root.dark` / `.dark { … }`) for every shadcn semantic role plus accessible-on-dark text variants. Activate by adding `class="dark"` to any ancestor element. Components and consumers' Tailwind utilities pick up the new values automatically via the `@custom-variant dark` declaration.
- Built-in `:focus-visible` outline on every interactive element and a `prefers-reduced-motion: reduce` rule that snaps animations and transitions to instant. Applied via `@layer base`, so consumers inherit them just by importing `theme.css`.
- Quarto SCSS theme export (`@policyengine/ui-kit/quarto.scss`). Maps the same hex values used in the React app to Bootstrap/Quarto SCSS variables (`$primary`, `$body-color`, etc.) so paper renders share the dashboard's palette and contrast guarantees.

### Changed

- `--destructive` bumped from `#EF4444` (red-500) to `#DC2626` (red-600) so `--destructive-foreground` (white) clears WCAG AA on the destructive fill (now 4.83:1, was 3.76:1).
- `--text-warning` bumped from `#d9480f` (Mantine orange.9, 4.30:1 on white) to `#c2410c` (Tailwind orange-700, 5.18:1 on white) to clear WCAG AA at small text sizes.


## [0.5.0] - 2026-05-09

### Added

- Add accessible text tokens (--text-warning, --text-error, --text-success) and Tailwind utilities text-warning-foreground, text-error-foreground, text-success-foreground for use on white or matching -soft / tinted fills.


## [0.4.0] - 2026-05-08

### Added

- Data adapters for constituency and local authority data transformation
- Chart loading, error, and empty state messages
- Chart utilities: tick calculation, axis width estimation, and waterfall computation
- Diverging color scales and semantic color mappings
- US congressional district choropleth map with geographic and hexagonal views, zoom/pan, tooltips, and SVG download
- Bundled GeoJSON data for US congressional districts, UK constituencies, and state legislative districts
- Expanded formatter suite for currency, percent, and compact numbers
- Generic hexagonal tile map component
- Household composition graph visualization
- Impact chart suite: decile bar chart, winners/losers, earnings comparison, and budget waterfall
- Map UI controls: MapTypeToggle, ZoomControls, and MapDownloadButton
- SelectInput chevron caret that rotates on open/close
- State legislative district map for senate and house districts using Census 2024 Cartographic Boundary Files
- UK constituency choropleth map with geographic and hexagonal views
- Publish 0.4.0 to npm — includes Header with nav/country selector/mobile menu, Footer, visualization components, impact charts, and all fixes since 0.3.1

### Changed

- Multi-entry Vite build with subpath exports and async GeoJSON loading to fix build OOM and enable modular imports
- Align gray palette with app-v2 gray scale
- Rename homeHeader to header with consolidated component names
- Darken muted-foreground from gray-500 to gray-600 for accessibility
- Refactor waterfall chart with connector lines and extracted utilities
- Double PolicyEngineWatermark width across all map components
- Dynamic y-axis layout with auto-width calculation in ChartContainer
- Updated GitHub Actions workflows for Node 24-compatible action runtimes.
- Add d3-geo as dependency

### Fixed

- Prevent direct changelog edits from bypassing pull request fragment checks while using Towncrier to build release notes
- Light gray text colors darkened for WCAG contrast
- Primitive focus ring and border color consistency for Accordion, Checkbox, Command, Input, RadioGroup, ScrollArea, Select, Spinner, Text, and Textarea


# Changelog

## [0.3.1] - 2026-03-17

### Fixed

- Fix demo site styling on Vercel by scanning source components for Tailwind classes

## [0.3.0] - 2026-03-17

### Added

- Make demo site deployable to Vercel

## [0.2.0] - 2026-03-16

### Added

- Add demo site showcasing all components with light/dark Header variants and logo gallery.

### Changed

- Align with PE design system: remove tw: prefix, adopt pe-* token naming convention, bridge @theme values to @policyengine/design-system CSS variables.

### Fixed

- Fix CI/CD workflow: drop expired PAT, use default GITHUB_TOKEN, extract scripts
- Add --access public to npm publish for scoped package



[0.3.1]: https://github.com/PolicyEngine/policyengine-ui-kit/compare/0.3.0...0.3.1
[0.3.0]: https://github.com/PolicyEngine/policyengine-ui-kit/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/PolicyEngine/policyengine-ui-kit/compare/0.0.0...0.2.0