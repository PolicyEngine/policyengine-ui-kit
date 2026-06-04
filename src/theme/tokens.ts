/**
 * @policyengine/ui-kit canonical design tokens.
 *
 * This is the single source of truth for every PolicyEngine frontend.
 * `scripts/generate-css.ts` reads this file and writes:
 *
 *   - `src/theme/tokens.css`  → `@import "@policyengine/ui-kit/theme.css"`
 *   - `src/theme/quarto.scss` → `@import "@policyengine/ui-kit/quarto.scss"`
 *
 * The same values are also re-exported as runtime constants for callers that
 * need a hex string in JavaScript (chart configs, Plotly props, dynamic
 * inline styles, etc.). See `colors`, `chartColors`, and `tokens` below.
 *
 * After editing this file, run `bun run generate-tokens` to regenerate
 * `tokens.css` and `quarto.scss`. CI fails if they drift.
 */

type CssDeclarations = Record<string, string>;

/** A named section of CSS declarations; shows up as a comment in tokens.css. */
export type CssSection = {
  name: string;
  declarations: CssDeclarations;
};

// ---------- Layer 1: shadcn-style :root tokens (light mode) ----------

const rootBaseLightSection: CssSection = {
  name: "Base",
  declarations: {
    "--radius": "6px",
  },
};

const lightSections: CssSection[] = [
  {
    name: "Page",
    declarations: {
      "--background": "#FFFFFF",
      "--foreground": "#000000",
    },
  },
  {
    name: "Primary (teal brand)",
    declarations: {
      "--primary": "#2C7A7B",
      "--primary-foreground": "#FFFFFF",
    },
  },
  {
    name: "Secondary",
    declarations: {
      "--secondary": "#F2F4F7",
      "--secondary-foreground": "#101828",
    },
  },
  {
    name: "Muted",
    declarations: {
      "--muted": "#F2F4F7",
      "--muted-foreground": "#475569",
    },
  },
  {
    name: "Accent",
    declarations: {
      "--accent": "#F2F4F7",
      "--accent-foreground": "#101828",
    },
  },
  {
    name:
      "Destructive (shadcn convention). Background bumped from #EF4444 " +
      "(red-500, fails 4.5:1 on white) to #DC2626 (red-600, 4.83:1).",
    declarations: {
      "--destructive": "#DC2626",
      "--destructive-foreground": "#FFFFFF",
    },
  },
  {
    // --ring at teal-500 (#319795) clears WCAG SC 1.4.11 (3:1 non-text)
    // against white at 3.51:1 — only ~0.5 above the floor. If you nudge the
    // ring lighter (toward teal-400), re-verify against the contrast matrix.
    name: "Chrome",
    declarations: {
      "--border": "#E2E8F0",
      "--input": "#E2E8F0",
      "--ring": "#319795",
    },
  },
  {
    name: "Card",
    declarations: {
      "--card": "#FFFFFF",
      "--card-foreground": "#000000",
    },
  },
  {
    name: "Popover",
    declarations: {
      "--popover": "#FFFFFF",
      "--popover-foreground": "#000000",
    },
  },
  {
    name: "Charts (shadcn chart-1 through chart-5)",
    declarations: {
      "--chart-1": "#319795",
      "--chart-2": "#0EA5E9",
      "--chart-3": "#285E61",
      "--chart-4": "#026AA2",
      "--chart-5": "#64748B",
    },
  },
  {
    name: "Background variants",
    declarations: {
      "--background-secondary": "#f5f9ff",
      "--background-tertiary": "#f1f5f9",
    },
  },
  {
    name: "Border scale",
    declarations: {
      "--border-light": "#e2e8f0",
      "--border-medium": "#CBD5E1",
      "--border-dark": "#94A3B8",
    },
  },
  {
    name: "Text semantic aliases",
    declarations: {
      "--text-primary": "#000000",
      "--text-secondary": "#5a5a5a",
      // gray-500: meets WCAG AA (4.5:1) as normal text on white and on
      // --background-secondary. The prior #94A3B8 was ~2.6:1 and failed,
      // forcing consumers to override muted text per app. Dark mode (below)
      // keeps #94A3B8, which is 7.5:1 on the dark background.
      "--text-tertiary": "#64748B",
      "--text-inverse": "#ffffff",
    },
  },
  {
    name:
      "Accessible-on-white text variants. Distinct from --color-warning / " +
      "--color-error / --color-success fill values, which are tuned for " +
      "badges and status dots and do not always clear WCAG AA when used as text.",
    declarations: {
      "--text-warning": "#c2410c", // Tailwind orange-700; AA on white (5.18:1)
      "--text-error": "#B91C1C", // Tailwind red-700; AA on white (6.47:1)
      "--text-success": "#285E61", // primary[700]; AA on white (7.07:1)
    },
  },
  {
    name: "Diverging color scales",
    declarations: {
      "--diverging-gray-teal-1": "#475569",
      "--diverging-gray-teal-2": "#94A3B8",
      "--diverging-gray-teal-3": "#E2E8F0",
      "--diverging-gray-teal-4": "#81E6D9",
      "--diverging-gray-teal-5": "#319795",

      "--diverging-gray-blue-1": "#475569",
      "--diverging-gray-blue-2": "#94A3B8",
      "--diverging-gray-blue-3": "#E2E8F0",
      "--diverging-gray-blue-4": "#7DD3FC",
      "--diverging-gray-blue-5": "#0EA5E9",
    },
  },
  {
    name: "Primary alpha variants",
    declarations: {
      "--primary-alpha-40": "rgba(44, 122, 123, 0.4)",
      "--primary-alpha-50": "rgba(44, 122, 123, 0.5)",
      "--primary-alpha-60": "rgba(44, 122, 123, 0.6)",
    },
  },
  {
    name: "Warm neutral",
    declarations: {
      "--warm-neutral": "#F9F2EA",
    },
  },
];

