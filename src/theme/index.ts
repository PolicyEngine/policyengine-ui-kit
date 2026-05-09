// Re-export the CSS theme for programmatic import (a no-op at type-check
// time; bundlers register the side-effecting CSS file when this module is
// imported).
import "./tokens.css";

// Runtime token exports — for JS consumers that need a literal hex value
// (Plotly traces, generated SVG, dynamic inline styles, etc.). For Tailwind
// CSS or Recharts, prefer `var(--color-…)` strings — they pick up dark
// mode automatically.
export {
  breakpoints,
  chartPalette,
  colors,
  contrastPairs,
  namedSpacing,
  palette,
  radius,
  rootColorsDark,
  rootColorsLight,
  semanticFills,
  themeInline,
  tokens,
  typography,
} from "./tokens";

export type { ContrastPair, CssSection } from "./tokens";
