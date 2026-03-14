# @policyengine/ui-kit

PolicyEngine UI kit — CSS-first design tokens, Tailwind CSS v4 theme, shadcn/ui primitives, and React 19 components for dashboards and calculators.

## Commands

- Install: `bun install`
- Build: `bun run build`
- Test: `bun run test`
- Type check: `bun run typecheck`
- Demo: `bun run dev:demo`

## Architecture

- **Vite library mode** — builds ESM + CJS + types + styles.css
- **Tailwind CSS v4** with standard class names (no prefix)
- **shadcn/ui** pattern for primitives (Button, Badge, Card, Tabs)
- **CVA** (class-variance-authority) for component variants
- **Recharts** for chart components (peer dependency)

## Design tokens

Tokens are in `src/theme/tokens.css` — the single source of truth for all frontend projects. This CSS file defines:

1. **Layer 1 (`:root`)**: shadcn/ui semantic variables (`--primary`, `--background`, `--chart-1`, etc.)
2. **Layer 2 (`@theme inline`)**: Bridges `:root` vars to Tailwind utilities (`bg-primary`, `text-foreground`)
3. **Layer 3 (`@theme`)**: Brand palette (`bg-teal-500`, `text-gray-600`), font sizes, spacing, breakpoints

Consumers import: `@import "@policyengine/ui-kit/theme.css";`

## Styling rules

- Use standard Tailwind classes (`bg-primary`, `text-muted-foreground`, `border-border`, `rounded-lg`)
- Use brand palette classes for specific colors (`bg-teal-500`, `text-gray-600`)
- Use `cn()` from `src/utils/cn.ts` for class merging
- Recharts charts use CSS vars directly: `fill="var(--chart-1)"`
- Never hardcode hex colors in component code
- Sentence case for all UI text
- Every component accepts `className` and `styles` props
