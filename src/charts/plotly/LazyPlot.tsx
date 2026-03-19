import { Suspense, lazy, type ComponentType } from 'react';

/**
 * Lazy-loaded wrapper for react-plotly.js.
 *
 * react-plotly.js is an optional peer dependency — this component will
 * show a fallback message if it's not installed.
 *
 * Usage:
 * ```tsx
 * <LazyPlot
 *   data={[{ x: [1, 2, 3], y: [2, 6, 3], type: 'scatter' }]}
 *   layout={{ width: 600, height: 400 }}
 * />
 * ```
 */

interface PlotParams {
  data: Array<Record<string, unknown>>;
  layout?: Record<string, unknown>;
  config?: Record<string, unknown>;
  style?: React.CSSProperties;
  className?: string;
  onHover?: (event: unknown) => void;
  onClick?: (event: unknown) => void;
}

let PlotComponent: ComponentType<PlotParams> | null = null;
let loadAttempted = false;
let loadError = false;

const LazyPlotInner = lazy(async () => {
  if (PlotComponent) return { default: PlotComponent };
  if (loadAttempted && loadError) {
    return { default: PlotFallback };
  }

  loadAttempted = true;
  try {
    const mod = await import('react-plotly.js');
    PlotComponent = (mod.default ?? mod) as unknown as ComponentType<PlotParams>;
    return { default: PlotComponent };
  } catch {
    loadError = true;
    return { default: PlotFallback };
  }
});

function PlotFallback(props: PlotParams) {
  return (
    <div
      className={props.className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 400,
        border: '1px dashed var(--border)',
        borderRadius: 8,
        color: 'var(--muted-foreground)',
        fontFamily: 'var(--font-sans)',
        fontSize: 14,
        ...props.style,
      }}
    >
      Install react-plotly.js to render this chart
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 400,
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          border: '2px solid var(--border)',
          borderTopColor: 'var(--primary)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  );
}

export function LazyPlot(props: PlotParams) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyPlotInner {...props} />
    </Suspense>
  );
}
