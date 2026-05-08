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