// ---------- Layer 1b: dark-mode overrides ----------

/**
 * Dark-mode overrides. Only tokens whose value differs from light mode appear
 * here. Activated by adding `class="dark"` to any ancestor (typically the
 * `<html>` element) — see the `@custom-variant dark` declaration in the
 * generated CSS.
 *
 * Picked to clear WCAG AA on the corresponding dark surface; the contrast
 * matrix in `tests/theme/contrast.test.ts` enforces this.
 */
const darkSections: CssSection[] = [
  {
    name: "Page",
    declarations: {
      "--background": "#0B0E14",
      "--foreground": "#F5F5F5",
    },
  },
  {
    name: "Primary (lifted up the teal scale so it pops on dark)",
    declarations: {
      "--primary": "#38B2AC",
      "--primary-foreground": "#0B0E14",
    },
  },
  {
    name: "Secondary",
    declarations: {
      "--secondary": "#1E293B",
      "--secondary-foreground": "#F5F5F5",
    },
  },
  {
    name: "Muted",
    declarations: {
      "--muted": "#1A2030",
      "--muted-foreground": "#9CA3AF",
    },
  },
  {
    name: "Accent",
    declarations: {
      "--accent": "#1E293B",
      "--accent-foreground": "#F5F5F5",
    },
  },
  {
    name: "Destructive",
    declarations: {
      "--destructive": "#F87171",
      "--destructive-foreground": "#0B0E14",
    },
  },
  {
    name:
      "Chrome. --border bumped from #1E293B (1.32:1 on background, 1.22:1 " +
      "on card — visually invisible) to #334155 (1.87:1 on bg, 1.57:1 on " +
      "card).",
    declarations: {
      "--border": "#334155",
      "--input": "#334155",
      "--ring": "#38B2AC",
    },
  },
  {
    name:
      "Card. Bumped from #131820 (1.08:1 on background — invisible) to " +
      "#1A2030 (1.19:1 on bg). Together with the bumped --border, the card " +
      "surface is now clearly distinguishable.",
    declarations: {
      "--card": "#1A2030",
      "--card-foreground": "#F5F5F5",
    },
  },
  {
    name: "Popover",
    declarations: {
      "--popover": "#1A2030",
      "--popover-foreground": "#F5F5F5",
    },
  },
  {
    name: "Charts (lifted up the brand scale for dark backgrounds)",
    declarations: {
      "--chart-1": "#4FD1C5",
      "--chart-2": "#38BDF8",
      "--chart-3": "#81E6D9",
      "--chart-4": "#7DD3FC",
      "--chart-5": "#94A3B8",
    },
  },
  {
    name: "Background variants",
    declarations: {
      "--background-secondary": "#0B0E14",
      "--background-tertiary": "#0F1320",
    },
  },
  {
    name: "Border scale",
    declarations: {
      "--border-light": "#1E293B",
      "--border-medium": "#334155",
      "--border-dark": "#475569",
    },
  },
  {
    name: "Text semantic aliases",
    declarations: {
      "--text-primary": "#F5F5F5",
      "--text-secondary": "#CBD5E1",
      "--text-tertiary": "#94A3B8",
      "--text-inverse": "#000000",
    },
  },
  {
    name: "Accessible-on-dark text variants — picked at AA on #0B0E14",
    declarations: {
      "--text-warning": "#FFB066", // 8.41:1 on #0B0E14
      "--text-error": "#F87171", // 4.83:1 on #0B0E14
      "--text-success": "#4FD1C5", // 8.61:1 on #0B0E14
    },
  },
  {
    name: "Primary alpha variants (re-tuned for dark primary)",
    declarations: {
      "--primary-alpha-40": "rgba(56, 178, 172, 0.4)",
      "--primary-alpha-50": "rgba(56, 178, 172, 0.5)",
      "--primary-alpha-60": "rgba(56, 178, 172, 0.6)",
    },
  },
];

