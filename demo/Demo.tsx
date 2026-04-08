import { useEffect, useState } from 'react';
import {
  Home,
  Settings,
  Users,
  BarChart3,
  FileText,
  Bell,
  Search,
  Mail,
  Calculator,
  Globe,
  ChevronDown,
  ExternalLink,
  Bold,
  Italic,
  Underline,
  Copy,
  Trash2,
  PenLine,
} from 'lucide-react';

// Primitives
import { Button } from '../src/primitives/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from '../src/primitives/Card';
import { Badge } from '../src/primitives/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../src/primitives/Tabs';
import { Text } from '../src/primitives/Text';
import { Title } from '../src/primitives/Title';
import { Spinner } from '../src/primitives/Spinner';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../src/primitives/Dialog';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../src/primitives/Sheet';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../src/primitives/Tooltip';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from '../src/primitives/Select';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../src/primitives/DropdownMenu';
import { Input } from '../src/primitives/Input';
import { Label } from '../src/primitives/Label';
import { Separator } from '../src/primitives/Separator';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../src/primitives/Accordion';
import { Alert, AlertTitle, AlertDescription } from '../src/primitives/Alert';
import { Popover, PopoverTrigger, PopoverContent } from '../src/primitives/Popover';
import { Switch } from '../src/primitives/Switch';
import { RadioGroup, RadioGroupItem } from '../src/primitives/RadioGroup';
import { Checkbox } from '../src/primitives/Checkbox';
import { ScrollArea } from '../src/primitives/ScrollArea';
import { Skeleton } from '../src/primitives/Skeleton';
import { Progress } from '../src/primitives/Progress';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../src/primitives/Collapsible';
import { Textarea } from '../src/primitives/Textarea';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '../src/primitives/Command';
import { SegmentedControl } from '../src/primitives/SegmentedControl';

// Layout
import { DashboardShell } from '../src/layout/DashboardShell';
import { Header } from '../src/layout/header';
import { SidebarLayout } from '../src/layout/SidebarLayout';
import { SingleColumnLayout } from '../src/layout/SingleColumnLayout';
import { InputPanel } from '../src/layout/InputPanel';
import { ResultsPanel } from '../src/layout/ResultsPanel';
import { Stack } from '../src/layout/Stack';
import { Group } from '../src/layout/Group';
import { Container } from '../src/layout/Container';
import { SidebarNavItem } from '../src/layout/SidebarNavItem';
import { SidebarSection } from '../src/layout/SidebarSection';
import { SidebarDivider } from '../src/layout/SidebarDivider';
import { Footer } from '../src/layout/Footer';

// Inputs
import { CurrencyInput } from '../src/inputs/CurrencyInput';
import { NumberInput } from '../src/inputs/NumberInput';
import { SelectInput } from '../src/inputs/SelectInput';
import { CheckboxInput } from '../src/inputs/CheckboxInput';
import { SliderInput } from '../src/inputs/SliderInput';
import { InputGroup } from '../src/inputs/InputGroup';

// Display
import { MetricCard } from '../src/display/MetricCard';
import { SummaryText } from '../src/display/SummaryText';
import { DataTable } from '../src/display/DataTable';
import { PolicyEngineWatermark } from '../src/display/PolicyEngineWatermark';

// Charts
import { ChartContainer } from '../src/charts/ChartContainer';
import { PEBarChart } from '../src/charts/PEBarChart';
import { PELineChart } from '../src/charts/PELineChart';
import { PEAreaChart } from '../src/charts/PEAreaChart';
import { PEWaterfallChart } from '../src/charts/PEWaterfallChart';
import { computeWaterfallData, getWaterfallDomain } from '../src/charts/waterfallUtils';
import { chartColors } from '../src/charts/chartDefaults';
import { getNiceTicks } from '../src/utils/chartUtils';
import { PEImpactBarChart } from '../src/charts/impact/PEImpactBarChart';
import { PEWinnersLosersChart } from '../src/charts/impact/PEWinnersLosersChart';
import { PEEarningsChart } from '../src/charts/impact/PEEarningsChart';
import { PEBudgetWaterfallChart, getBudgetChartTitle } from '../src/charts/impact/PEBudgetWaterfallChart';

// Visualization
import { HexagonalMap } from '../src/visualization/HexagonalMap';
import { USDistrictChoroplethMap } from '../src/visualization/USDistrictChoroplethMap';
import { UKConstituencyChoroplethMap } from '../src/visualization/UKConstituencyChoroplethMap';
import { StateLegislativeDistrictMap } from '../src/visualization/StateLegislativeDistrictMap';
import {
  loadUKConstituenciesHex,
  loadStateSenateDistrictsGeo,
  loadStateHouseDistrictsGeo,
} from '../src/visualization/data/loaders';
import { MapTypeToggle } from '../src/visualization/MapTypeToggle';
import { SLDU_QUALIFYING_STATES, SLDL_QUALIFYING_STATES, STATE_ABBREV_TO_FIPS } from '../src/visualization/utils';
import type { StateLegislativeChamber } from '../src/visualization/utils';
import type { ChoroplethDataPoint, MapVisualizationType } from '../src/visualization/types';

// Color semantics
import { winnersLosersColors, DIVERGING_GRAY_TEAL } from '../src/charts/colorSemantics';

// Utils
import { formatCurrency, formatCurrencyAbbr } from '../src/utils/formatters';

// Assets
import { logos } from '../src/assets';

// ---------------------------------------------------------------------------
// Example data
// ---------------------------------------------------------------------------

const barData = [
  { category: 'Income tax', amount: 320 },
  { category: 'Payroll tax', amount: 180 },
  { category: 'Corporate tax', amount: 95 },
  { category: 'Excise tax', amount: 45 },
  { category: 'Estate tax', amount: 22 },
  { category: 'UBI cost', amount: -480 },
];

const lineData = Array.from({ length: 10 }, (_, i) => ({
  year: 2024 + i,
  baseline: 11.5 - i * 0.15 + Math.random() * 0.5,
  reform: 11.5 - i * 0.15 - 2.1 + Math.random() * 0.3,
}));

const areaData = [
  { decile: '1st', income_tax: 200, payroll_tax: 800, benefits: -3200 },
  { decile: '2nd', income_tax: 600, payroll_tax: 1400, benefits: -2400 },
  { decile: '3rd', income_tax: 1200, payroll_tax: 2100, benefits: -1600 },
  { decile: '4th', income_tax: 2400, payroll_tax: 2800, benefits: -800 },
  { decile: '5th', income_tax: 4200, payroll_tax: 3600, benefits: -200 },
  { decile: '6th', income_tax: 6800, payroll_tax: 4200, benefits: 0 },
  { decile: '7th', income_tax: 10200, payroll_tax: 5100, benefits: 0 },
  { decile: '8th', income_tax: 15400, payroll_tax: 6000, benefits: 0 },
  { decile: '9th', income_tax: 24000, payroll_tax: 7200, benefits: 0 },
  { decile: '10th', income_tax: 62000, payroll_tax: 9400, benefits: 0 },
];

const waterfallItems = [
  { name: 'Income tax', value: 320 },
  { name: 'Payroll tax', value: 180 },
  { name: 'Corporate tax', value: 95 },
  { name: 'Excise tax', value: 45 },
  { name: 'UBI cost', value: -480 },
  { name: 'Net impact', value: 0, isTotal: true },
];
const waterfallFmt = (v: number) => `$${v}B`;
const waterfallData = computeWaterfallData(waterfallItems, waterfallFmt);
const waterfallDomain = getWaterfallDomain(waterfallData);
const waterfallTicks = getNiceTicks(waterfallDomain);

const waterfallAllNegativeItems = [
  { name: 'Income tax', value: -120 },
  { name: 'Payroll tax', value: -85 },
  { name: 'Corporate tax', value: -60 },
  { name: 'Estate tax', value: -35 },
  { name: 'Total', value: 0, isTotal: true },
];
const waterfallAllNegativeData = computeWaterfallData(waterfallAllNegativeItems, waterfallFmt);
const waterfallAllNegativeDomain = getWaterfallDomain(waterfallAllNegativeData);
const waterfallAllNegativeTicks = getNiceTicks(waterfallAllNegativeDomain);

