import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  styles?: {
    root?: React.CSSProperties;
    label?: React.CSSProperties;
    input?: React.CSSProperties;
  };
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ label, value, onChange, min, max, step = 1, className, styles, ...props }, ref) => (
    <div className={cn('flex flex-col gap-1', className)} style={styles?.root}>
      {label && (
        <label className="text-sm font-medium text-muted-foreground" style={styles?.label}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="h-10 w-full rounded-sm border border-border px-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
        style={styles?.input}
        {...props}
      />
    </div>
  ),
);
NumberInput.displayName = 'NumberInput';