// ---------- Layer 2: Tailwind @theme inline (CSS-var bridges) ----------

const themeInlineSections: CssSection[] = [
  {
    name:
      "Semantic colors → Tailwind classes (bg-primary, text-foreground, etc.)",
    declarations: {
      "--color-background": "var(--background)",
      "--color-foreground": "var(--foreground)",
      "--color-primary": "var(--primary)",
      "--color-primary-foreground": "var(--primary-foreground)",
      "--color-secondary": "var(--secondary)",
      "--color-secondary-foreground": "var(--secondary-foreground)",
      "--color-muted": "var(--muted)",
      "--color-muted-foreground": "var(--muted-foreground)",
      "--color-accent": "var(--accent)",
      "--color-accent-foreground": "var(--accent-foreground)",
      "--color-destructive": "var(--destructive)",
      "--color-destructive-foreground": "var(--destructive-foreground)",
      "--color-warning-foreground": "var(--text-warning)",
      "--color-error-foreground": "var(--text-error)",
      "--color-success-foreground": "var(--text-success)",
      "--color-border": "var(--border)",
      "--color-input": "var(--input)",
      "--color-ring": "var(--ring)",
      "--color-card": "var(--card)",
      "--color-card-foreground": "var(--card-foreground)",
      "--color-popover": "var(--popover)",
      "--color-popover-foreground": "var(--popover-foreground)",
      "--color-chart-1": "var(--chart-1)",
      "--color-chart-2": "var(--chart-2)",
      "--color-chart-3": "var(--chart-3)",
      "--color-chart-4": "var(--chart-4)",
      "--color-chart-5": "var(--chart-5)",
    },
  },
  {
    name: "Additional backgrounds",
    declarations: {
      "--color-background-secondary": "var(--background-secondary)",
      "--color-background-tertiary": "var(--background-tertiary)",
    },
  },
  {
    name: "Border scale",
    declarations: {
      "--color-border-light": "var(--border-light)",
      "--color-border-medium": "var(--border-medium)",
      "--color-border-dark": "var(--border-dark)",
    },
  },
  {
    name: "Diverging color scales",
    declarations: {
      "--color-diverging-gray-teal-1": "var(--diverging-gray-teal-1)",
      "--color-diverging-gray-teal-2": "var(--diverging-gray-teal-2)",
      "--color-diverging-gray-teal-3": "var(--diverging-gray-teal-3)",
      "--color-diverging-gray-teal-4": "var(--diverging-gray-teal-4)",
      "--color-diverging-gray-teal-5": "var(--diverging-gray-teal-5)",

      "--color-diverging-gray-blue-1": "var(--diverging-gray-blue-1)",
      "--color-diverging-gray-blue-2": "var(--diverging-gray-blue-2)",
      "--color-diverging-gray-blue-3": "var(--diverging-gray-blue-3)",
      "--color-diverging-gray-blue-4": "var(--diverging-gray-blue-4)",
      "--color-diverging-gray-blue-5": "var(--diverging-gray-blue-5)",
    },
  },
  {
    name: "Primary alpha variants",
    declarations: {
      "--color-primary-alpha-40": "var(--primary-alpha-40)",
      "--color-primary-alpha-50": "var(--primary-alpha-50)",
      "--color-primary-alpha-60": "var(--primary-alpha-60)",
    },
  },
  {
    name: "Warm neutral",
    declarations: {
      "--color-warm-neutral": "var(--warm-neutral)",
    },
  },
  {
    name: "Radius derived from base --radius",
    declarations: {
      "--radius-sm": "calc(var(--radius) - 2px)",
      "--radius-md": "var(--radius)",
      "--radius-lg": "calc(var(--radius) + 2px)",
      "--radius-xl": "calc(var(--radius) + 6px)",
    },
  },
];

