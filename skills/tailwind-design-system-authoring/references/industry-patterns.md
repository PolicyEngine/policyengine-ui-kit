# Industry Patterns for Tailwind-Based UI Kits

Detailed breakdown of how major component libraries handle styling with Tailwind CSS, with emphasis on Tailwind v4 patterns.

## Pattern 1: Tailwind Plugin — DaisyUI

DaisyUI is a pure CSS library with zero JavaScript runtime. In v5 (built for Tailwind v4), it is consumed as a Tailwind plugin.

### Consumer Setup

```css
/* globals.css */
@import "tailwindcss";
@plugin "daisyui";
```

With theme configuration:

```css
@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
  logs: false;
}
```

### How It Works

- The `@plugin` directive loads the DaisyUI JavaScript module into Tailwind's build
- DaisyUI calls `addComponents()` to inject semantic class names (`.btn`, `.card`, `.toggle`, `.badge`)
- Classes are always generated (no source scanning needed — the plugin injects them directly)
- They participate in Tailwind's `@layer components` cascade layer
- They get full variant support (`hover:btn-primary`, `lg:card-compact`)

### Themes

DaisyUI provides 35+ built-in themes via CSS custom properties:
- Themes are sets of CSS variables under `[data-theme="dark"]` selectors
- Colors use OKLCH format
- Custom themes created via `@plugin "daisyui/theme"` with overrides

### Key Insight

DaisyUI adds **semantic class names** on top of Tailwind's utilities. Components use those semantic classes, not raw utility classes. Source scanning is irrelevant because the plugin programmatically injects all classes.

---

## Pattern 2: Tailwind Plugin + React Provider — HeroUI

HeroUI (formerly NextUI) combines a Tailwind plugin with React components and a context provider.

### Consumer Setup (Tailwind v4)

```css
/* globals.css */
@import "tailwindcss";
@layer theme, base, components, utilities;
@plugin './hero.ts';
@source '../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}';
```

Local plugin wrapper:

```ts
// hero.ts
import { heroui } from "@heroui/react";
export default heroui();
```

Plus `<HeroUIProvider>` wrapping the app root.

### How It Works

- Ships as multiple packages: `@heroui/react` (components), `@heroui/theme` (tokens), `@heroui/styles` (CSS)
- The Tailwind plugin (`heroui()`) registers colors, spacing, radius tokens
- **Requires explicit `@source`** pointing to the theme package's dist folder
- The consumer must add the `@source` manually because `node_modules` is auto-ignored
- Path in `@source` depends on the CSS file's location relative to `node_modules`

### Key Insight

HeroUI requires the consumer to know about `@source` and configure it correctly. The path is fragile — it changes depending on the CSS file location and whether packages are hoisted or nested.

---

## Pattern 3: Copy-Paste + Tailwind — shadcn/ui

shadcn/ui is not a traditional npm library. Components are copied into the consumer's project via CLI.

### Consumer Setup (Tailwind v4)

```css
/* globals.css */
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0.004 285.82);
  --primary: oklch(0.205 0.042 265.76);
  /* ... many more variables ... */
}

.dark {
  --background: oklch(0.145 0.004 285.82);
  /* ... dark overrides ... */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... map all to Tailwind theme ... */
}
```

Adding components:

```bash
npx shadcn@latest add button
# Copies component source into components/ui/button.tsx
```

### How It Works

- Components are literally copied into `components/ui/` — the consumer owns the code
- Because components live in the consumer's source tree, Tailwind automatically scans them
- No `@source` issues, no plugin needed
- Themes are CSS variables that the consumer defines in their own globals.css
- Every component uses the same variable names (`--primary`, `--background`, `--foreground`)

### Key Insight

By placing components in the consumer's source tree, shadcn/ui completely sidesteps the `node_modules` scanning problem. The tradeoff is that consumers must manage component updates manually.

---

## Pattern 4: Pre-compiled CSS — Mantine

Mantine is fully independent from Tailwind. It ships pre-compiled CSS via CSS modules.

### Consumer Setup

```tsx
import '@mantine/core/styles.css';
```

Optional PostCSS preset:

```js
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
  },
};
```

### How It Works

- All component styles are CSS modules, compiled at library build time
- `@mantine/core/styles.css` contains all compiled component styles
- No Tailwind dependency at all
- Consumer just imports one CSS file
- Works with any framework, any build tool

### Tailwind Co-existence

Mantine can work alongside Tailwind, but:
- Must NOT include Tailwind's base/reset styles (they conflict with Mantine's)
- Cascade layers create precedence issues (`@layer`-ed rules have lower precedence than non-layered rules)

### Key Insight

Mantine proves that shipping pre-compiled CSS works perfectly when components don't use Tailwind utilities internally. The consumer gets zero-config styling at the cost of no Tailwind utility sharing.

---

## Pattern Comparison

