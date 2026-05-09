/**
 * Regenerate src/theme/tokens.css and src/theme/quarto.scss from
 * the canonical TS source in src/theme/tokens.ts.
 *
 * Run via `bun run generate-tokens` (or `tsx scripts/generate-css.ts`).
 *
 * The CI test in `tests/theme/generated-css.test.ts` re-runs this generator
 * and asserts the checked-in files match — so devs can't drift the CSS by
 * hand-editing.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import {
  breakpoints,
  namedSpacing,
  palette,
  radius,
  rootBaseLightSections,
  rootColorsDarkSections,
  rootColorsLight,
  rootColorsLightSections,
  semanticFills,
  themeInlineSectionsExport,
  typography,
  type CssSection,
} from "../src/theme/tokens";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const themeDir = path.resolve(__dirname, "..", "src", "theme");

const TOKENS_CSS = path.join(themeDir, "tokens.css");
const QUARTO_SCSS = path.join(themeDir, "quarto.scss");

const STATIC_HEADER = `@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@source "../../dist/**/*.js";

/* ============================================================
 * PolicyEngine Design Tokens — GENERATED FILE; DO NOT EDIT.
 *
 * Source of truth: src/theme/tokens.ts
 * Regenerate with:  bun run generate-tokens
 *
 * Consumer usage (globals.css):
 *   @import "tailwindcss";
 *   @import "@policyengine/ui-kit/theme.css";
 *
 * Both imports are required. Tailwind must come first.
 * The consumer must have @tailwindcss/postcss in their postcss config.
 * ============================================================ */`;

const STATIC_BASE_LAYER = `/* --- Base styles --- */
@layer base {
  * {
    @apply border-border;
  }
  html {
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body {
    @apply bg-background text-foreground;
    font-family: var(--font-sans);
    line-height: 1.55;
  }

  /* Range input (slider) */
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    height: 6px;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    background: var(--border);
    height: 6px;
    border-radius: 3px;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary);
    cursor: pointer;
    margin-top: -6px;
  }
  input[type="range"]::-moz-range-track {
    background: var(--border);
    height: 6px;
    border-radius: 3px;
  }
  input[type="range"]::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--primary);
    border: none;
    cursor: pointer;
  }

  /* Reduced motion: snap animations / transitions to instant. */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Visible focus ring on every interactive element. */
  :where(a, button, [role="button"], input, select, textarea, summary, [tabindex]):focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }
}`;

function indent(lines: string[], spaces = 2): string {
  const pad = " ".repeat(spaces);
  return lines.map((line) => (line ? `${pad}${line}` : line)).join("\n");
}

function entriesToDeclarations(entries: Record<string, string>): string[] {
  return Object.entries(entries).map(([key, value]) => `${key}: ${value};`);
}

function sectionsToLines(sections: CssSection[]): string[] {
  const lines: string[] = [];
  sections.forEach((section, index) => {
    if (index > 0) lines.push("");
    lines.push(`/* ${section.name} */`);
    lines.push(...entriesToDeclarations(section.declarations));
  });
  return lines;
}

function rootLightBlock(): string {
  const blockLines = [
    ...sectionsToLines(rootBaseLightSections),
    "",
    ...sectionsToLines(rootColorsLightSections),
  ];
  return [
    "/* --- Layer 1: shadcn-style :root tokens (light mode) --- */",
    ":root {",
    indent(blockLines),
    "}",
  ].join("\n");
}

function rootDarkBlock(): string {
  return [
    "",
    "/* --- Layer 1b: dark-mode overrides (activate with `class=\"dark\"` on a parent) --- */",
    ":root.dark,",
    ".dark {",
    indent(sectionsToLines(rootColorsDarkSections)),
    "}",
  ].join("\n");
}

function themeInlineBlock(): string {
  return [
    "",
    "/* --- Layer 2: Tailwind @theme inline (bridges :root vars to Tailwind utilities) --- */",
    "@theme inline {",
    indent(sectionsToLines(themeInlineSectionsExport)),
    "}",
  ].join("\n");
}

