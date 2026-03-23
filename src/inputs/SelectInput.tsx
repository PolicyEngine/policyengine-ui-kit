import { forwardRef, useState, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectInputProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  styles?: {
    root?: React.CSSProperties;
    label?: React.CSSProperties;
    select?: React.CSSProperties;
  };
}

export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(
  ({ label, options, value, onChange, placeholder, className, styles, ...props }, ref) => {
    const [open, setOpen] = useState(false);

    return (
      <div className={cn('flex flex-col gap-1', className)} style={styles?.root}>
        {label && (
          <label className="text-sm font-medium text-muted-foreground" style={styles?.label}>
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            className="h-10 w-full rounded-sm border border-border px-3 pr-8 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary appearance-none bg-white"
            style={styles?.select}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className={cn(
              'pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground transition-transform',
              open && 'rotate-180',
            )}
          />
        </div>
      </div>
    );
  },
);
SelectInput.displayName = 'SelectInput';
