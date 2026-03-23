import { Download } from 'lucide-react';
import { downloadChartAsSvg } from '../utils/chartUtils';
import { Button } from '../primitives/Button';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../primitives/Tooltip';

export interface MapDownloadButtonProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  filename: string;
}

export function MapDownloadButton({ containerRef, filename }: MapDownloadButtonProps) {
  const handleDownload = () => {
    if (containerRef.current) {
      downloadChartAsSvg(containerRef.current, { filename });
    }
  };

  return (
    <div className="absolute" style={{ top: 8, right: 8, zIndex: 5 }}>
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
