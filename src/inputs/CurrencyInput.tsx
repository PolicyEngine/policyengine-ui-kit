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
      <div className={cn('flex flex-col gap-1', className)} style={styles?.root}>
        {label && (
          <label className="text-sm font-medium text-muted-foreground" style={styles?.label}>
            {label}
          </label>
        )}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
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
            className="h-10 w-full rounded-sm border border-border bg-white pl-7 pr-3 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
            style={styles?.input}
            {...props}
          />
        </div>
      </div>
    );
  },
);
CurrencyInput.displayName = 'CurrencyInput';
