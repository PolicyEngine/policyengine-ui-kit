import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface CurrencyInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'value'> {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  currencySymbol?: string;
  styles?: {
    root?: React.CSSProperties;
    label?: React.CSSProperties;
    input?: React.CSSProperties;
  };
}

function formatDisplay(value: number): string {
  return value.toLocaleString('en-US');
}

function parseInput(raw: string): number {
  const cleaned = raw.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ label, value, onChange, currencySymbol = '$', className, styles, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const [rawText, setRawText] = useState(String(value));

    const displayValue = focused ? rawText : formatDisplay(value);

    return (
      <div className={cn('tw:flex tw:flex-col tw:gap-1', className)} style={styles?.root}>
        {label && (
          <label className="tw:text-sm tw:font-medium tw:text-text-secondary" style={styles?.label}>
            {label}
          </label>
        )}
        <div className="tw:relative">
          <span className="tw:absolute tw:left-3 tw:top-1/2 tw:-translate-y-1/2 tw:text-sm tw:text-text-secondary">
            {currencySymbol}
          </span>
          <input
            ref={ref}
            type="text"
            inputMode="decimal"
            value={displayValue}
            onFocus={() => {
              setFocused(true);
              setRawText(String(value));
            }}
            onBlur={() => {
              setFocused(false);
              onChange(parseInput(rawText));
            }}
            onChange={(e) => {
              setRawText(e.target.value);
            }}
            className="tw:h-10 tw:w-full tw:rounded-element tw:border tw:border-border-light tw:pl-7 tw:pr-3 tw:text-sm tw:transition-colors tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-ring tw:focus:border-primary"
            style={styles?.input}
            {...props}
          />
        </div>
      </div>
    );
  },
);
CurrencyInput.displayName = 'CurrencyInput';
