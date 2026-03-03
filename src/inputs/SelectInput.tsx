import { forwardRef, type SelectHTMLAttributes } from 'react';
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
  ({ label, options, value, onChange, placeholder, className, styles, ...props }, ref) => (
    <div className={cn('tw:flex tw:flex-col tw:gap-1', className)} style={styles?.root}>
      {label && (
        <label className="tw:text-sm tw:font-medium tw:text-text-secondary" style={styles?.label}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="tw:h-10 tw:w-full tw:rounded-element tw:border tw:border-border-light tw:px-3 tw:text-sm tw:transition-colors tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-ring tw:focus:border-primary tw:appearance-none tw:bg-white"
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
    </div>
  ),
);
SelectInput.displayName = 'SelectInput';