// ---------- Layer 3: brand palette + scales ----------

export const palette = {
  teal: {
    50: "#E6FFFA",
    100: "#B2F5EA",
    200: "#81E6D9",
    300: "#4FD1C5",
    400: "#38B2AC",
    500: "#319795",
    600: "#2C7A7B",
    700: "#285E61",
    800: "#234E52",
    900: "#1D4044",
  },
  gray: {
    50: "#F0F9FF",
    100: "#F2F4F7",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#344054",
    800: "#1E293B",
    900: "#101828",
  },
  blue: {
    50: "#F0F9FF",
    100: "#E0F2FE",
    200: "#BAE6FD",
    300: "#7DD3FC",
    400: "#38BDF8",
    500: "#0EA5E9",
    600: "#0284C7",
    700: "#026AA2",
    800: "#075985",
    900: "#0C4A6E",
  },
} as const;

export const semanticFills = {
  success: "#22C55E",
  warning: "#FEC601",
  error: "#EF4444",
  info: "#1890FF",
} as const;

export const typography = {
  fontFamily: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'JetBrains Mono, "Fira Code", Consolas, monospace',
  },
  fontSize: {
    xs: { size: "12px", lineHeight: "16px" },
    sm: { size: "14px", lineHeight: "20px" },
    base: { size: "16px", lineHeight: "24px" },
    lg: { size: "18px", lineHeight: "28px" },
    xl: { size: "20px", lineHeight: "28px" },
    "2xl": { size: "24px", lineHeight: "32px" },
    "3xl": { size: "28px", lineHeight: "36px" },
    "4xl": { size: "32px", lineHeight: "40px" },
    "5xl": { size: "3rem", lineHeight: "1" },
    "6xl": { size: "3.75rem", lineHeight: "1" },
    "7xl": { size: "4.5rem", lineHeight: "1" },
    "8xl": { size: "6rem", lineHeight: "1" },
    "9xl": { size: "8rem", lineHeight: "1" },
  },
} as const;

export const radius = {
  chip: "2px",
  element: "4px",
  container: "8px",
  feature: "12px",
} as const;

export const namedSpacing = {
  header: "58px",
  sidebar: "280px",
  "sidebar-width": "280px",
  content: "976px",
} as const;

export const breakpoints = {
  xs: "36rem",
  sm: "48rem",
  md: "62rem",
  lg: "75rem",
  xl: "88rem",
  "2xl": "96rem",
} as const;

// ---------- Re-exports / convenience aggregates ----------

function flatten(sections: CssSection[]): CssDeclarations {
  return sections.reduce<CssDeclarations>(
    (acc, section) => Object.assign(acc, section.declarations),
    {},
  );
}

export const rootBaseLight = rootBaseLightSection.declarations;
export const rootBaseLightSections: CssSection[] = [rootBaseLightSection];

export const rootColorsLight = flatten(lightSections);
export const rootColorsLightSections = lightSections;

export const rootColorsDark = flatten(darkSections);
export const rootColorsDarkSections = darkSections;

export const themeInline = flatten(themeInlineSections);
export const themeInlineSectionsExport = themeInlineSections;

// ---------- Ergonomic runtime facade ----------

/**
 * Flattened color tokens for runtime use in JS contexts that need a literal
 * hex string (Plotly traces, dynamic inline styles, generated email
 * templates). For Tailwind CSS or Recharts, prefer `var(--color-…)` strings
 * — they pick up dark-mode automatically.
 */
