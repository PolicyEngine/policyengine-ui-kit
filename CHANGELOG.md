# Changelog

## [0.4.0] - 2026-03-23

### Added

- US congressional district choropleth map (d3-geo) with geographic and hexagonal views, zoom/pan, tooltips, and SVG download
- UK constituency choropleth map with geographic and hexagonal views
- State legislative district map for senate (29 states) and house (8 states) districts using Census 2024 Cartographic Boundary Files
- Generic hexagonal tile map component
- Household composition graph visualization
- Impact chart suite: decile bar chart, winners/losers, earnings comparison, budget waterfall
- Map UI controls: MapTypeToggle, ZoomControls, MapDownloadButton
- Diverging color scales (gray-teal, gray-blue) and semantic color mappings
- Chart utilities: tick calculation, axis width estimation, waterfall computation
- Expanded formatter suite (currency, percent, compact numbers)
- Chart loading/error/empty state messages
- SelectInput chevron caret that rotates on open/close
- Data adapters for constituency and local authority data transformation
- Bundled GeoJSON data for US congressional districts, UK constituencies, and state legislative districts

### Changed

- Align gray palette with app-v2 slate scale (gray-50 through gray-900)
- Darken muted-foreground from gray-500 to slate-600 for accessibility
- Refactor waterfall chart with connector lines and extracted utilities
- Double PolicyEngineWatermark width across all map components
- Rename homeHeader to header with consolidated component names
- Add d3-geo as dependency
- Dynamic y-axis layout with auto-width calculation in ChartContainer

### Fixed

- Primitive focus ring and border color consistency (Accordion, Checkbox, Command, Input, RadioGroup, ScrollArea, Select, Spinner, Text, Textarea)
- Light gray text colors darkened for WCAG contrast

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



[0.4.0]: https://github.com/PolicyEngine/policyengine-ui-kit/compare/0.3.1...0.4.0
[0.3.1]: https://github.com/PolicyEngine/policyengine-ui-kit/compare/0.3.0...0.3.1
[0.3.0]: https://github.com/PolicyEngine/policyengine-ui-kit/compare/0.2.0...0.3.0
[0.2.0]: https://github.com/PolicyEngine/policyengine-ui-kit/compare/0.0.0...0.2.0