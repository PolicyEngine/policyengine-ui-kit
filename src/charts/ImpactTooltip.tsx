import { TOOLTIP_CONTAINER_STYLE } from './chartDefaults';

export interface ImpactTooltipItem {
  name: string;
  hoverText?: string;
  value?: number;
  color?: string;
}

export interface ImpactTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload?: ImpactTooltipItem;
    value?: number;
    name?: string;
    color?: string;
  }>;
  formatter?: (value: number) => string;
}

export function ImpactTooltip({
  active,
  payload,
  formatter,
}: ImpactTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div style={TOOLTIP_CONTAINER_STYLE}>
      <p style={{ fontWeight: 600, margin: '0 0 4px 0' }}>{item.name}</p>
      {item.hoverText && (
        <p style={{ margin: 0, color: 'var(--muted-foreground)' }}>
          {item.hoverText}
        </p>
      )}
      {!item.hoverText && item.value != null && (
        <p style={{ margin: 0, color: 'var(--muted-foreground)' }}>
          {formatter ? formatter(item.value) : String(item.value)}
        </p>
      )}
    </div>
  );
}
