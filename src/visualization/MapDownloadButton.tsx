import { Download } from 'lucide-react';
import { downloadChartAsSvg } from '../utils/chartUtils';
import { Button } from '../primitives/Button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../primitives/Tooltip';
import { cn } from '../utils/cn';

export interface MapDownloadButtonProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  filename: string;
  className?: string;
  styles?: { root?: React.CSSProperties };
}

export function MapDownloadButton({ containerRef, filename, className, styles }: MapDownloadButtonProps) {
  const handleDownload = () => {
    if (!containerRef.current) {
      console.warn('MapDownloadButton: container ref is null');
      return;
    }
    downloadChartAsSvg(containerRef.current, { filename });
  };

  return (
    <div className={cn('absolute', className)} style={{ top: 8, right: 8, zIndex: 5, ...styles?.root }}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleDownload}
              aria-label="Download as SVG"
              style={{
                background: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: 4,
              }}
            >
              <Download size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Download as SVG</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
