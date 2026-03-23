import { type HTMLAttributes, type ReactNode, useRef } from 'react';
import { Download } from 'lucide-react';
import { cn } from '../utils/cn';
import { downloadChartAsSvg } from '../utils/chartUtils';
import { Button } from '../primitives/Button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../primitives/Tooltip';

export interface ChartContainerProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  /** When set, shows a download button that exports the chart as an SVG. */
  downloadFilename?: string;
  styles?: {
    root?: React.CSSProperties;
    title?: React.CSSProperties;
    content?: React.CSSProperties;
  };
}

export function ChartContainer({
  title,
  subtitle,
  actions,
  downloadFilename,
  className,
  styles,
  children,
  ...props
}: ChartContainerProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (contentRef.current) {
      downloadChartAsSvg(contentRef.current, {
        title,
        subtitle,
        filename: downloadFilename,
      });
    }
  };

  const showHeader = !!(title || actions || downloadFilename);

  return (
    <div
      className={cn(
        'bg-card border border-border rounded-lg p-4',
        className,
      )}
      style={styles?.root}
      {...props}
    >
      {showHeader && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            {title && (
              <h3
                className="text-base font-semibold text-foreground"
                style={styles?.title}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {downloadFilename && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleDownload}
                      aria-label="Download as SVG"
                    >
                      <Download size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">Download as SVG</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {actions}
          </div>
        </div>
      )}
      <div ref={contentRef} style={styles?.content}>{children}</div>
    </div>
  );
}
