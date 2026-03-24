import { cn } from '../utils/cn';

export interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  className?: string;
  styles?: { root?: React.CSSProperties };
}

const btnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  border: '1px solid var(--border)',
  background: 'var(--background)',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 16,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--foreground)',
  lineHeight: 1,
};

export function ZoomControls({ onZoomIn, onZoomOut, onReset, className, styles }: ZoomControlsProps) {
  return (
    <div
      className={cn('absolute flex flex-col gap-1', className)}
      style={{ top: 8, left: 8, zIndex: 5, ...styles?.root }}
    >
      <button style={btnStyle} onClick={onZoomIn} aria-label="Zoom in" title="Zoom in">+</button>
      <button style={btnStyle} onClick={onZoomOut} aria-label="Zoom out" title="Zoom out">&minus;</button>
      <button style={{ ...btnStyle, fontSize: 12 }} onClick={onReset} aria-label="Reset zoom" title="Reset zoom">&#8634;</button>
    </div>
  );
}
