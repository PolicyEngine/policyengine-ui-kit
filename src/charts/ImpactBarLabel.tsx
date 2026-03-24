/**
 * Custom Recharts label component for impact bar charts.
 * Renders value labels centered above positive bars and below negative bars.
 */
export interface ImpactBarLabelProps {
  x?: number;
  y?: number;
  width?: number;
  value?: number;
  formatter?: (value: number) => string;
  className?: string;
  styles?: { root?: React.CSSProperties };
}

export function ImpactBarLabel({
  x = 0,
  y = 0,
  width = 0,
  value = 0,
  formatter,
  className,
  styles,
}: ImpactBarLabelProps) {
  const isPositive = value >= 0;
  const labelY = isPositive ? y - 4 : y + 16;
  const text = formatter ? formatter(value) : String(value);

  return (
    <text
      className={className}
      x={x + width / 2}
      y={labelY}
      textAnchor="middle"
      fontSize={12}
      fontFamily="var(--font-sans)"
      fill="var(--color-gray-700)"
      style={styles?.root}
    >
      {text}
    </text>
  );
}
