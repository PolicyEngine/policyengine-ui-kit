import { useState } from 'react';

// Primitives
import { Button } from '../src/primitives/Button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../src/primitives/Card';
import { Badge } from '../src/primitives/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../src/primitives/Tabs';

// Layout
import { DashboardShell } from '../src/layout/DashboardShell';
import { Header } from '../src/layout/Header';
import { SidebarLayout } from '../src/layout/SidebarLayout';
import { SingleColumnLayout } from '../src/layout/SingleColumnLayout';
import { InputPanel } from '../src/layout/InputPanel';
import { ResultsPanel } from '../src/layout/ResultsPanel';

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

// Utils
import { formatCurrency } from '../src/utils/formatters';

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

const waterfallData = [
  { name: 'Income tax', value: 320 },
  { name: 'Payroll tax', value: 180 },
  { name: 'Corporate tax', value: 95 },
  { name: 'Excise tax', value: 45 },
  { name: 'UBI cost', value: -480 },
  { name: 'Net impact', value: 0, isTotal: true },
];

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
      <h3 className="text-lg font-semibold text-muted-foreground mb-4">
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

  return (
    <DashboardShell>
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
        {/* PRIMITIVES */}
        {/* ================================================================ */}
        <Section title="Primitives">
          <SubSection title="Button">
            <div className="flex flex-wrap gap-3 mb-4">
              <Button variant="default">Default</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">+</Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button disabled>Disabled</Button>
              <Button variant="outline" disabled>
                Disabled outline
              </Button>
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
            </div>
          </SubSection>

          <SubSection title="Card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Universal Basic Income</CardTitle>
                  <CardDescription>
                    $500/month payment to every adult citizen
                  </CardDescription>
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
                  <Button variant="outline" size="sm" className="ml-2">
                    Compare
                  </Button>
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
                    and $3,000 for children 6-17, with full refundability for
                    all qualifying families.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button size="sm">View details</Button>
                </CardFooter>
              </Card>
            </div>
          </SubSection>

          <SubSection title="Tabs">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="distributional">
                  Distributional impact
                </TabsTrigger>
                <TabsTrigger value="budget">Budget impact</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      This tab shows the overview of the policy reform,
                      including headline metrics and a summary of key impacts
                      across income deciles.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="distributional">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      Distributional analysis shows how the reform affects
                      different income groups, with the bottom 5 deciles
                      gaining and the top 4 deciles bearing the net cost.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="budget">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-sm text-muted-foreground">
                      The budget impact analysis estimates this reform would
                      cost approximately $160 billion annually, partially
                      offset by increased economic activity.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </SubSection>
        </Section>

        {/* ================================================================ */}
        {/* LAYOUT */}
        {/* ================================================================ */}
        <Section title="Layout">
          <SubSection title="Header (light)">
            <Header
              variant="light"
              logo={
                <img src={logos.tealWordmark} alt="PolicyEngine" className="h-5" />
              }
              actions={
                <>
                  <a href="#">Research</a>
                  <a href="#">About</a>
                  <a href="#">Donate</a>
                  <Button size="sm">Sign in</Button>
                </>
              }
            >
              <span className="ml-2">
                UBI Calculator
              </span>
            </Header>
          </SubSection>

          <SubSection title="Header (dark)">
            <Header
              variant="dark"
              logo={
                <img src={logos.whiteWordmark} alt="PolicyEngine" className="h-5" />
              }
              actions={
                <>
                  <a href="#">Research</a>
                  <a href="#">About</a>
                  <a href="#">Donate</a>
                  <Button size="sm" className="bg-white text-teal-600 hover:bg-gray-100">Sign in</Button>
                </>
              }
            >
              <span className="ml-2">
                Policy calculator
              </span>
            </Header>
          </SubSection>

          <SubSection title="PolicyEngine logos">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4 flex flex-col items-center gap-2">
                  <img src={logos.tealWordmark} alt="Teal wordmark (SVG)" className="h-6" />
                  <span className="text-xs text-gray-400">tealWordmark</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 flex flex-col items-center gap-2">
                  <img src={logos.tealWordmarkPng} alt="Teal wordmark (PNG)" className="h-6" />
                  <span className="text-xs text-gray-400">tealWordmarkPng</span>
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
                  <span className="text-xs text-gray-400">tealSquare</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 flex flex-col items-center gap-2">
                  <img src={logos.tealSquarePng} alt="Teal square (PNG)" className="h-10" />
                  <span className="text-xs text-gray-400">tealSquarePng</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 flex flex-col items-center gap-2">
                  <img src={logos.tealSquareTransparent} alt="Teal square transparent (PNG)" className="h-10" />
                  <span className="text-xs text-gray-400">tealSquareTransparent</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 flex flex-col items-center gap-2">
                  <img src={logos.tealSquarePadded} alt="Teal square padded (SVG)" className="h-10" />
                  <span className="text-xs text-gray-400">tealSquarePadded</span>
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
                <h3 className="text-xl font-bold mb-4">
                  Policy summary
                </h3>
                <SummaryText>
                  This reform introduces a <strong>$500 monthly Universal
                  Basic Income</strong> for all adult US citizens. The
                  program would be funded through a combination of income
                  tax surcharges on high earners and reductions in existing
                  means-tested transfer programs. The bottom 50% of
                  households would see a net income increase, while the top
                  30% would see a net decrease.
                </SummaryText>
              </SingleColumnLayout>
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
              subtitle="Billions of dollars, annual"
              actions={
                <Button variant="outline" size="sm">
                  Download CSV
                </Button>
              }
            >
              <PEBarChart
                data={barData}
                xKey="category"
                yKey="amount"
                height={350}
                colorByValue
                formatTooltip={(v) => `$${v}B`}
              />
              <PolicyEngineWatermark />
            </ChartContainer>

            <ChartContainer
              title="Poverty rate projections"
              subtitle="Percentage of population below poverty line, 2024-2033"
            >
              <PELineChart
                data={lineData}
                xKey="year"
                series={[
                  {
                    dataKey: 'baseline',
                    name: 'Baseline',
                    color: 'var(--gray-400)',
                    strokeDasharray: '5 5',
                  },
                  { dataKey: 'reform', name: 'With UBI reform' },
                ]}
                height={350}
                formatTooltip={(v) => `${v.toFixed(1)}%`}
              />
              <PolicyEngineWatermark />
            </ChartContainer>

            <ChartContainer
              title="Tax burden by income decile"
              subtitle="Average annual amount per household"
            >
              <PEAreaChart
                data={areaData}
                xKey="decile"
                series={[
                  { dataKey: 'income_tax', name: 'Income tax' },
                  { dataKey: 'payroll_tax', name: 'Payroll tax' },
                ]}
                height={350}
                formatTooltip={(v) => formatCurrency(v)}
              />
              <PolicyEngineWatermark />
            </ChartContainer>

            <ChartContainer
              title="Budget impact waterfall"
              subtitle="Net fiscal impact of UBI reform (billions)"
            >
              <PEWaterfallChart
                data={waterfallData}
                height={350}
                formatTooltip={(v) => `$${v}B`}
              />
              <PolicyEngineWatermark />
            </ChartContainer>
          </div>
        </Section>

        <div className="text-center py-8 text-sm text-gray-400">
          @policyengine/ui-kit v0.1.0 — All components shown with example data
        </div>
      </div>
    </DashboardShell>
  );
}