function brandPaletteBlock(): string {
  const declarations: string[] = [];
  declarations.push("/* Teal (primary brand) */");
  for (const [scale, value] of Object.entries(palette.teal)) {
    declarations.push(`--color-teal-${scale}: ${value};`);
  }
  declarations.push("");
  declarations.push("/* Gray (slate scale) */");
  for (const [scale, value] of Object.entries(palette.gray)) {
    declarations.push(`--color-gray-${scale}: ${value};`);
  }
  declarations.push("");
  declarations.push("/* Blue (accent) */");
  for (const [scale, value] of Object.entries(palette.blue)) {
    declarations.push(`--color-blue-${scale}: ${value};`);
  }
  declarations.push("");
  declarations.push("/* Semantic */");
  for (const [name, value] of Object.entries(semanticFills)) {
    declarations.push(`--color-${name}: ${value};`);
  }
  declarations.push("");
  declarations.push("/* Font families */");
  declarations.push(`--font-sans: ${typography.fontFamily.sans};`);
  declarations.push(`--font-mono: ${typography.fontFamily.mono};`);
  declarations.push("");
  declarations.push("/* Font sizes (overrides Tailwind defaults with PE scale) */");
  declarations.push("--text-*: initial;");
  for (const [name, { size, lineHeight }] of Object.entries(typography.fontSize)) {
    declarations.push(`--text-${name}: ${size};`);
    declarations.push(`--text-${name}--line-height: ${lineHeight};`);
  }
  declarations.push("");
  declarations.push("/* Semantic radius */");
  for (const [name, value] of Object.entries(radius)) {
    declarations.push(`--radius-${name}: ${value};`);
  }
  declarations.push("");
  declarations.push("/* Named spacing */");
  for (const [name, value] of Object.entries(namedSpacing)) {
    const cssName = name.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    declarations.push(`--spacing-${cssName}: ${value};`);
  }
  declarations.push("");
  declarations.push("/* Breakpoints */");
  for (const [name, value] of Object.entries(breakpoints)) {
    declarations.push(`--breakpoint-${name}: ${value};`);
  }

  const lines = [
    "",
    "/* --- Layer 3: brand palette + scales (concrete Tailwind utilities) --- */",
    "@theme {",
    indent(declarations),
    "}",
  ];
  return lines.join("\n");
}

function buildTokensCss(): string {
  return [
    STATIC_HEADER,
    "",
    rootLightBlock(),
    rootDarkBlock(),
    themeInlineBlock(),
    brandPaletteBlock(),
    "",
    STATIC_BASE_LAYER,
    "",
  ].join("\n");
}

function buildQuartoScss(): string {
  // Map the canonical PolicyEngine tokens to Quarto/Bootstrap SCSS variables.
  // Consumers import via:
  //   /*-- scss:defaults --*/
  //   @import "@policyengine/ui-kit/quarto.scss";
  const lines: string[] = [
    "/* PolicyEngine Quarto SCSS theme — GENERATED; DO NOT EDIT.",
    " * Source of truth: src/theme/tokens.ts",
    " * Regenerate with: bun run generate-tokens",
    " *",
    " * Usage in a Quarto _quarto.yml:",
    " *   format:",
    " *     html:",
    " *       theme:",
    " *         - cosmo",
    " *         - quarto.scss   # this file via @import",
    " * The exposed Bootstrap variables track the same hex values as the CSS",
    " * tokens used in the React app, so paper renders match the dashboard.",
    " */",
    "",
    "/*-- scss:defaults --*/",
    "",
    `$primary: ${rootColorsLight["--primary"]};`,
    `$secondary: ${rootColorsLight["--secondary-foreground"]};`,
    `$success: ${semanticFills.success};`,
    `$warning: ${semanticFills.warning};`,
    `$danger: ${semanticFills.error};`,
    `$info: ${semanticFills.info};`,
    `$body-bg: ${rootColorsLight["--background"]};`,
    `$body-color: ${rootColorsLight["--foreground"]};`,
    `$body-secondary-color: ${rootColorsLight["--text-secondary"]};`,
    `$body-tertiary-color: ${rootColorsLight["--muted-foreground"]};`,
    `$link-color: ${palette.teal[600]};`,
    `$link-hover-color: ${palette.teal[700]};`,
    `$border-color: ${rootColorsLight["--border"]};`,
    `$card-bg: ${rootColorsLight["--card"]};`,
    `$font-family-sans-serif: ${typography.fontFamily.sans};`,
    `$font-family-monospace: ${typography.fontFamily.mono};`,
    "",
    "// Accessible-on-white text variants — match @policyengine/ui-kit's",
    "// --text-warning / --text-error / --text-success exactly so paper",
    "// callouts share the dashboard's contrast guarantees.",
    `$pe-text-warning: ${rootColorsLight["--text-warning"]};`,
    `$pe-text-error: ${rootColorsLight["--text-error"]};`,
    `$pe-text-success: ${rootColorsLight["--text-success"]};`,
    "",
    "// Brand palette so authors can style a callout without hex literals.",
    ...Object.entries(palette.teal).map(
      ([scale, value]) => `$pe-teal-${scale}: ${value};`,
    ),
    ...Object.entries(palette.gray).map(
      ([scale, value]) => `$pe-gray-${scale}: ${value};`,
    ),
    ...Object.entries(palette.blue).map(
      ([scale, value]) => `$pe-blue-${scale}: ${value};`,
    ),
    "",
  ];
  return lines.join("\n");
}

export function generate(): { tokensCss: string; quartoScss: string } {
  return { tokensCss: buildTokensCss(), quartoScss: buildQuartoScss() };
}

function main() {
  const { tokensCss, quartoScss } = generate();
  fs.writeFileSync(TOKENS_CSS, tokensCss);
  fs.writeFileSync(QUARTO_SCSS, quartoScss);
  console.log(`✅ Wrote ${path.relative(process.cwd(), TOKENS_CSS)}`);
  console.log(`✅ Wrote ${path.relative(process.cwd(), QUARTO_SCSS)}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
