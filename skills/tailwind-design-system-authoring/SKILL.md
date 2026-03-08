---
name: tailwind-design-system-authoring
description: |
  This skill should be used when modifying the ui-kit's CSS theme, adding new design tokens,
  creating new component styles, or working on the ui-kit's build pipeline and package exports.
  Triggers: "add token", "design token", "theme.css", "tokens.css", "@theme", "ui-kit styling",
  "add color", "add spacing", "component style", "base styles", "ui-kit architecture",
  "how do Tailwind UI kits work", "authoring pattern", "@source", "package exports"
---

# Tailwind v4 Design System Authoring

Canonical patterns for building a Tailwind CSS v4-based UI kit that other applications import. This skill codifies how production libraries (DaisyUI, HeroUI, shadcn/ui, Mantine) structure their styling and what the Tailwind maintainers recommend for shared CSS packages.

## The Cardinal Rule

**The library must NOT contain `@import "tailwindcss"`.** The consumer owns that import. Every major Tailwind-based library follows this rule, and the Tailwind maintainers explicitly recommend it (GitHub discussions #17715, #18545, #18758).

Including `@import "tailwindcss"` inside the library causes:
- Double Tailwind (double preflight resets, double theme layers) if the consumer also imports it
- Source detection scanning from the library's directory instead of the consumer's project
- Utility classes for consumer components not being generated

## Architecture of a Tailwind v4 Theme File

The library ships a CSS file with tokens, source directives, and base styles — but no Tailwind import:

```css
/* src/theme/tokens.css — NO @import "tailwindcss" */
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

/* Source detection: tell Tailwind to scan ALL library source files */
@source "../**/*.{ts,tsx}";

/* Layer 1: Raw CSS variables (shadcn/ui convention) */
:root {
  --primary: #2C7A7B;
  --background: #FFFFFF;
  /* ... */
}

/* Layer 2: Bridge to Tailwind utilities */
@theme inline {
  --color-primary: var(--primary);
  --color-background: var(--background);
  /* ... */
}

/* Layer 3: Static brand palette + typography + spacing */
@theme {
  --color-teal-500: #319795;
  --font-sans: Inter, sans-serif;
  --text-sm: 14px;
  /* ... */
}

/* Layer 4: Base element styles */
@layer base {
  body { @apply bg-background text-foreground; }
}
```

## `@theme` Variants — When to Use Each

| Directive | Creates `:root` vars | Generates utilities | Use case |
|-----------|:---:|:---:|---|
| `@theme` | Yes | Yes | Static literal values (hex colors, pixel sizes, font stacks) |
| `@theme inline` | No | Yes (inlines the expression) | Values referencing CSS variables (`var(--something)`) |
| `@theme static` | Yes (all, even unused) | Yes | Libraries needing all tokens available regardless of usage |
| `@theme reference` | Yes | No | Reference-only tokens, no utility generation |

**Critical rule:** Use `@theme inline` whenever the value contains `var()`. Using plain `@theme` with `var()` bakes the literal string `var(--x)` at build time, breaking runtime resolution (dark mode, contextual overrides).

## `@source` for Library Component Scanning

Tailwind v4 auto-ignores `node_modules/`. Without an explicit `@source`, utility classes used inside the library's own components will never be generated during the consumer's build — the consumer will see those classes in the rendered HTML but they'll have no effect.

**Use a wildcard glob that covers all source files, not a hardcoded directory name:**

```css
/* In src/theme/tokens.css */
@source "../**/*.{ts,tsx}";
```

This scans every `.ts` and `.tsx` file under `src/` (relative to the CSS file). It is resilient to directory renames and restructuring — new component folders are automatically included.

**Do NOT hardcode specific directory names** like `@source "../components/**/*.{ts,tsx}"`. If the library organizes components into `charts/`, `display/`, `inputs/`, `layout/`, etc., a hardcoded `../components/` matches nothing and silently fails — utility classes from those components will be missing in the consumer's build with no error.

**Path resolution:** `@source` paths resolve **relative to the CSS file they appear in**, not `process.cwd()`. When `tokens.css` lives at `src/theme/tokens.css`, the `../` resolves to `src/`.

**Verification procedure** — run this after any `@source` change or directory restructure:

1. List the library's actual source directories:
   ```bash
   ls -d src/*/
   ```
2. Confirm the `@source` glob in `tokens.css` covers all directories that contain components (any `.tsx` file with `className=`):
   ```bash
   grep -rl 'className=' src/ --include='*.tsx' | head -20
   ```
3. Verify the glob matches those files. From `src/theme/` (where tokens.css lives), `../**/*.{ts,tsx}` should match everything under `src/`.

**Consumer-side note:** The consumer does NOT need its own `@source` directive. `@import "tailwindcss"` triggers automatic source detection from `process.cwd()`, which scans the consumer's `app/`, `components/`, `src/`, etc. The `@source` in the library's CSS only exists to cover the library's own files inside `node_modules/`.

## Package Exports

The `package.json` must export the theme CSS so consumers can import it:

```json
{
  "exports": {
    ".": { "import": "./dist/index.js" },
    "./theme.css": "./src/theme/tokens.css"
  },
  "files": ["dist", "src/theme"]
}
```

**Critical:** The `files` field must include the theme source directory. If `files` only lists `dist`, the theme CSS will be missing from the published npm package.

Exporting source CSS (not pre-built) is correct — the consumer's `@tailwindcss/postcss` processes it during their build, which is how `@theme` and `@source` directives work.

## The Four Industry Patterns

For detailed examples of how DaisyUI, HeroUI, shadcn/ui, and Mantine handle styling, consult:
- **`references/industry-patterns.md`** — Detailed breakdown of each library's approach

### Quick Summary

| Pattern | Example | Consumer needs Tailwind? |
|---------|---------|:---:|
| **Tailwind Plugin** (`@plugin`) | DaisyUI, HeroUI | Yes |
| **CSS Theme File** (`@import`) | This ui-kit | Yes |
| **Copy-Paste** | shadcn/ui | Yes |
| **Pre-compiled CSS** | Mantine | No |

PolicyEngine uses the **CSS Theme File** pattern — the simplest approach that still gives consumers full Tailwind utility access.

## What NOT to Do

1. **Do not include `@import "tailwindcss"` in the library's CSS** — the consumer owns this
2. **Do not use `@theme` for values containing `var()`** — use `@theme inline` instead
3. **Do not create `tailwind.config.ts`** — Tailwind v4 is CSS-first, all config lives in `@theme` blocks
4. **Do not ship pre-compiled utility classes alongside raw tokens** — pick one pattern (pre-compiled OR theme file, not both in the same export)
5. **Do not rely on automatic source detection for library components** — `node_modules` is auto-ignored; always include explicit `@source` directives
6. **Do not hardcode directory names in `@source`** — use `@source "../**/*.{ts,tsx}"` to cover all source files; hardcoded paths like `../components/` silently break when the directory structure changes
7. **Do not use Sass, Less, or CSS Modules** — Tailwind v4 is incompatible with preprocessors and CSS Modules cause performance problems

## Known Tailwind v4 Issues

- **[#19040](https://github.com/tailwindlabs/tailwindcss/issues/19040)**: `@source` may not reliably scan into `node_modules` in all environments
- **[#18966](https://github.com/tailwindlabs/tailwindcss/issues/18966)**: `@theme` in imported files may not be fully processed in edge cases
- **Symlinks** (`bun link`, `npm link`): Path resolution differs from nested `node_modules` installs — test with both during development

If `@source` or `@theme` in imported files proves unreliable, the escalation path is converting to a **Tailwind plugin** (`@plugin`) — see `references/industry-patterns.md` for the plugin pattern.

## Adding New Tokens

To add a new design token:

1. **Static literal value** (e.g., a new brand color):
   ```css
   @theme {
     --color-coral-500: #FF6B6B;
   }
   ```
   This creates `bg-coral-500`, `text-coral-500`, etc.

2. **Semantic token referencing a variable** (e.g., a new role):
   ```css
   :root { --success: #22C55E; }
   @theme inline { --color-success: var(--success); }
   ```
   This creates `bg-success`, `text-success` with runtime resolution.

3. **Non-color token** (spacing, breakpoint, font size):
   ```css
   @theme {
     --spacing-sidebar: 280px;    /* → w-sidebar, p-sidebar, etc. */
     --breakpoint-3xl: 120rem;    /* → 3xl: responsive prefix */
     --text-hero: 48px;           /* → text-hero */
     --text-hero--line-height: 56px;
   }
   ```

## Namespace Reference

| CSS variable prefix | Generated utilities | Example |
|---|---|---|
| `--color-*` | `bg-*`, `text-*`, `border-*`, `fill-*`, `stroke-*` | `--color-teal-500` |
| `--text-*` | `text-*` (font size) | `--text-sm: 14px` |
| `--font-*` | `font-*` (font family) | `--font-sans` |
| `--font-weight-*` | `font-*` (weight) | `--font-weight-bold` |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*` | `--spacing-header: 58px` |
| `--radius-*` | `rounded-*` | `--radius-lg` |
| `--breakpoint-*` | Responsive prefixes (`sm:`, `md:`) | `--breakpoint-md: 62rem` |
| `--shadow-*` | `shadow-*` | `--shadow-lg` |

## Related Resources

- **`references/industry-patterns.md`** — How DaisyUI, HeroUI, shadcn/ui, and Mantine handle Tailwind
- [Tailwind v4 Theme docs](https://tailwindcss.com/docs/theme)
- [Tailwind v4 Source Detection](https://tailwindcss.com/docs/detecting-classes-in-source-files)
- [Tailwind v4 Functions and Directives](https://tailwindcss.com/docs/functions-and-directives)