export const colors = {
  primary: rootColorsLight["--primary"],
  primaryForeground: rootColorsLight["--primary-foreground"],
  background: rootColorsLight["--background"],
  foreground: rootColorsLight["--foreground"],
  textPrimary: rootColorsLight["--text-primary"],
  textSecondary: rootColorsLight["--text-secondary"],
  textTertiary: rootColorsLight["--text-tertiary"],
  textWarning: rootColorsLight["--text-warning"],
  textError: rootColorsLight["--text-error"],
  textSuccess: rootColorsLight["--text-success"],
  warning: semanticFills.warning,
  error: semanticFills.error,
  success: semanticFills.success,
  info: semanticFills.info,
  border: rootColorsLight["--border"],
  borderLight: rootColorsLight["--border-light"],
  borderMedium: rootColorsLight["--border-medium"],
  borderDark: rootColorsLight["--border-dark"],
  card: rootColorsLight["--card"],
  muted: rootColorsLight["--muted"],
  mutedForeground: rootColorsLight["--muted-foreground"],
  teal: palette.teal,
  gray: palette.gray,
  blue: palette.blue,
} as const;

/**
 * Chart series presets indexed by chart-N slot, in three flavors:
 *
 *   - `chartPalette.vars`  → use as `fill="var(--chart-1)"` (tracks dark mode)
 *   - `chartPalette.light` → resolved light-mode hex (Plotly / static configs)
 *   - `chartPalette.dark`  → resolved dark-mode hex
 *
 * For the Recharts wrappers, `src/charts/chartDefaults.ts` exposes a
 * named-slot `chartColors` (primary/secondary/positive/negative/series).
 * Use this `chartPalette` when you need the indexed slots or a dark-mode
 * hex literal.
 */
export const chartPalette = {
  vars: {
    1: "var(--chart-1)",
    2: "var(--chart-2)",
    3: "var(--chart-3)",
    4: "var(--chart-4)",
    5: "var(--chart-5)",
  },
  light: {
    1: rootColorsLight["--chart-1"],
    2: rootColorsLight["--chart-2"],
    3: rootColorsLight["--chart-3"],
    4: rootColorsLight["--chart-4"],
    5: rootColorsLight["--chart-5"],
  },
  dark: {
    1: rootColorsDark["--chart-1"],
    2: rootColorsDark["--chart-2"],
    3: rootColorsDark["--chart-3"],
    4: rootColorsDark["--chart-4"],
    5: rootColorsDark["--chart-5"],
  },
} as const;

/** Aggregate of every token group, useful for tooling and tests. */
export const tokens = {
  rootBaseLight,
  rootColorsLight,
  rootColorsDark,
  themeInline,
  palette,
  semanticFills,
  typography,
  radius,
  namedSpacing,
  breakpoints,
} as const;

// ---------- Contrast metadata ----------

export type ContrastPair = {
  description: string;
  fg: string;
  bg: string;
  /** WCAG SC 1.4.3 normal-text minimum is 4.5; 1.4.11 non-text is 3.0. */
  minRatio: number;
  /** Mode the pair is documented to apply in. */
  mode: "light" | "dark";
};

/**
 * Documented accessible-pair guarantees. The ratios here are the AA minimums;
 * the actual computed ratios are larger. Asserted in
 * `tests/theme/contrast.test.ts`.
 */
