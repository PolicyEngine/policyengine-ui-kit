import * as React from 'react';
import { Tabs as TabsPrimitive } from 'radix-ui';
import { cn } from '../utils/cn';

interface SegmentedControlOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SegmentedControlProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SegmentedControlOption[];
  size?: 'xs' | 'sm';
  className?: string;
}

const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  ({ value, onValueChange, options, size = 'sm', className }, ref) => {
    return (
      <TabsPrimitive.Root value={value} onValueChange={onValueChange} ref={ref}>
        <TabsPrimitive.List
          data-slot="segmented-control"
          className={cn(
            'inline-flex items-center gap-0.5 rounded-lg bg-muted',
            size === 'xs' ? 'h-7 p-1' : 'h-9 p-1',
            className,
          )}
        >
          {options.map((option) => (
            <TabsPrimitive.Trigger
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={cn(
                'inline-flex h-full items-center justify-center rounded-md px-2 font-medium whitespace-nowrap transition-all',
                'text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
                'disabled:pointer-events-none disabled:opacity-50',
                size === 'xs' ? 'text-xs' : 'text-sm',
              )}
            >
              {option.label}
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>
      </TabsPrimitive.Root>
    );
  },
);

SegmentedControl.displayName = 'SegmentedControl';

export { SegmentedControl };
export type { SegmentedControlOption, SegmentedControlProps };
