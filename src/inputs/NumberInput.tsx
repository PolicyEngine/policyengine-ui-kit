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
    <div className={cn('tw:flex tw:flex-col tw:gap-1', className)} style={styles?.root}>
      {label && (
        <label className="tw:text-sm tw:font-medium tw:text-text-secondary" style={styles?.label}>
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
        className="tw:h-10 tw:w-full tw:rounded-element tw:border tw:border-border-light tw:px-3 tw:text-sm tw:transition-colors tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-ring tw:focus:border-primary"
        style={styles?.input}
        {...props}
      />
    </div>
  ),
);
NumberInput.displayName = 'NumberInput';