export const contrastPairs: readonly ContrastPair[] = [
  // ----- Light mode -----
  {
    description: "foreground on background (light)",
    fg: rootColorsLight["--foreground"],
    bg: rootColorsLight["--background"],
    minRatio: 4.5,
    mode: "light",
  },
  {
    description: "text-primary on background (light)",
    fg: rootColorsLight["--text-primary"],
    bg: rootColorsLight["--background"],
    minRatio: 4.5,
    mode: "light",
  },
  {
    description: "text-secondary on background (light)",
    fg: rootColorsLight["--text-secondary"],
    bg: rootColorsLight["--background"],
    minRatio: 4.5,
    mode: "light",
  },
  {
    description: "text-warning on background (light)",
    fg: rootColorsLight["--text-warning"],
    bg: rootColorsLight["--background"],
    minRatio: 4.5,
    mode: "light",
  },
  {
    description: "text-error on background (light)",
    fg: rootColorsLight["--text-error"],
    bg: rootColorsLight["--background"],
    minRatio: 4.5,
    mode: "light",
  },
  {
    description: "text-success on background (light)",
    fg: rootColorsLight["--text-success"],
    bg: rootColorsLight["--background"],
    minRatio: 4.5,
    mode: "light",
  },
  {
    description: "primary-foreground on primary (light)",
    fg: rootColorsLight["--primary-foreground"],
    bg: rootColorsLight["--primary"],
    minRatio: 4.5,
    mode: "light",
  },
  {
    description: "destructive-foreground on destructive (light)",
    fg: rootColorsLight["--destructive-foreground"],
    bg: rootColorsLight["--destructive"],
    minRatio: 4.5,
    mode: "light",
  },
  {
    description: "muted-foreground on muted (light)",
    fg: rootColorsLight["--muted-foreground"],
    bg: rootColorsLight["--muted"],
    minRatio: 4.5,
    mode: "light",
  },
  {
    // SC 1.4.11 (Non-text Contrast, AA): focus indicators must clear 3:1
    // against the adjacent background. The ring sits on --background, so we
    // pin its visibility there.
    description: "ring on background (light, non-text)",
    fg: rootColorsLight["--ring"],
    bg: rootColorsLight["--background"],
    minRatio: 3,
    mode: "light",
  },
  {
    // Default link styling resolves to teal-600. Asserted as small-text AA so
    // links stay legible inside paragraph copy.
    description: "link (teal-600) on background (light)",
    fg: palette.teal[600],
    bg: rootColorsLight["--background"],
    minRatio: 4.5,
    mode: "light",
  },
  // ----- Dark mode -----
  {
    description: "foreground on background (dark)",
    fg: rootColorsDark["--foreground"],
    bg: rootColorsDark["--background"],
    minRatio: 4.5,
    mode: "dark",
  },
  {
    description: "text-primary on background (dark)",
    fg: rootColorsDark["--text-primary"],
    bg: rootColorsDark["--background"],
    minRatio: 4.5,
    mode: "dark",
  },
  {
    description: "text-secondary on background (dark)",
    fg: rootColorsDark["--text-secondary"],
    bg: rootColorsDark["--background"],
    minRatio: 4.5,
    mode: "dark",
  },
  {
    description: "text-warning on background (dark)",
    fg: rootColorsDark["--text-warning"],
    bg: rootColorsDark["--background"],
    minRatio: 4.5,
    mode: "dark",
  },
  {
    description: "text-error on background (dark)",
    fg: rootColorsDark["--text-error"],
    bg: rootColorsDark["--background"],
    minRatio: 4.5,
    mode: "dark",
  },
  {
    description: "text-success on background (dark)",
    fg: rootColorsDark["--text-success"],
    bg: rootColorsDark["--background"],
    minRatio: 4.5,
    mode: "dark",
  },
  {
    description: "primary on background (dark)",
    fg: rootColorsDark["--primary"],
    bg: rootColorsDark["--background"],
    minRatio: 4.5,
    mode: "dark",
  },
  {
    description: "muted-foreground on card (dark)",
    fg: rootColorsDark["--muted-foreground"],
    bg: rootColorsDark["--card"],
    minRatio: 4.5,
    mode: "dark",
  },
  {
    // Dark-mode primary fill (teal-400) is light enough that we can ink it
    // with near-black text. Pin the AA guarantee.
    description: "primary-foreground on primary (dark)",
    fg: rootColorsDark["--primary-foreground"],
    bg: rootColorsDark["--primary"],
    minRatio: 4.5,
    mode: "dark",
  },
  {
    // Same pattern for destructive: dark-mode destructive is red-400, so we
    // ink with near-black to clear AA.
    description: "destructive-foreground on destructive (dark)",
    fg: rootColorsDark["--destructive-foreground"],
    bg: rootColorsDark["--destructive"],
    minRatio: 4.5,
    mode: "dark",
  },
  {
    // Focus indicator must clear SC 1.4.11 (3:1 non-text) against the
    // adjacent background in dark mode too.
    description: "ring on background (dark, non-text)",
    fg: rootColorsDark["--ring"],
    bg: rootColorsDark["--background"],
    minRatio: 3,
    mode: "dark",
  },
];
