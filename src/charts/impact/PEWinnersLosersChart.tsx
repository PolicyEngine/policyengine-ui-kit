import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { AXIS_STYLE, TOOLTIP_CONTAINER_STYLE } from '../chartDefaults';
import { winnersLosersColors } from '../colorSemantics';
import { cn } from '../../utils/cn';

export interface WinnersLosersSegment {
  gainMore5: number;
  gainLess5: number;
  noChange: number;
  loseLess5: number;
  loseMore5: number;
}

export interface WinnersLosersDatum extends WinnersLosersSegment {
  name: string;
}

export interface PEWinnersLosersChartProps {
  data: WinnersLosersDatum[];
  allData?: WinnersLosersSegment;
  height?: number;
  xLabel?: string;
  yLabel?: string;
  className?: string;
  styles?: { root?: React.CSSProperties };
}

const SEGMENT_KEYS: (keyof WinnersLosersSegment)[] = [
  'gainMore5',
  'gainLess5',
  'noChange',
  'loseLess5',
  'loseMore5',
];

const LEGEND_ITEMS: { key: keyof WinnersLosersSegment; label: string }[] = [
  { key: 'gainMore5', label: 'Gain more than 5%' },
  { key: 'gainLess5', label: 'Gain less than 5%' },
  { key: 'noChange', label: 'No change' },
  { key: 'loseLess5', label: 'Loss less than 5%' },
  { key: 'loseMore5', label: 'Loss more than 5%' },
];

const LEGEND_MAP: Record<string, string> = Object.fromEntries(
  LEGEND_ITEMS.map((item) => [item.key, item.label]),
);

const BAR_SIZE = 22;

function WinnersLosersTooltipContent({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: WinnersLosersDatum; name?: string; value?: number; color?: string }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  const label = item.name === 'All' ? 'All households' : `Decile ${item.name}`;

  return (
    <div style={TOOLTIP_CONTAINER_STYLE}>
      <p style={{ fontWeight: 600, margin: '0 0 4px 0' }}>{label}</p>
      {SEGMENT_KEYS.map((key, i) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '1px 0' }}>
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: winnersLosersColors.scale[i],
              flexShrink: 0,
            }}
          />
          <span style={{ color: 'var(--muted-foreground)', fontSize: 13 }}>
            {LEGEND_MAP[key]}: {(item[key] * 100).toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
}

export function PEWinnersLosersChart({
  data,
  allData,
  height = 400,
  xLabel = 'Population share',
  yLabel = 'Income decile',
  className,
  styles,
}: PEWinnersLosersChartProps) {
  const allChartData = allData ? [{ name: 'All', ...allData }] : null;
  const allBarHeight = 50;
  const gapHeight = 12;
  // Compute decile chart height from bar count so bars stay tight
  const decileHeight = data.length * (BAR_SIZE + 1) + 60; // bars + 1px gaps + axis/margins

  return (
    <div className={cn('w-full flex', className)} style={styles?.root}>
      {/* Chart area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* "All" bar */}
        {allChartData && (
          <>
            <div style={{ height: allBarHeight }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={allChartData}
                  stackOffset="expand"
                  barSize={BAR_SIZE}
                  margin={{ top: 8, right: 10, bottom: 0, left: 40 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={AXIS_STYLE}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip
                    content={<WinnersLosersTooltipContent />}
                    allowEscapeViewBox={{ x: true, y: true }}
                    offset={20}
                    wrapperStyle={{ zIndex: 1000 }}
                  />
                  {SEGMENT_KEYS.map((key, i) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId="a"
                      fill={winnersLosersColors.scale[i]}
                      isAnimationActive={false}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ height: gapHeight }} />
          </>
        )}

        {/* Decile bars — tight spacing */}
        <div style={{ height: decileHeight }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={data}
              stackOffset="expand"
              barSize={BAR_SIZE}
              barCategoryGap={1}
              margin={{ top: 0, right: 10, bottom: 40, left: 40 }}
            >
              <XAxis
                type="number"
                tick={AXIS_STYLE}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)' }}
                tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
              >
                {xLabel && (
                  <Label
                    value={xLabel}
                    position="bottom"
                    offset={20}
                    style={AXIS_STYLE}
                  />
                )}
              </XAxis>
              <YAxis
                type="category"
                dataKey="name"
                tick={AXIS_STYLE}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)' }}
                width={40}
                interval={0}
              >
                {yLabel && (
                  <Label
                    value={yLabel}
                    angle={-90}
                    position="insideLeft"
                    style={{ textAnchor: 'middle', ...AXIS_STYLE }}
                  />
                )}
              </YAxis>
              <Tooltip
                content={<WinnersLosersTooltipContent />}
                allowEscapeViewBox={{ x: true, y: true }}
                offset={20}
                wrapperStyle={{ zIndex: 1000 }}
              />
              {SEGMENT_KEYS.map((key, i) => (
                <Bar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  fill={winnersLosersColors.scale[i]}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend — right side */}
      <div className="flex flex-col justify-center gap-2 pl-4 pr-2 shrink-0">
        {LEGEND_ITEMS.map((item, i) => (
          <div key={item.key} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-sm shrink-0"
              style={{ backgroundColor: winnersLosersColors.scale[i] }}
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
