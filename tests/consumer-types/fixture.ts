/**
 * Consumer-style import surface used by the typecheck harness in
 * `tests/consumer-types/typecheck.test.ts`. Mirrors what real consumers
 * write — the harness type-checks this file against the *built* package
 * (via path mappings to dist/), so any regression that drops symbols from
 * the main entry, the legacy/ subpath, or the per-feature subpaths fails
 * the test loudly instead of silently shipping to consumers.
 *
 * If you add a new top-level export to ui-kit, add a use of it here too —
 * otherwise the test won't catch a regression on it.
 */

// Main entry — primitives, layout, charts, visualization, theme, utils
import {
  // Primitives — main offenders for the dist/<name>.js vs dist/<name>/index.d.ts
  // resolution bug, kept in alphabetical order to make additions easy
  Accordion,
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  Collapsible,
  Container,
  Dialog,
  DropdownMenu,
  Input,
  Label,
  Popover,
  Progress,
  RadioGroup,
  ScrollArea,
  Select,
  Separator,
  Sheet,
  Skeleton,
  Spinner,
  Switch,
  Tabs,
  Text,
  Textarea,
  Title,
  Tooltip,
  // Layout
  DashboardShell,
  Header,
  Footer,
  Stack,
  Group,
  // Inputs
  CurrencyInput,
  NumberInput,
  // Display
  DataTable,
  MetricCard,
  // Charts
  ChartContainer,
  PEBarChart,
  PELineChart,
  PEAreaChart,
  PEWaterfallChart,
  // Tokens (runtime)
  palette,
  semanticFills,
  typography,
  namedSpacing,
  chartPalette,
  rootColorsLight,
  rootColorsDark,
  // Utilities
  cn,
  formatCurrency,
  formatPercent,
  getNiceTicks,
  // Assets
  logos,
} from "@policyengine/ui-kit";

// Legacy compat — design-system migration target
import {
  colors as legacyColors,
  typography as legacyTypography,
  spacing as legacySpacing,
  chartColors as legacyChartColors,
} from "@policyengine/ui-kit/legacy";

// Legacy subpath — explicit per-module resolution
import { colors as legacyColors2 } from "@policyengine/ui-kit/legacy/tokens";
import { colors as legacyColors3 } from "@policyengine/ui-kit/legacy/tokens/colors";
import { typography as legacyTypography2 } from "@policyengine/ui-kit/legacy/tokens/typography";
import { spacing as legacySpacing2 } from "@policyengine/ui-kit/legacy/tokens/spacing";
import { chartColors as legacyChartColors2 } from "@policyengine/ui-kit/legacy/charts";

// Per-feature subpaths — used by consumers that want narrow imports
import { Badge as Badge2 } from "@policyengine/ui-kit/primitives";
import { Container as Container2 } from "@policyengine/ui-kit/layout";
import { ChartContainer as ChartContainer2 } from "@policyengine/ui-kit/charts";

// Specific properties consumers depend on — separate use site so a missing
// value (e.g. `colors.blue`/`colors.success` going missing in the legacy
// shim, which forced two consumer migrations to add local backfills) gets
// caught even though the top-level `colors` import already type-checks.
export const _LegacyColorPaths = {
  bluePalette: legacyColors.blue, // restored in 0.9.0; was missing in 0.8.x
  successScalar: legacyColors.success, // ditto
  textWarning: legacyColors.text.warning,
  primaryBrand: legacyColors.primary[500],
  grayMid: legacyColors.gray[500],
};

// Touch each binding so unused-import settings don't strip them.
export type _SmokeTest =
  | typeof Accordion
  | typeof Alert
  | typeof Badge
  | typeof Button
  | typeof Card
  | typeof Checkbox
  | typeof Collapsible
  | typeof Container
  | typeof Dialog
  | typeof DropdownMenu
  | typeof Input
  | typeof Label
  | typeof Popover
  | typeof Progress
  | typeof RadioGroup
  | typeof ScrollArea
  | typeof Select
  | typeof Separator
  | typeof Sheet
  | typeof Skeleton
  | typeof Spinner
  | typeof Switch
  | typeof Tabs
  | typeof Text
  | typeof Textarea
  | typeof Title
  | typeof Tooltip
  | typeof DashboardShell
  | typeof Header
  | typeof Footer
  | typeof Stack
  | typeof Group
  | typeof CurrencyInput
  | typeof NumberInput
  | typeof DataTable
  | typeof MetricCard
  | typeof ChartContainer
  | typeof PEBarChart
  | typeof PELineChart
  | typeof PEAreaChart
  | typeof PEWaterfallChart
  | typeof palette
  | typeof semanticFills
  | typeof typography
  | typeof namedSpacing
  | typeof chartPalette
  | typeof rootColorsLight
  | typeof rootColorsDark
  | typeof cn
  | typeof formatCurrency
  | typeof formatPercent
  | typeof getNiceTicks
  | typeof logos
  | typeof legacyColors
  | typeof legacyTypography
  | typeof legacySpacing
  | typeof legacyChartColors
  | typeof legacyColors2
  | typeof legacyColors3
  | typeof legacyTypography2
  | typeof legacySpacing2
  | typeof legacyChartColors2
  | typeof Badge2
  | typeof Container2
  | typeof ChartContainer2;
