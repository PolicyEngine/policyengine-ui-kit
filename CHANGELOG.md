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