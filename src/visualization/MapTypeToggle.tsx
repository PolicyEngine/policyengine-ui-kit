import type { MapVisualizationType } from './types';
import { cn } from '../utils/cn';

export interface MapTypeToggleProps {
  value: MapVisualizationType;
  onChange: (value: MapVisualizationType) => void;
  className?: string;
}

export function MapTypeToggle({ value, onChange, className }: MapTypeToggleProps) {
  return (
    <div className={cn('inline-flex rounded-md border border-border', className)}>
      <button
        type="button"
        onClick={() => onChange('geographic')}
        className={cn(
          'px-3 py-1.5 text-xs font-medium transition-colors rounded-l-md cursor-pointer',
          value === 'geographic'
            ? 'bg-primary text-primary-foreground'
            : 'bg-white text-muted-foreground hover:bg-gray-50',
        )}
      >
        Geographic
      </button>
      <button
        type="button"
        onClick={() => onChange('hex')}
        className={cn(
          'px-3 py-1.5 text-xs font-medium transition-colors rounded-r-md cursor-pointer',
          value === 'hex'
            ? 'bg-primary text-primary-foreground'
            : 'bg-white text-muted-foreground hover:bg-gray-50',
        )}
      >
        Hex grid
      </button>
    </div>
  );
}