function getWaterfallFillColor(d: { value: number; isTotal: boolean }): string {
  if (d.isTotal) return 'var(--chart-3)';
  return d.value >= 0 ? chartColors.primary : 'var(--color-gray-600)';
}

// Impact bar chart data
const impactBarData = [
  { name: '1st', value: 0.08, hoverText: 'Gain: 8.0% of net income' },
  { name: '2nd', value: 0.05, hoverText: 'Gain: 5.0% of net income' },
  { name: '3rd', value: 0.03, hoverText: 'Gain: 3.0% of net income' },
  { name: '4th', value: 0.01, hoverText: 'Gain: 1.0% of net income' },
  { name: '5th', value: -0.01, hoverText: 'Loss: 1.0% of net income' },
  { name: '6th', value: -0.02, hoverText: 'Loss: 2.0% of net income' },
  { name: '7th', value: -0.03, hoverText: 'Loss: 3.0% of net income' },
  { name: '8th', value: -0.04, hoverText: 'Loss: 4.0% of net income' },
  { name: '9th', value: -0.05, hoverText: 'Loss: 5.0% of net income' },
  { name: '10th', value: -0.07, hoverText: 'Loss: 7.0% of net income' },
];

// Winners/losers data — deciles 1–10
const winnersLosersData = [
  { name: '1', gainMore5: 0.35, gainLess5: 0.40, noChange: 0.15, loseLess5: 0.07, loseMore5: 0.03 },
  { name: '2', gainMore5: 0.25, gainLess5: 0.35, noChange: 0.20, loseLess5: 0.12, loseMore5: 0.08 },
  { name: '3', gainMore5: 0.15, gainLess5: 0.30, noChange: 0.25, loseLess5: 0.18, loseMore5: 0.12 },
  { name: '4', gainMore5: 0.08, gainLess5: 0.22, noChange: 0.30, loseLess5: 0.25, loseMore5: 0.15 },
  { name: '5', gainMore5: 0.05, gainLess5: 0.15, noChange: 0.30, loseLess5: 0.30, loseMore5: 0.20 },
  { name: '6', gainMore5: 0.03, gainLess5: 0.10, noChange: 0.32, loseLess5: 0.32, loseMore5: 0.23 },
  { name: '7', gainMore5: 0.02, gainLess5: 0.08, noChange: 0.30, loseLess5: 0.35, loseMore5: 0.25 },
  { name: '8', gainMore5: 0.01, gainLess5: 0.05, noChange: 0.28, loseLess5: 0.38, loseMore5: 0.28 },
  { name: '9', gainMore5: 0.01, gainLess5: 0.03, noChange: 0.25, loseLess5: 0.40, loseMore5: 0.31 },
  { name: '10', gainMore5: 0.00, gainLess5: 0.02, noChange: 0.20, loseLess5: 0.42, loseMore5: 0.36 },
];

const winnersLosersAllData = {
  gainMore5: 0.18,
  gainLess5: 0.28,
  noChange: 0.24,
  loseLess5: 0.18,
  loseMore5: 0.12,
};

// Earnings chart data
const earningsData = Array.from({ length: 20 }, (_, i) => {
  const earnings = i * 5000;
  const baseline = Math.max(0, earnings * 0.75 - 2000);
  const reform = Math.max(0, earnings * 0.70 + 1000);
  return { earnings, baseline, reform };
});

// Budget waterfall data
const budgetWaterfallData = [
  { name: 'Income tax', value: 120_000_000_000 },
  { name: 'Payroll tax', value: 80_000_000_000 },
  { name: 'Corporate tax', value: 40_000_000_000 },
  { name: 'UBI cost', value: -320_000_000_000 },
  { name: 'Net impact', value: 0, isTotal: true },
];

// Hex map data — standard US state hex grid layout
// Even rows (y=0,2,4,6) use integer x; odd rows (y=1,3,5,7) offset x by +0.5
const hexMapData = [
  // Row 0 (even — no offset)
  { id: 'AK', label: 'Alaska', x: 1, y: 0, value: 0.01 },
  { id: 'ME', label: 'Maine', x: 11, y: 0, value: -0.01 },
  // Row 1 (odd — +0.5 offset)
  { id: 'VT', label: 'Vermont', x: 9.5, y: 1, value: 0.02 },
  { id: 'NH', label: 'New Hampshire', x: 10.5, y: 1, value: -0.01 },
  // Row 2 (even)
  { id: 'WA', label: 'Washington', x: 1, y: 2, value: 0.01 },
  { id: 'MT', label: 'Montana', x: 2, y: 2, value: 0.00 },
  { id: 'ND', label: 'North Dakota', x: 3, y: 2, value: -0.02 },
  { id: 'MN', label: 'Minnesota', x: 4, y: 2, value: 0.03 },
  { id: 'WI', label: 'Wisconsin', x: 5, y: 2, value: 0.02 },
  { id: 'MI', label: 'Michigan', x: 7, y: 2, value: -0.01 },
  { id: 'NY', label: 'New York', x: 9, y: 2, value: 0.05 },
  { id: 'MA', label: 'Massachusetts', x: 10, y: 2, value: 0.03 },
  { id: 'RI', label: 'Rhode Island', x: 11, y: 2, value: 0.01 },
  // Row 3 (odd — +0.5 offset)
  { id: 'ID', label: 'Idaho', x: 1.5, y: 3, value: -0.01 },
  { id: 'WY', label: 'Wyoming', x: 2.5, y: 3, value: 0.00 },
  { id: 'SD', label: 'South Dakota', x: 3.5, y: 3, value: -0.01 },
  { id: 'IA', label: 'Iowa', x: 4.5, y: 3, value: 0.02 },
  { id: 'IL', label: 'Illinois', x: 5.5, y: 3, value: 0.04 },
  { id: 'IN', label: 'Indiana', x: 6.5, y: 3, value: 0.01 },
  { id: 'OH', label: 'Ohio', x: 7.5, y: 3, value: 0.03 },
  { id: 'PA', label: 'Pennsylvania', x: 8.5, y: 3, value: 0.02 },
  { id: 'NJ', label: 'New Jersey', x: 9.5, y: 3, value: -0.02 },
  { id: 'CT', label: 'Connecticut', x: 10.5, y: 3, value: 0.01 },
  // Row 4 (even)
  { id: 'OR', label: 'Oregon', x: 1, y: 4, value: 0.02 },
  { id: 'NV', label: 'Nevada', x: 2, y: 4, value: -0.01 },
  { id: 'CO', label: 'Colorado', x: 3, y: 4, value: 0.00 },
  { id: 'NE', label: 'Nebraska', x: 4, y: 4, value: -0.01 },
  { id: 'MO', label: 'Missouri', x: 5, y: 4, value: 0.03 },
  { id: 'KY', label: 'Kentucky', x: 6, y: 4, value: 0.05 },
  { id: 'WV', label: 'West Virginia', x: 7, y: 4, value: 0.07 },
  { id: 'VA', label: 'Virginia', x: 8, y: 4, value: 0.01 },
  { id: 'MD', label: 'Maryland', x: 9, y: 4, value: -0.02 },
  { id: 'DE', label: 'Delaware', x: 10, y: 4, value: 0.00 },
  // Row 5 (odd — +0.5 offset)
  { id: 'CA', label: 'California', x: 1.5, y: 5, value: -0.03 },
  { id: 'UT', label: 'Utah', x: 2.5, y: 5, value: 0.01 },
  { id: 'NM', label: 'New Mexico', x: 3.5, y: 5, value: 0.04 },
  { id: 'KS', label: 'Kansas', x: 4.5, y: 5, value: -0.01 },
  { id: 'AR', label: 'Arkansas', x: 5.5, y: 5, value: 0.06 },
  { id: 'TN', label: 'Tennessee', x: 6.5, y: 5, value: 0.03 },
  { id: 'NC', label: 'North Carolina', x: 7.5, y: 5, value: 0.02 },
  { id: 'SC', label: 'South Carolina', x: 8.5, y: 5, value: 0.04 },
  { id: 'DC', label: 'Washington DC', x: 9.5, y: 5, value: 0.08 },
  // Row 6 (even)
  { id: 'AZ', label: 'Arizona', x: 3, y: 6, value: -0.02 },
  { id: 'OK', label: 'Oklahoma', x: 4, y: 6, value: 0.03 },
  { id: 'LA', label: 'Louisiana', x: 5, y: 6, value: 0.05 },
  { id: 'MS', label: 'Mississippi', x: 6, y: 6, value: 0.07 },
  { id: 'AL', label: 'Alabama', x: 7, y: 6, value: 0.04 },
  { id: 'GA', label: 'Georgia', x: 8, y: 6, value: 0.06 },
  // Row 7 (odd — +0.5 offset)
  { id: 'TX', label: 'Texas', x: 4.5, y: 7, value: 0.02 },
  { id: 'FL', label: 'Florida', x: 7.5, y: 7, value: 0.08 },
  // Row 8 (even)
  { id: 'HI', label: 'Hawaii', x: 1, y: 8, value: 0.01 },
];

