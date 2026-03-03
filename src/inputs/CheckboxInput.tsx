import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

export interface CheckboxInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  styles?: {
    root?: React.CSSProperties;
    label?: React.CSSProperties;
    input?: React.CSSProperties;
  };
}

export const CheckboxInput = forwardRef<HTMLInputElement, CheckboxInputProps>(
  ({ label, checked, onChange, className, styles, ...props }, ref) => (
    <label
      className={cn('tw:flex tw:items-center tw:gap-2 tw:cursor-pointer', className)}
      style={styles?.root}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="tw:h-4 tw:w-4 tw:rounded tw:border tw:border-border-light tw:text-primary tw:focus:ring-2 tw:focus:ring-ring tw:cursor-pointer"
        style={styles?.input}
        {...props}
      />
      <span className="tw:text-sm tw:text-text-primary" style={styles?.label}>
        {label}
      </span>
    </label>
  ),
);
CheckboxInput.displayName = 'CheckboxInput';
