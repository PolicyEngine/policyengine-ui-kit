// Styles — consumers must import '@policyengine/ui-kit/styles.css' separately
import './theme/tokens.css';

// Subpath re-exports use explicit `/index` so the emitted .d.ts resolves
// past the multi-entry `dist/<name>.js` siblings produced by Vite. With both
// `dist/primitives.js` (Vite output) and `dist/primitives/index.d.ts` (tsc
// output) on disk, TypeScript's `bundler` resolution prefers the file over
// the folder and reports "no exported member" from the main entry. Pinning
// the path to `./<name>/index` forces folder resolution and exposes the
// types correctly. See https://github.com/microsoft/TypeScript/issues/52146

// Runtime tokens (colors, palette, chartColors, typography, …)
export * from './theme/index';

// Types
export * from './types/index';

// Utilities
export * from './utils/index';

// Primitives
export * from './primitives/index';

// Layout
export * from './layout/index';

// Inputs
export * from './inputs/index';

// Display
export * from './display/index';

// Charts
export * from './charts/index';

// Visualization
export * from './visualization/index';

// Assets
export * from './assets/index';