// Congressional district demo data — synthetic values for all 436 districts
const DISTRICT_COUNTS: Record<string, number> = {
  AK: 1, AL: 7, AR: 4, AZ: 9, CA: 52, CO: 8, CT: 5, DC: 1, DE: 1, FL: 28,
  GA: 14, HI: 2, IA: 4, ID: 2, IL: 17, IN: 9, KS: 4, KY: 6, LA: 6, MA: 9,
  MD: 8, ME: 2, MI: 13, MN: 8, MO: 8, MS: 4, MT: 2, NC: 14, ND: 1, NE: 3,
  NH: 2, NJ: 12, NM: 3, NV: 4, NY: 26, OH: 15, OK: 5, OR: 6, PA: 17, RI: 2,
  SC: 7, SD: 1, TN: 9, TX: 38, UT: 4, VA: 11, VT: 1, WA: 10, WI: 8, WV: 2,
  WY: 1,
};

const congressionalHexData: ChoroplethDataPoint[] = (() => {
  const data: ChoroplethDataPoint[] = [];
  for (const [state, count] of Object.entries(DISTRICT_COUNTS)) {
    for (let i = 1; i <= count; i++) {
      const num = i.toString().padStart(2, '0');
      // Deterministic value: hash of state + district number
      const hash = (state.charCodeAt(0) * 31 + state.charCodeAt(1) * 17 + i * 7) % 100;
      const value = (hash - 40) / 500;
      data.push({
        geoId: `${state}-${num}`,
        label: `${state}-${i}`,
        value: Math.round(value * 1000) / 1000,
      });
    }
  }
  return data;
})();

// UK constituency demo data — loaded async from bundled hex data
async function generateUKConstituencyData(): Promise<ChoroplethDataPoint[]> {
  const hexData = await loadUKConstituenciesHex();
  const data: ChoroplethDataPoint[] = [];
  for (const [name, { gss }] of Object.entries(hexData)) {
    const hash = (gss.charCodeAt(4) * 31 + gss.charCodeAt(5) * 17 + gss.charCodeAt(6) * 7) % 100;
    const value = (hash - 45) / 500;
    data.push({
      geoId: gss,
      label: name,
      value: Math.round(value * 1000) / 1000,
    });
  }
  return data;
}

const tableColumns = [
  { key: 'decile', header: 'Income decile' },
  {
    key: 'avgIncome',
    header: 'Average income',
    align: 'right' as const,
    format: (v: unknown) => formatCurrency(v as number),
  },
  {
    key: 'taxChange',
    header: 'Tax change',
    align: 'right' as const,
    format: (v: unknown) => {
      const n = v as number;
      return n >= 0 ? `+${formatCurrency(n)}` : formatCurrency(n);
    },
  },
  {
    key: 'benefitChange',
    header: 'Benefit change',
    align: 'right' as const,
    format: (v: unknown) => `+${formatCurrency(v as number)}`,
  },
  {
    key: 'netChange',
    header: 'Net change',
    align: 'right' as const,
    format: (v: unknown) => {
      const n = v as number;
      return n >= 0 ? `+${formatCurrency(n)}` : formatCurrency(n);
    },
  },
];

const tableData = [
  { decile: '1st (poorest)', avgIncome: 12400, taxChange: 200, benefitChange: 6000, netChange: 5800 },
  { decile: '2nd', avgIncome: 24800, taxChange: 600, benefitChange: 6000, netChange: 5400 },
  { decile: '3rd', avgIncome: 36200, taxChange: 1200, benefitChange: 6000, netChange: 4800 },
  { decile: '4th', avgIncome: 48600, taxChange: 2400, benefitChange: 6000, netChange: 3600 },
  { decile: '5th', avgIncome: 62000, taxChange: 4200, benefitChange: 6000, netChange: 1800 },
  { decile: '6th', avgIncome: 78500, taxChange: 6800, benefitChange: 6000, netChange: -800 },
  { decile: '7th', avgIncome: 98000, taxChange: 10200, benefitChange: 6000, netChange: -4200 },
  { decile: '8th', avgIncome: 128000, taxChange: 15400, benefitChange: 6000, netChange: -9400 },
  { decile: '9th', avgIncome: 185000, taxChange: 24000, benefitChange: 6000, netChange: -18000 },
  { decile: '10th (richest)', avgIncome: 420000, taxChange: 62000, benefitChange: 6000, netChange: -56000 },
];

// State legislative district demo helpers
const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AZ: 'Arizona', CA: 'California', CO: 'Colorado', CT: 'Connecticut',
  FL: 'Florida', GA: 'Georgia', IL: 'Illinois', IN: 'Indiana', KY: 'Kentucky',
  LA: 'Louisiana', MA: 'Massachusetts', MD: 'Maryland', MI: 'Michigan', MO: 'Missouri',
  NC: 'North Carolina', NJ: 'New Jersey', NV: 'Nevada', NY: 'New York', OH: 'Ohio',
  OR: 'Oregon', PA: 'Pennsylvania', SC: 'South Carolina', TN: 'Tennessee', TX: 'Texas',
  UT: 'Utah', VA: 'Virginia', WA: 'Washington', WI: 'Wisconsin',
};

const sldStateOptions = SLDU_QUALIFYING_STATES.map((s) => ({
  label: STATE_NAMES[s] ?? s,
  value: s,
}));

async function generateSldDemoData(stateAbbrev: string, chamber: StateLegislativeChamber): Promise<ChoroplethDataPoint[]> {
  const source = chamber === 'upper'
    ? await loadStateSenateDistrictsGeo()
    : await loadStateHouseDistrictsGeo();
  const fips = STATE_ABBREV_TO_FIPS[stateAbbrev.toUpperCase()];
  if (!fips) return [];

  return source.features
    .filter((f) => f.properties?.STATEFP === fips)
    .map((f) => {
      const districtId = f.properties?.DISTRICT_ID as string;
      const name = f.properties?.NAMELSAD as string;
      // Deterministic hash
      const hash = (districtId.charCodeAt(0) * 31 + districtId.charCodeAt(3) * 17 +
        districtId.charCodeAt(districtId.length - 1) * 7 +
        districtId.charCodeAt(districtId.length - 2) * 13) % 100;
      const value = Math.round(((hash - 40) / 500) * 1000) / 1000;
      return { geoId: districtId, label: name, value };
    });
}

const stateOptions = [
  { label: 'California', value: 'CA' },
  { label: 'New York', value: 'NY' },
  { label: 'Texas', value: 'TX' },
  { label: 'Florida', value: 'FL' },
  { label: 'Washington', value: 'WA' },
];

