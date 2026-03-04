import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface SliderInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
  styles?: {
    root?: React.CSSProperties;
    label?: React.CSSProperties;
    input?: React.CSSProperties;
    value?: React.CSSProperties;
  };
}

export const SliderInput = forwardRef<HTMLInputElement, SliderInputProps>(
  ({ label, value, onChange, min, max, step = 1, formatValue, className, styles, ...props }, ref) => (
    <div className={cn('flex flex-col gap-1', className)} style={styles?.root}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-pe-text-secondary" style={styles?.label}>
            {label}
          </label>
          <span className="text-sm font-medium text-pe-text-primary" style={styles?.value}>
            {formatValue ? formatValue(value) : value}
          </span>
        </div>
      )}
      <input
        ref={ref}
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        className="w-full accent-primary cursor-pointer"
        style={styles?.input}
        {...props}
      />
    </div>
  ),
);
SliderInput.displayName = 'SliderInput';