| Aspect | DaisyUI (Plugin) | HeroUI (Plugin+React) | shadcn/ui (Copy) | Mantine (Pre-built) |
|--------|---|---|---|---|
| Consumer needs Tailwind | Yes | Yes | Yes | No |
| `@import "tailwindcss"` in library | No | No | N/A (no library CSS) | No |
| Source scanning issues | None (plugin injects) | Yes (needs `@source`) | None (in consumer tree) | None (pre-built) |
| Consumer config | `@plugin "daisyui"` | `@plugin` + `@source` | CSS vars + `@theme inline` | `import styles.css` |
| Customization | CSS vars, theme config | Tailwind `@theme` overrides | Edit CSS vars | Mantine theme provider |
| Bundle size control | Good (JIT) | Good (JIT + `@source`) | Best (only used components) | Moderate (all styles) |
| Dark mode | Data attribute themes | Provider + variants | CSS vars + `.dark` class | Theme provider |

---

## The `@plugin` Directive in Tailwind v4

In v4, plugins are loaded via CSS instead of JavaScript config:

```css
/* v3 (JavaScript) */
// tailwind.config.js
module.exports = { plugins: [require('daisyui')] }

/* v4 (CSS) */
@import "tailwindcss";
@plugin "daisyui";
```

For plugins with configuration:

```css
@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
}
```

For local plugins (wrapping a JS function):

```css
@plugin './hero.ts';
```

### Plugin API

Plugins receive Tailwind's API and call methods:

```js
export default function myPlugin({ addBase, addComponents, addUtilities, theme }) {
  addBase({ 'h1': { fontSize: theme('fontSize.2xl') } });
  addComponents({ '.btn': { padding: '0.5rem 1rem' } });
  addUtilities({ '.scrollbar-hidden': { '&::-webkit-scrollbar': { display: 'none' } } });
}
```

### When to Use a Plugin vs. CSS Theme File

| Use a plugin when... | Use a CSS theme file when... |
|---|---|
| Injecting semantic class names (`.btn`, `.card`) | Providing design tokens only |
| Classes must always exist (no source scanning) | Consumer uses standard Tailwind utilities |
| Complex component styles with variants | Simpler token-based theming |
| Need JavaScript logic for theme generation | Pure CSS is sufficient |

---

## `@source` Deep Dive

### Automatic Source Detection

Default behavior in Tailwind v4:
- Scans from `process.cwd()` (current working directory)
- Ignores `node_modules` (hardcoded exclusion)
- Ignores files in `.gitignore`
- Ignores binary files, CSS files, lock files

### `@source` Directive

```css
@source "../node_modules/@acmecorp/ui-lib";
@source "./components/**/*.{ts,tsx}";
```

Paths resolve **relative to the CSS file containing the directive**.

### `source()` on `@import`

```css
@import "tailwindcss" source("./src");
```

Overrides the default `cwd()` base for automatic scanning. Useful in monorepos.

### `source(none)` — Explicit-Only Mode

```css
@import "tailwindcss" source(none);
@source "./src/app";
@source "./src/components";
```

Disables automatic scanning entirely. Only explicitly registered sources are scanned.

### Library Pattern for `@source`

A library ships `@source` in its CSS file. When the consumer imports this CSS, the directive propagates:

```css
/* Library: theme.css */
@source "./components/**/*.{ts,tsx}";
@theme { --color-brand: oklch(0.6 0.2 260); }
```

```css
/* Consumer: globals.css */
@import "tailwindcss";
@import "@my-lib/theme.css";
/* @source from theme.css is now active — scans library's components */
```

### Known Issues

- **GitHub #19040**: `@source` may fail to scan inside `node_modules` in some build tool configurations
- **Symlinks**: `bun link` / `npm link` resolve to the original path, not the `node_modules` symlink path. This can cause `@source` relative paths to resolve differently than in a normal install.
- **Workaround**: If `@source` from the library doesn't work, the consumer adds their own: `@source "../node_modules/@policyengine/ui-kit/src";`

---

## Sources

- [Tailwind CSS v4 Theme docs](https://tailwindcss.com/docs/theme)
- [Tailwind CSS v4 Source Detection](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Tailwind CSS v4 Functions and Directives](https://tailwindcss.com/docs/functions-and-directives)
- [GitHub Discussion #17715 — Component Library Setup](https://github.com/tailwindlabs/tailwindcss/discussions/17715)
- [GitHub Discussion #18545 — Distributing Component Libraries](https://github.com/tailwindlabs/tailwindcss/discussions/18545)
- [GitHub Discussion #18758 — Styles Not Applying from Library](https://github.com/tailwindlabs/tailwindcss/discussions/18758)
- [GitHub Issue #18966 — @theme in Imported CSS](https://github.com/tailwindlabs/tailwindcss/issues/18966)
- [GitHub Issue #19040 — @source and node_modules](https://github.com/tailwindlabs/tailwindcss/issues/19040)
- [DaisyUI v5 Installation](https://daisyui.com/docs/install/)
- [HeroUI Tailwind v4 Guide](https://www.heroui.com/docs/guide/tailwind-v4)
- [shadcn/ui Tailwind v4 Docs](https://ui.shadcn.com/docs/tailwind-v4)
- [Mantine CSS Modules](https://mantine.dev/styles/css-modules/)