const filingOptions = [
  { label: 'Single', value: 'single' },
  { label: 'Married filing jointly', value: 'mfj' },
  { label: 'Married filing separately', value: 'mfs' },
  { label: 'Head of household', value: 'hoh' },
];

const homeHeaderNavItems = [
  {
    label: 'Policy',
    href: '#',
    children: [
      { label: 'Compute your taxes', href: '#', description: 'See how policy changes affect your household' },
      { label: 'Explore reforms', href: '#', description: 'Browse contributed policy reforms' },
    ],
  },
  {
    label: 'Research',
    href: '#',
    children: [
      { label: 'Blog', href: '#', description: 'Latest analysis and updates' },
      { label: 'Publications', href: '#', description: 'Academic papers and reports' },
    ],
  },
  { label: 'About', href: '#' },
  { label: 'Donate', href: '#' },
];

const homeHeaderCountries = [
  { id: 'us', label: 'United States', flagEmoji: '\u{1F1FA}\u{1F1F8}' },
  { id: 'uk', label: 'United Kingdom', flagEmoji: '\u{1F1EC}\u{1F1E7}' },
  { id: 'ng', label: 'Nigeria', flagEmoji: '\u{1F1F3}\u{1F1EC}' },
];

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b border-border">
        {title}
      </h2>
      {children}
    </section>
  );
}

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Demo app
// ---------------------------------------------------------------------------

