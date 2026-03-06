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
      className={cn('flex items-center gap-2 cursor-pointer', className)}
      style={styles?.root}
    >
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border border-border accent-primary focus:ring-2 focus:ring-ring cursor-pointer"
        style={styles?.input}
        {...props}
      />
      <span className="text-sm text-foreground" style={styles?.label}>
        {label}
      </span>
    </label>
  ),
);
CheckboxInput.displayName = 'CheckboxInput';
