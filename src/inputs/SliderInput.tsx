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
    <div className={cn('tw:flex tw:flex-col tw:gap-1', className)} style={styles?.root}>
      {label && (
        <div className="tw:flex tw:items-center tw:justify-between">
          <label className="tw:text-sm tw:font-medium tw:text-text-secondary" style={styles?.label}>
            {label}
          </label>
          <span className="tw:text-sm tw:font-medium tw:text-text-primary" style={styles?.value}>
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
        className="tw:w-full tw:accent-primary tw:cursor-pointer"
        style={styles?.input}
        {...props}
      />
    </div>
  ),
);
SliderInput.displayName = 'SliderInput';