export function Demo() {
  const [income, setIncome] = useState(75000);
  const [dependents, setDependents] = useState(2);
  const [state, setState] = useState('CA');
  const [filing, setFiling] = useState('mfj');
  const [includeState, setIncludeState] = useState(true);
  const [ubiAmount, setUbiAmount] = useState(500);

  // New state for expanded primitives
  const [switchOn, setSwitchOn] = useState(false);
  const [radioValue, setRadioValue] = useState('option-1');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [segmentValue, setSegmentValue] = useState('household');
  const [collapsibleOpen, setCollapsibleOpen] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [progressValue] = useState(65);
  const [homeCountry, setHomeCountry] = useState('us');
  const [mapVizType, setMapVizType] = useState<MapVisualizationType>('geographic');
  const [ukMapVizType, setUkMapVizType] = useState<MapVisualizationType>('geographic');
  const [sldState, setSldState] = useState('CA');
  const [sldChamber, setSldChamber] = useState<StateLegislativeChamber>('upper');

  // Async demo data
  const [ukConstituencyData, setUkConstituencyData] = useState<ChoroplethDataPoint[]>([]);
  const [sldDemoData, setSldDemoData] = useState<ChoroplethDataPoint[]>([]);

  useEffect(() => {
    generateUKConstituencyData().then(setUkConstituencyData);
  }, []);

  useEffect(() => {
    generateSldDemoData(sldState, sldChamber).then(setSldDemoData);
  }, [sldState, sldChamber]);

  return (
    <TooltipProvider>
      <DashboardShell>
        <Header
          navItems={homeHeaderNavItems}
          countries={homeHeaderCountries}
          currentCountry={homeCountry}
          onCountryChange={setHomeCountry}
          onNavigate={(href) => console.log('Navigate:', href)}
        />
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              @policyengine/ui-kit
            </h1>
            <p className="text-lg text-muted-foreground">
              Component gallery — every component rendered with example data
            </p>
          </div>

          {/* ================================================================ */}
          {/* PRIMITIVES — Typography & Feedback */}
          {/* ================================================================ */}
          <Section title="Typography & Feedback">
            <SubSection title="Text">
              <Stack gap="sm">
                <Text size="xs">Text size xs — Fine print and labels</Text>
                <Text size="sm">Text size sm — Secondary content</Text>
                <Text size="md">Text size md — Default body text</Text>
                <Text size="lg">Text size lg — Emphasized content</Text>
                <Text size="xl">Text size xl — Large callouts</Text>
                <Group gap="lg">
                  <Text fw={400}>Normal weight</Text>
                  <Text fw={500}>Medium weight</Text>
                  <Text fw={700}>Bold weight</Text>
                  <Text c="dimmed">Dimmed color</Text>
                </Group>
              </Stack>
            </SubSection>

            <SubSection title="Title">
              <Stack gap="sm">
                <Title order={1}>Title order 1 (h1)</Title>
                <Title order={2}>Title order 2 (h2)</Title>
                <Title order={3}>Title order 3 (h3)</Title>
                <Title order={4}>Title order 4 (h4)</Title>
                <Title order={5}>Title order 5 (h5)</Title>
                <Title order={6}>Title order 6 (h6)</Title>
              </Stack>
            </SubSection>

            <SubSection title="Spinner">
              <Group gap="xl" align="center">
                <Stack gap="xs" align="center">
                  <Spinner size="sm" />
                  <Text size="xs" c="dimmed">Small</Text>
                </Stack>
                <Stack gap="xs" align="center">
                  <Spinner size="md" />
                  <Text size="xs" c="dimmed">Medium</Text>
                </Stack>
                <Stack gap="xs" align="center">
                  <Spinner size="lg" />
                  <Text size="xs" c="dimmed">Large</Text>
                </Stack>
              </Group>
            </SubSection>

            <SubSection title="Alert">
              <Stack gap="md">
                <Alert>
                  <AlertTitle>Default alert</AlertTitle>
                  <AlertDescription>
                    This is a default alert with no variant specified.
                  </AlertDescription>
                </Alert>
                <Alert variant="destructive">
                  <AlertTitle>Destructive alert</AlertTitle>
                  <AlertDescription>
                    Something went wrong with the simulation. Please check your inputs.
                  </AlertDescription>
                </Alert>
              </Stack>
            </SubSection>

            <SubSection title="Skeleton">
              <div className="bg-white rounded-lg p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-3">Shown on white background for visibility</p>
                <Stack gap="md">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Group gap="md">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <Stack gap="sm">
                      <Skeleton className="h-4 w-[160px]" />
                      <Skeleton className="h-3 w-[120px]" />
                    </Stack>
                  </Group>
                </Stack>
              </div>
            </SubSection>

            <SubSection title="Progress">
              <Stack gap="md">
                <div>
                  <Text size="sm" c="dimmed" className="mb-1">Simulation progress: {progressValue}%</Text>
                  <Progress value={progressValue} />
                </div>
                <div>
                  <Text size="sm" c="dimmed" className="mb-1">Loading data: 30%</Text>
                  <Progress value={30} />
                </div>
              </Stack>
            </SubSection>
          </Section>

          {/* ================================================================ */}
          {/* PRIMITIVES — Buttons, Badges, Cards */}
          {/* ================================================================ */}
          <Section title="Buttons, Badges, Cards">
            <SubSection title="Button — variants">
              <div className="flex flex-wrap gap-3 mb-4">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-3 mb-4">
                <Button size="xs">Extra small</Button>
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
              <div className="flex flex-wrap gap-3 mb-4">
                <Button size="icon-xs"><Search /></Button>
                <Button size="icon-sm"><Search /></Button>
                <Button size="icon"><Search /></Button>
                <Button size="icon-lg"><Search /></Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>Disabled outline</Button>
              </div>
            </SubSection>

            <SubSection title="Badge">
              <div className="flex flex-wrap gap-3">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="error">Error</Badge>
                <Badge variant="ghost">Ghost</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </SubSection>

            <SubSection title="Card (with CardAction)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Universal Basic Income</CardTitle>
                    <CardDescription>
                      $500/month payment to every adult citizen
                    </CardDescription>
                    <CardAction>
                      <Button variant="outline" size="sm">Edit</Button>
                    </CardAction>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      This reform would provide a monthly payment of $500 to every
                      adult US citizen, funded through a combination of income tax
                      increases and spending reductions.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm">View details</Button>
                    <Button variant="outline" size="sm" className="ml-2">Compare</Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Child Tax Credit expansion</CardTitle>
                    <CardDescription>
                      Increase CTC from $2,000 to $3,600 per child
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Expanding the Child Tax Credit to $3,600 per child under 6
                      and $3,000 for children 6-17, with full refundability.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm">View details</Button>
                  </CardFooter>
                </Card>
              </div>
            </SubSection>

            <SubSection title="Tabs (default + line variant)">
              <Stack gap="lg">
                <div>
                  <Text size="sm" c="dimmed" className="mb-2">Default variant:</Text>
                  <Tabs defaultValue="overview">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="distributional">Distributional</TabsTrigger>
                      <TabsTrigger value="budget">Budget</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                      <Card>
                        <CardContent className="pt-4">
                          <Text size="sm" c="dimmed">
                            Overview of the policy reform with headline metrics.
                          </Text>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="distributional">
                      <Card>
                        <CardContent className="pt-4">
                          <Text size="sm" c="dimmed">
                            Distributional analysis across income groups.
                          </Text>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    <TabsContent value="budget">
                      <Card>
                        <CardContent className="pt-4">
                          <Text size="sm" c="dimmed">
                            Budget impact analysis with revenue projections.
                          </Text>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
                <div>
                  <Text size="sm" c="dimmed" className="mb-2">Line variant:</Text>
                  <Tabs defaultValue="household">
                    <TabsList variant="line">
                      <TabsTrigger value="household">Household</TabsTrigger>
                      <TabsTrigger value="society">Society-wide</TabsTrigger>
                    </TabsList>
                    <TabsContent value="household">
                      <Text size="sm" className="mt-2">Household-level impacts for selected parameters.</Text>
                    </TabsContent>
                    <TabsContent value="society">
                      <Text size="sm" className="mt-2">Society-wide distributional and budgetary impacts.</Text>
                    </TabsContent>
                  </Tabs>
                </div>
              </Stack>
            </SubSection>

            <SubSection title="SegmentedControl">
              <Group gap="xl">
                <Stack gap="xs">
                  <Text size="xs" c="dimmed">Size sm:</Text>
                  <SegmentedControl
                    value={segmentValue}
                    onValueChange={setSegmentValue}
                    options={[
                      { label: 'Household', value: 'household' },
                      { label: 'Society', value: 'society' },
                    ]}
                    size="sm"
                  />
                </Stack>
                <Stack gap="xs">
                  <Text size="xs" c="dimmed">Size xs:</Text>
                  <SegmentedControl
                    value={segmentValue}
                    onValueChange={setSegmentValue}
                    options={[
                      { label: 'Household', value: 'household' },
                      { label: 'Society', value: 'society' },
                    ]}
                    size="xs"
                  />
                </Stack>
              </Group>
            </SubSection>

            <SubSection title="Separator">
              <Stack gap="md">
                <Text size="sm">Content above separator</Text>
                <Separator />
                <Text size="sm">Content below separator</Text>
                <Group gap="md" align="center">
                  <Text size="sm">Left</Text>
                  <Separator orientation="vertical" className="h-6" />
                  <Text size="sm">Center</Text>
                  <Separator orientation="vertical" className="h-6" />
                  <Text size="sm">Right</Text>
                </Group>
              </Stack>
            </SubSection>
          </Section>

          {/* ================================================================ */}
          {/* PRIMITIVES — Form Controls */}
          {/* ================================================================ */}
          <Section title="Form Controls (Radix Primitives)">
            <SubSection title="Input + Label">
              <Stack gap="md" className="max-w-sm">
                <div>
                  <Label htmlFor="demo-email">Email</Label>
                  <Input id="demo-email" type="email" placeholder="you@example.com" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="demo-name">Full name</Label>
                  <Input id="demo-name" placeholder="Jane Doe" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="demo-disabled">Disabled</Label>
                  <Input id="demo-disabled" placeholder="Cannot edit" disabled className="mt-1" />
                </div>
              </Stack>
            </SubSection>

            <SubSection title="Textarea">
              <div className="max-w-sm">
                <Label htmlFor="demo-textarea">Description</Label>
                <Textarea
                  id="demo-textarea"
                  placeholder="Describe your policy reform..."
                  className="mt-1"
                />
              </div>
            </SubSection>

            <SubSection title="Select (Radix)">
              <div className="max-w-sm">
                <Label>Country</Label>
                <Select value={selectValue} onValueChange={setSelectValue}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a country..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>North America</SelectLabel>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="mx">Mexico</SelectItem>
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Europe</SelectLabel>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </SubSection>

            <SubSection title="Switch">
              <Stack gap="md">
                <Group gap="md" align="center">
                  <Switch
                    id="demo-switch"
                    checked={switchOn}
                    onCheckedChange={setSwitchOn}
                  />
                  <Label htmlFor="demo-switch">
                    Include state-level effects ({switchOn ? 'on' : 'off'})
                  </Label>
                </Group>
                <Group gap="md" align="center">
                  <Switch disabled />
                  <Label className="text-muted-foreground">Disabled switch</Label>
                </Group>
              </Stack>
            </SubSection>

            <SubSection title="Checkbox (Radix)">
              <Stack gap="md">
                <Group gap="md" align="center">
                  <Checkbox
                    id="demo-checkbox"
                    checked={checkboxChecked}
                    onCheckedChange={(v) => setCheckboxChecked(v === true)}
                  />
                  <Label htmlFor="demo-checkbox">
                    I agree to the terms of service
                  </Label>
                </Group>
                <Group gap="md" align="center">
                  <Checkbox disabled />
                  <Label className="text-muted-foreground">Disabled checkbox</Label>
                </Group>
              </Stack>
            </SubSection>

            <SubSection title="RadioGroup">
              <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                <Stack gap="sm">
                  <Group gap="md" align="center">
                    <RadioGroupItem value="option-1" id="radio-1" />
                    <Label htmlFor="radio-1">Baseline scenario</Label>
                  </Group>
                  <Group gap="md" align="center">
                    <RadioGroupItem value="option-2" id="radio-2" />
                    <Label htmlFor="radio-2">Reform scenario</Label>
                  </Group>
                  <Group gap="md" align="center">
                    <RadioGroupItem value="option-3" id="radio-3" />
                    <Label htmlFor="radio-3">Custom scenario</Label>
                  </Group>
                </Stack>
              </RadioGroup>
            </SubSection>
          </Section>

          {/* ================================================================ */}
          {/* PRIMITIVES — Overlays & Disclosure */}
          {/* ================================================================ */}
          <Section title="Overlays & Disclosure">
            <SubSection title="Dialog">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm reform</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to apply this reform? This will recalculate
                      all household impacts with the new parameters.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button>Apply reform</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </SubSection>

            <SubSection title="Sheet">
              <Group gap="md">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Open sheet (right)</Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Reform parameters</SheetTitle>
                      <SheetDescription>
                        Adjust the parameters for this policy reform.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="p-4">
                      <Stack gap="md">
                        <div>
                          <Label>Reform name</Label>
                          <Input placeholder="My reform" className="mt-1" />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea placeholder="Describe the reform..." className="mt-1" />
                        </div>
                      </Stack>
                    </div>
                  </SheetContent>
                </Sheet>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Open sheet (left)</Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Navigation</SheetTitle>
                    </SheetHeader>
                    <div className="p-4">
                      <Text size="sm" c="dimmed">Side navigation panel content</Text>
                    </div>
                  </SheetContent>
                </Sheet>
              </Group>
            </SubSection>

            <SubSection title="Tooltip">
              <Group gap="lg">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    This button does something useful
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon"><Bell /></Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon"><Settings /></Button>
                  </TooltipTrigger>
                  <TooltipContent>Settings</TooltipContent>
                </Tooltip>
              </Group>
            </SubSection>

            <SubSection title="Popover">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">Open popover</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <Stack gap="md">
                    <Text fw={500}>Filter results</Text>
                    <div>
                      <Label htmlFor="pop-income">Min income</Label>
                      <Input id="pop-income" placeholder="$0" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="pop-state">State</Label>
                      <Input id="pop-state" placeholder="All states" className="mt-1" />
                    </div>
                    <Button size="sm">Apply filters</Button>
                  </Stack>
                </PopoverContent>
              </Popover>
            </SubSection>

            <SubSection title="DropdownMenu">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Actions <ChevronDown className="ml-1 size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Reform actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Copy className="mr-2 size-4" /> Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <PenLine className="mr-2 size-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ExternalLink className="mr-2 size-4" /> Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <Trash2 className="mr-2 size-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SubSection>

            <SubSection title="Accordion">
              <Accordion type="single" collapsible className="max-w-lg">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is PolicyEngine?</AccordionTrigger>
                  <AccordionContent>
                    PolicyEngine is a free, open-source platform for computing the
                    impact of public policy on individuals and society.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How are simulations run?</AccordionTrigger>
                  <AccordionContent>
                    Simulations use microsimulation models that apply tax and benefit
                    rules to representative household survey data.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is the data accurate?</AccordionTrigger>
                  <AccordionContent>
                    PolicyEngine models are validated against official government
                    projections and academic benchmarks.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </SubSection>

            <SubSection title="Collapsible">
              <Collapsible open={collapsibleOpen} onOpenChange={setCollapsibleOpen} className="max-w-lg">
                <Group justify="apart" align="center">
                  <Text fw={500}>Advanced options</Text>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      {collapsibleOpen ? 'Hide' : 'Show'}
                    </Button>
                  </CollapsibleTrigger>
                </Group>
                <CollapsibleContent>
                  <Stack gap="sm" className="mt-2 rounded-md border p-4">
                    <Text size="sm">Phase-in rate: 5%</Text>
                    <Text size="sm">Phase-out threshold: $150,000</Text>
                    <Text size="sm">Benefit reduction rate: 20%</Text>
                  </Stack>
                </CollapsibleContent>
              </Collapsible>
            </SubSection>

            <SubSection title="ScrollArea">
              <ScrollArea className="h-48 w-72 rounded-md border p-4">
                <Stack gap="sm">
                  {Array.from({ length: 20 }, (_, i) => (
                    <Text key={i} size="sm">
                      Item {i + 1} — Policy reform #{1000 + i}
                    </Text>
                  ))}
                </Stack>
              </ScrollArea>
            </SubSection>

            <SubSection title="Command">
              <Card className="max-w-md">
                <CardContent className="pt-4">
                  <Command className="rounded-lg border">
                    <CommandInput placeholder="Search policies..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup heading="Suggestions">
                        <CommandItem>
                          <Calculator className="mr-2 size-4" />
                          <span>Income tax calculator</span>
                        </CommandItem>
                        <CommandItem>
                          <BarChart3 className="mr-2 size-4" />
                          <span>Distributional analysis</span>
                        </CommandItem>
                        <CommandItem>
                          <FileText className="mr-2 size-4" />
                          <span>CTC reform</span>
                        </CommandItem>
                      </CommandGroup>
                      <CommandSeparator />
                      <CommandGroup heading="Settings">
                        <CommandItem>
                          <Users className="mr-2 size-4" />
                          <span>Household parameters</span>
                        </CommandItem>
                        <CommandItem>
                          <Settings className="mr-2 size-4" />
                          <span>Simulation settings</span>
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </CardContent>
              </Card>
            </SubSection>
          </Section>

          {/* ================================================================ */}
          {/* LAYOUT — New components */}
          {/* ================================================================ */}
          <Section title="Layout">
            <SubSection title="Stack + Group + Container">
              <Card>
                <CardContent className="pt-4">
                  <Text size="sm" c="dimmed" className="mb-4">Stack (vertical), Group (horizontal), Container (centered max-width):</Text>
                  <Container size="md">
                    <Stack gap="md">
                      <Group gap="md" justify="apart">
                        <Badge>Tag 1</Badge>
                        <Badge variant="secondary">Tag 2</Badge>
                        <Badge variant="outline">Tag 3</Badge>
                      </Group>
                      <Group gap="sm" grow>
                        <Button variant="outline" className="flex-1">Option A</Button>
                        <Button variant="outline" className="flex-1">Option B</Button>
                        <Button variant="outline" className="flex-1">Option C</Button>
                      </Group>
                    </Stack>
                  </Container>
                </CardContent>
              </Card>
            </SubSection>

            <SubSection title="Header">
              <div className="border border-border rounded-lg overflow-hidden">
                <Header
                  navItems={homeHeaderNavItems}
                  countries={homeHeaderCountries}
                  currentCountry={homeCountry}
                  onCountryChange={setHomeCountry}
                  onNavigate={(href) => console.log('Navigate:', href)}
                  styles={{ root: { position: 'relative' } }}
                />
              </div>
            </SubSection>


            <SubSection title="Sidebar components">
              <Card className="max-w-[280px]">
                <CardContent className="pt-4 px-0">
                  <SidebarSection title="Main">
                    <SidebarNavItem icon={Home} label="Dashboard" isActive />
                    <SidebarNavItem icon={BarChart3} label="Analysis" />
                    <SidebarNavItem icon={Calculator} label="Calculator" />
                  </SidebarSection>
                  <SidebarDivider />
                  <SidebarSection title="Resources">
                    <SidebarNavItem icon={FileText} label="Documentation" />
                    <SidebarNavItem icon={Globe} label="API Reference" external />
                    <SidebarNavItem icon={Mail} label="Contact" />
                  </SidebarSection>
                </CardContent>
              </Card>
            </SubSection>

            <SubSection title="PolicyEngine logos">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-4 flex flex-col items-center gap-2">
                    <img src={logos.tealWordmark} alt="Teal wordmark (SVG)" className="h-6" />
                    <span className="text-xs text-muted-foreground">tealWordmark</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 flex flex-col items-center gap-2">
                    <img src={logos.tealWordmarkPng} alt="Teal wordmark (PNG)" className="h-6" />
                    <span className="text-xs text-muted-foreground">tealWordmarkPng</span>
                  </CardContent>
                </Card>
                <Card className="bg-teal-600">
                  <CardContent className="pt-4 flex flex-col items-center gap-2">
                    <img src={logos.whiteWordmark} alt="White wordmark (SVG)" className="h-6" />
                    <span className="text-xs text-white/60">whiteWordmark</span>
                  </CardContent>
                </Card>
                <Card className="bg-teal-600">
                  <CardContent className="pt-4 flex flex-col items-center gap-2">
                    <img src={logos.whiteWordmarkPng} alt="White wordmark (PNG)" className="h-6" />
                    <span className="text-xs text-white/60">whiteWordmarkPng</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 flex flex-col items-center gap-2">
                    <img src={logos.tealSquare} alt="Teal square (SVG)" className="h-10" />
                    <span className="text-xs text-muted-foreground">tealSquare</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 flex flex-col items-center gap-2">
                    <img src={logos.tealSquarePng} alt="Teal square (PNG)" className="h-10" />
                    <span className="text-xs text-muted-foreground">tealSquarePng</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 flex flex-col items-center gap-2">
                    <img src={logos.tealSquareTransparent} alt="Teal square transparent (PNG)" className="h-10" />
                    <span className="text-xs text-muted-foreground">tealSquareTransparent</span>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4 flex flex-col items-center gap-2">
                    <img src={logos.tealSquarePadded} alt="Teal square padded (SVG)" className="h-10" />
                    <span className="text-xs text-muted-foreground">tealSquarePadded</span>
                  </CardContent>
                </Card>
                <Card className="bg-teal-600">
                  <CardContent className="pt-4 flex flex-col items-center gap-2">
                    <img src={logos.whiteSquare} alt="White square (SVG)" className="h-10" />
                    <span className="text-xs text-white/60">whiteSquare</span>
                  </CardContent>
                </Card>
              </div>
            </SubSection>

            <SubSection title="SidebarLayout (with InputPanel + ResultsPanel)">
              <div className="border border-border rounded-lg overflow-hidden h-[500px]">
                <SidebarLayout
                  sidebar={
                    <InputPanel title="Household parameters">
                      <InputGroup label="Income">
                        <CurrencyInput
                          label="Annual household income"
                          value={income}
                          onChange={setIncome}
                        />
                      </InputGroup>
                      <InputGroup label="Filing">
                        <SelectInput
                          label="Filing status"
                          options={filingOptions}
                          value={filing}
                          onChange={setFiling}
                        />
                        <SelectInput
                          label="State"
                          options={stateOptions}
                          value={state}
                          onChange={setState}
                        />
                      </InputGroup>
                      <InputGroup label="Dependents">
                        <NumberInput
                          label="Number of dependents"
                          value={dependents}
                          onChange={setDependents}
                          min={0}
                          max={10}
                        />
                      </InputGroup>
                    </InputPanel>
                  }
                >
                  <ResultsPanel>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <MetricCard
                        label="Net income change"
                        value={3200}
                        format="currency"
                        trend="positive"
                        delta="+4.3% vs. baseline"
                      />
                      <MetricCard
                        label="Effective tax rate"
                        value={0.228}
                        format="percent"
                        trend="negative"
                        delta="+3.1pp"
                      />
                      <MetricCard
                        label="Benefits received"
                        value={6000}
                        format="currency"
                        trend="positive"
                        delta="$500/mo UBI"
                      />
                    </div>
                  </ResultsPanel>
                </SidebarLayout>
              </div>
            </SubSection>

            <SubSection title="SingleColumnLayout">
              <div className="border border-border rounded-lg overflow-hidden">
                <SingleColumnLayout maxWidth="700px">
                  <h3 className="text-xl font-bold mb-4">Policy summary</h3>
                  <SummaryText>
                    This reform introduces a <strong>$500 monthly Universal
                    Basic Income</strong> for all adult US citizens. The bottom
                    50% of households would see a net income increase, while
                    the top 30% would see a net decrease.
                  </SummaryText>
                </SingleColumnLayout>
              </div>
            </SubSection>

            <SubSection title="Footer">
              <div className="border border-border rounded-lg overflow-hidden">
                <Footer
                  links={[
                    { href: '#', text: 'About' },
                    { href: '#', text: 'Research' },
                    { href: '#', text: 'Documentation' },
                    { href: '#', text: 'API' },
                  ]}
                  socialLinks={[
                    { icon: Mail, href: '#', label: 'Email' },
                    { icon: ExternalLink, href: '#', label: 'GitHub' },
                    { icon: Globe, href: '#', label: 'Website' },
                  ]}
                  copyrightText={`\u00A9 ${new Date().getFullYear()} PolicyEngine`}
                />
              </div>
            </SubSection>
          </Section>

          {/* ================================================================ */}
          {/* INPUTS */}
          {/* ================================================================ */}
          <Section title="Inputs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-4">
                  <div className="flex flex-col gap-4">
                    <CurrencyInput
                      label="Annual household income"
                      value={income}
                      onChange={setIncome}
                    />
                    <NumberInput
                      label="Number of dependents"
                      value={dependents}
                      onChange={setDependents}
                      min={0}
                      max={10}
                    />
                    <SelectInput
                      label="Filing status"
                      options={filingOptions}
                      value={filing}
                      onChange={setFiling}
                    />
                    <SelectInput
                      label="State of residence"
                      options={stateOptions}
                      value={state}
                      onChange={setState}
                      placeholder="Select a state..."
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="flex flex-col gap-4">
                    <CheckboxInput
                      label="Include state-level tax effects"
                      checked={includeState}
                      onChange={setIncludeState}
                    />
                    <SliderInput
                      label="Monthly UBI amount"
                      value={ubiAmount}
                      onChange={setUbiAmount}
                      min={100}
                      max={2000}
                      step={50}
                      formatValue={(v) => `$${v}`}
                    />
                    <InputGroup label="Reform parameters">
                      <NumberInput
                        label="Phase-in rate (%)"
                        value={5}
                        onChange={() => {}}
                        min={0}
                        max={100}
                      />
                      <NumberInput
                        label="Phase-out threshold ($)"
                        value={150000}
                        onChange={() => {}}
                        min={0}
                      />
                      <CheckboxInput
                        label="Apply to non-citizens with work permits"
                        checked={false}
                        onChange={() => {}}
                      />
                    </InputGroup>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Section>

          {/* ================================================================ */}
          {/* DISPLAY */}
          {/* ================================================================ */}
          <Section title="Display">
            <SubSection title="MetricCard">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  label="Annual cost"
                  value={162000000000}
                  format="currency"
                />
                <MetricCard
                  label="Poverty reduction"
                  value={0.341}
                  format="percent"
                  trend="positive"
                  delta="12.1M people lifted"
                />
                <MetricCard
                  label="Gini coefficient change"
                  value="-0.038"
                  trend="positive"
                  delta="More equal"
                />
                <MetricCard
                  label="Cost per household"
                  value={4860}
                  format="currency"
                  trend="negative"
                  delta="+$405/mo avg tax"
                />
              </div>
            </SubSection>

            <SubSection title="SummaryText">
              <SummaryText>
                Under this reform, a married couple in California earning{' '}
                <strong>{formatCurrency(income)}</strong> per year with{' '}
                <strong>{dependents} dependents</strong> would receive{' '}
                <strong>$12,000</strong> in annual UBI payments and pay an
                additional <strong>$8,200</strong> in income taxes, for a{' '}
                <strong className="text-teal-500">
                  net gain of $3,800
                </strong>{' '}
                per year.
              </SummaryText>
            </SubSection>

            <SubSection title="DataTable">
              <DataTable columns={tableColumns} data={tableData} />
            </SubSection>

            <SubSection title="PolicyEngineWatermark">
              <PolicyEngineWatermark />
            </SubSection>
          </Section>

          {/* ================================================================ */}
          {/* CHARTS */}
          {/* ================================================================ */}
          <Section title="Charts">
            <div className="grid grid-cols-1 gap-6">
              <ChartContainer
                title="Revenue sources vs. UBI cost"
                downloadFilename="revenue-vs-ubi.svg"
              >
                <PEBarChart
                  data={barData}
                  xKey="category"
                  yKey="amount"
                  height={350}
                  colorByValue
                  yLabel="Billions of dollars, annual"
                  xLabel="Revenue source"
                  formatTooltip={(v) => `$${v}B`}
                />
                <PolicyEngineWatermark />
              </ChartContainer>

              <ChartContainer
                title="Poverty rate projections"
                downloadFilename="poverty-rate-projections.svg"
              >
                <PELineChart
                  data={lineData}
                  xKey="year"
                  series={[
                    {
                      dataKey: 'baseline',
                      name: 'Baseline',
                      color: 'var(--color-gray-400)',
                      strokeDasharray: '5 5',
                    },
                    { dataKey: 'reform', name: 'With UBI reform' },
                  ]}
                  height={350}
                  yLabel="Poverty rate (%)"
                  xLabel="Year"
                  formatTooltip={(v) => `${v.toFixed(1)}%`}
                />
                <PolicyEngineWatermark />
              </ChartContainer>

              <ChartContainer
                title="Tax burden by income decile"
                downloadFilename="tax-burden-by-decile.svg"
              >
                <PEAreaChart
                  data={areaData}
                  xKey="decile"
                  series={[
                    { dataKey: 'income_tax', name: 'Income tax' },
                    { dataKey: 'payroll_tax', name: 'Payroll tax' },
                  ]}
                  height={350}
                  yLabel="Average annual amount ($)"
                  xLabel="Income decile"
                  formatTooltip={(v) => formatCurrency(v)}
                />
                <PolicyEngineWatermark />
              </ChartContainer>

              <ChartContainer
                title="Budget impact waterfall"
                downloadFilename="budget-impact-waterfall.svg"
              >
                <PEWaterfallChart
                  data={waterfallData}
                  yDomain={waterfallDomain}
                  yTicks={waterfallTicks}
                  height={350}
                  fillColor={getWaterfallFillColor}
                  yLabel="Net fiscal impact (billions)"
                  showBarLabels
                  barLabelFormatter={waterfallFmt}
                  formatTooltip={waterfallFmt}
                />
                <PolicyEngineWatermark />
              </ChartContainer>

              <ChartContainer
                title="Revenue losses waterfall (all negative)"
                downloadFilename="revenue-losses-waterfall.svg"
              >
                <PEWaterfallChart
                  data={waterfallAllNegativeData}
                  yDomain={waterfallAllNegativeDomain}
                  yTicks={waterfallAllNegativeTicks}
                  height={350}
                  fillColor={getWaterfallFillColor}
                  yLabel="Revenue change (billions)"
                  showBarLabels
                  barLabelFormatter={waterfallFmt}
                  formatTooltip={waterfallFmt}
                />
                <PolicyEngineWatermark />
              </ChartContainer>
            </div>
          </Section>

          {/* ================================================================ */}
          {/* IMPACT CHARTS */}
          {/* ================================================================ */}
          <Section title="Impact charts">
            <div className="grid grid-cols-1 gap-6">
              <ChartContainer
                title="Distributional impact by income decile"
                downloadFilename="distributional-impact.svg"
              >
                <PEImpactBarChart
                  data={impactBarData}
                  height={350}
                  yAxisLabel="Relative change in net income (%)"
                  yTickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  barLabelFormatter={(v) => `${(v * 100).toFixed(1)}%`}
                />
                <div className="flex gap-4 mt-2 px-4">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#2C7A7B' }} />
                    Gain
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#4B5563' }} />
                    Loss
                  </span>
                </div>
                <PolicyEngineWatermark />
              </ChartContainer>

              <ChartContainer
                title="Poverty impact (inverted colors)"
                downloadFilename="poverty-impact.svg"
              >
                <PEImpactBarChart
                  data={impactBarData}
                  height={350}
                  invertColors
                  yAxisLabel="Change in poverty rate (%)"
                  yTickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
                  barLabelFormatter={(v) => `${(v * 100).toFixed(1)}%`}
                />
                <div className="flex gap-4 mt-2 px-4">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#2C7A7B' }} />
                    Decrease (improvement)
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: '#4B5563' }} />
                    Increase (worsening)
                  </span>
                </div>
                <PolicyEngineWatermark />
              </ChartContainer>

              <ChartContainer
                title="Winners and losers"
                downloadFilename="winners-and-losers.svg"
              >
                <PEWinnersLosersChart
                  data={winnersLosersData}
                  allData={winnersLosersAllData}
                  height={500}
                />
                <PolicyEngineWatermark />
              </ChartContainer>

              <ChartContainer
                title="Earnings chart"
                downloadFilename="earnings-chart.svg"
              >
                <PEEarningsChart
                  data={earningsData}
                  currentEarnings={40000}
                  xTickFormatter={(v) => formatCurrency(v)}
                  yTickFormatter={(v) => formatCurrency(v)}
                  height={350}
                />
                <PolicyEngineWatermark />
              </ChartContainer>

              <ChartContainer
                title={getBudgetChartTitle(
                  budgetWaterfallData.reduce((s, d) => s + (d.isTotal ? 0 : d.value), 0),
                  'us',
                )}
                downloadFilename="budget-waterfall.svg"
              >
                <PEBudgetWaterfallChart
                  data={budgetWaterfallData}
                  countryId="us"
                  height={350}
                />
                <PolicyEngineWatermark />
              </ChartContainer>
            </div>
          </Section>

          {/* ================================================================ */}
          {/* VISUALIZATIONS */}
          {/* ================================================================ */}
          <Section title="Visualizations">
            <SubSection title="Congressional district map">
              <Text size="sm" c="dimmed" className="mb-3">
                436 congressional districts with bundled GeoJSON — toggle between geographic and hex views
              </Text>
              <div className="mb-3">
                <MapTypeToggle value={mapVizType} onChange={setMapVizType} />
              </div>
              <USDistrictChoroplethMap
                data={congressionalHexData}
                visualizationType={mapVizType}
                downloadFilename="us-district-map.svg"
                config={{
                  width: 900,
                  height: 550,
                  colorScale: { colors: [...DIVERGING_GRAY_TEAL], symmetric: true },
                  borderColor: '#FFFFFF',
                  borderWidth: 0.5,
                  formatValue: (v) => `${(v * 100).toFixed(1)}%`,
                }}
              />
            </SubSection>

            <SubSection title="UK constituency map">
              <Text size="sm" c="dimmed" className="mb-3">
                650 parliamentary constituencies with bundled GeoJSON — toggle between geographic and hex views
              </Text>
              <div className="mb-3">
                <MapTypeToggle value={ukMapVizType} onChange={setUkMapVizType} />
              </div>
              <UKConstituencyChoroplethMap
                data={ukConstituencyData}
                visualizationType={ukMapVizType}
                downloadFilename="uk-constituency-map.svg"
                config={{
                  width: 600,
                  height: 700,
                  colorScale: { colors: [...DIVERGING_GRAY_TEAL], symmetric: true },
                  borderColor: '#FFFFFF',
                  borderWidth: 0.3,
                  formatValue: (v) => `${(v * 100).toFixed(1)}%`,
                }}
              />
            </SubSection>

            <SubSection title="US state hexagonal map">
              <HexagonalMap
                data={hexMapData}
                config={{ hexSize: 28, showLabels: true, labelFontSize: 9, colorScale: { colors: [...DIVERGING_GRAY_TEAL], symmetric: true } }}
                formatter={(v) => `${(v * 100).toFixed(1)}%`}
                downloadFilename="us-state-hex-map.svg"
              />
            </SubSection>

            <SubSection title="State legislative district map">
              <Text size="sm" c="dimmed" className="mb-3">
                State senate and house districts — only states with average district population &ge; 100,000
              </Text>
              <label className="text-sm font-medium text-muted-foreground mb-1 block">State</label>
              <div className="flex gap-4 mb-3 items-center">
                <div className="w-56">
                  <SelectInput
                    options={sldStateOptions}
                    value={sldState}
                    onChange={(val) => {
                      setSldState(val);
                      // Auto-reset to upper if new state doesn't qualify for lower
                      if (sldChamber === 'lower' && !(SLDL_QUALIFYING_STATES as readonly string[]).includes(val)) {
                        setSldChamber('upper');
                      }
                    }}
                  />
                </div>
                <div className="bg-white rounded-md">
                  <SegmentedControl
                    value={sldChamber}
                    onValueChange={(v) => setSldChamber(v as StateLegislativeChamber)}
                    size="sm"
                    options={[
                      { label: 'Senate (upper)', value: 'upper' },
                      {
                        label: 'House (lower)',
                        value: 'lower',
                        disabled: !(SLDL_QUALIFYING_STATES as readonly string[]).includes(sldState),
                      },
                    ]}
                  />
                </div>
              </div>
              <StateLegislativeDistrictMap
                data={sldDemoData}
                state={sldState}
                chamber={sldChamber}
                downloadFilename={`${sldState.toLowerCase()}-${sldChamber}-districts.svg`}
                config={{
                  height: 550,
                  colorScale: { colors: [...DIVERGING_GRAY_TEAL], symmetric: true },
                  formatValue: (v) => `${(v * 100).toFixed(1)}%`,
                }}
              />
            </SubSection>

            <SubSection title="Color semantics swatches">
              <div className="space-y-4">
                <div>
                  <Text size="sm" fw={500} className="mb-2">Diverging gray-teal</Text>
                  <div className="flex">
                    {DIVERGING_GRAY_TEAL.map((color, i) => (
                      <div
                        key={i}
                        className="h-8 flex-1"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <Text size="sm" fw={500} className="mb-2">Winners/losers scale</Text>
                  <div className="flex">
                    {winnersLosersColors.scale.map((color, i) => (
                      <div
                        key={i}
                        className="h-8 flex-1"
                        style={{ backgroundColor: color }}
                        title={winnersLosersColors.labels[i]}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </SubSection>
          </Section>

          <div className="text-center py-8 text-sm text-muted-foreground">
            @policyengine/ui-kit — All components shown with example data
          </div>
        </div>
      </DashboardShell>
    </TooltipProvider>
  );
}
