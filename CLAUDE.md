# @policyengine/ui-kit

PolicyEngine UI kit — design tokens, Tailwind CSS v4 theme, and React 19 components for dashboards and calculators.

## Commands

- Install: `bun install`
- Build: `bun run build`
- Test: `bun run test`
- Type check: `bun run typecheck`

## Architecture

- **Vite library mode** — builds ESM + CJS + types + styles.css
- **Tailwind CSS v4** with `tw:` prefix (mirrors policyengine-app-v2)
- **CVA** (class-variance-authority) for component variants
- **Recharts** for chart components (peer dependency)

## Design tokens

Tokens are in `src/tokens/` — colors, typography, spacing, charts. These are the source of truth for all PolicyEngine applications. The same values appear as CSS custom properties in `src/app.css` via the `@theme` block.

## Styling rules

- All Tailwind classes use `tw:` prefix (e.g. `tw:bg-primary-500`)
- Use `cn()` from `src/utils/cn.ts` for class merging
- Never hardcode hex colors — use token classes or imports
- Sentence case for all UI text
- Every component accepts `className` and `styles` props
