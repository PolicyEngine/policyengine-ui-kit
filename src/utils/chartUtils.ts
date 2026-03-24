/**
 * Chart utility functions for axis ticks, sizing, margins, and data export.
 */


// --- Nice tick generation (D3-style) ---

const NICE_STEPS = [1, 2, 2.5, 5, 10];

/**
 * Generate "nice" tick values for a chart axis.
 * Uses the D3 nice-numbers algorithm with step multiples [1, 2, 2.5, 5, 10].
 */
export function getNiceTicks(
  domain: [number, number],
  count: number = 5,
): number[] {
  const [rawMin, rawMax] = domain;
  if (rawMin === rawMax) return [rawMin];
  if (count <= 1) return [rawMin];

  const range = rawMax - rawMin;
  const roughStep = range / (count - 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const normalized = roughStep / magnitude;

  let niceStep = magnitude;
  for (const s of NICE_STEPS) {
    if (normalized <= s) {
      niceStep = s * magnitude;
      break;
    }
  }

  const niceMin = Math.floor(rawMin / niceStep) * niceStep;
  const niceMax = Math.ceil(rawMax / niceStep) * niceStep;

  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + niceStep * 0.01; v += niceStep) {
    ticks.push(parseFloat(v.toPrecision(12)));
  }
  return ticks;
}

// --- Clamped chart height ---

/**
 * Calculate responsive chart height clamped to sensible bounds.
 * Mobile: 250–400px, Desktop: 400–700px.
 */
export function getClampedChartHeight(
  viewportHeight: number,
  isMobile: boolean = false,
): number {
  if (isMobile) {
    return Math.max(250, Math.min(400, viewportHeight * 0.45));
  }
  return Math.max(400, Math.min(700, viewportHeight * 0.55));
}

// --- Default chart margins (left is minimal; use getYAxisLayout for dynamic left) ---

export const CHART_MARGINS = {
  bar: { top: 20, right: 20, bottom: 20, left: 0 },
  line: { top: 20, right: 20, bottom: 20, left: 0 },
  area: { top: 20, right: 20, bottom: 20, left: 0 },
  waterfall: { top: 20, right: 20, bottom: 40, left: 0 },
} as const;

// --- Y-axis layout (dynamic width, margin, and label offset) ---

const AXIS_FONT = '12px Inter, system-ui, sans-serif';
const Y_LABEL_FONT_SIZE = 12; // matches AXIS_STYLE fontSize
const TICK_PADDING = 4;

/**
 * Measure tick label widths and compute the YAxis width, left margin,
 * and label dx so nothing clips and there's no wasted space.
 *
 * - yAxisWidth: set as the `width` prop on `<YAxis>`
 * - marginLeft: set as `margin.left` on the chart
 * - labelDx: set as `dx` on the YAxis label
 */
export function getYAxisLayout(
  ticks: number[],
  hasLabel: boolean,
  formatter?: (value: number) => string,
): { yAxisWidth: number; marginLeft: number; labelDx: number } {
  const fallbackTickWidth = 30;

  let maxTickWidth = fallbackTickWidth;
  if (typeof document !== 'undefined' && ticks.length > 0) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.font = AXIS_FONT;
      const labels = ticks.map((t) => (formatter ? formatter(t) : String(t)));
      maxTickWidth = Math.max(...labels.map((l) => ctx.measureText(l).width));
    }
  }

  // YAxis width = tick labels + padding so they don't clip
  const yAxisWidth = Math.ceil(maxTickWidth) + TICK_PADDING + 4;

  // Base margin ensures left-most tick text isn't clipped by SVG edge;
  // add extra space for a rotated axis label when present
  const BASE_MARGIN = 4;
  const marginLeft = hasLabel ? Y_LABEL_FONT_SIZE + 20 + BASE_MARGIN : BASE_MARGIN;

  // Position the label to the left of the tick labels with breathing room
  const LABEL_GAP = 16;
  const labelDx = -(Math.ceil(maxTickWidth) / 2 + TICK_PADDING + LABEL_GAP);

  return { yAxisWidth, marginLeft, labelDx };
}

/** @deprecated Use getYAxisLayout instead */
export function getYAxisLabelDx(
  ticks: number[],
  formatter?: (value: number) => string,
): number {
  return getYAxisLayout(ticks, true, formatter).labelDx;
}

// --- SVG download ---

export interface ChartDownloadOptions {
  /** Title rendered above the chart in the exported SVG. */
  title?: string;
  /** Subtitle rendered below the title. */
  subtitle?: string;
  filename?: string;
}

/** Resolve CSS var() references to concrete values. */
function resolveVars(value: string, computed: CSSStyleDeclaration): string {
  return value.replace(/var\(--([^),]+)(?:,\s*([^)]+))?\)/g, (_, name, fallback) => {
    const resolved = computed.getPropertyValue(`--${name}`).trim();
    return resolved || fallback?.trim() || '#000';
  });
}

/** Escape special XML characters. */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Walk the live SVG + its clone in parallel, inlining computed styles
 * and resolving CSS variables so the SVG is fully self-contained.
 */
function inlineStyles(liveSvg: SVGSVGElement, clone: SVGSVGElement): void {
  const computed = getComputedStyle(document.documentElement);
  const liveEls = Array.from(liveSvg.querySelectorAll('*'));
  const cloneEls = Array.from(clone.querySelectorAll('*'));

  for (let i = 0; i < liveEls.length; i++) {
    const liveEl = liveEls[i];
    const cloneEl = cloneEls[i];

    // Resolve CSS var() in presentation attributes
    for (const attr of ['fill', 'stroke', 'color', 'stop-color']) {
      const val = cloneEl.getAttribute(attr);
      if (val?.includes('var(')) {
        cloneEl.setAttribute(attr, resolveVars(val, computed));
      }
    }
    const styleAttr = cloneEl.getAttribute('style');
    if (styleAttr?.includes('var(')) {
      cloneEl.setAttribute('style', resolveVars(styleAttr, computed));
    }

    // Inline font styles on text elements from the live DOM
    if (liveEl.tagName === 'text' || liveEl.tagName === 'tspan') {
      const s = getComputedStyle(liveEl);
      const inl = (cloneEl as SVGElement).style;
      inl.fontFamily = s.fontFamily;
      inl.fontSize = s.fontSize;
      inl.fontWeight = s.fontWeight;
      const fill = cloneEl.getAttribute('fill');
      if (!fill || fill.includes('var(')) {
        inl.fill = s.fill;
      }
    }
  }
}

/**
 * Convert an <img> element to a base64 data URL.
 * Returns null if the image can't be read.
 */
function imgToDataUrl(img: HTMLImageElement): string | null {
  try {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth || img.width;
    c.height = img.naturalHeight || img.height;
    const cx = c.getContext('2d');
    if (!cx) return null;
    cx.drawImage(img, 0, 0);
    return c.toDataURL('image/png');
  } catch (e) {
    console.warn('imgToDataUrl: failed to convert image', e);
    return null;
  }
}

/**
 * Export a chart or map container as a self-contained SVG file.
 *
 * Captures ALL `<svg>` elements (chart, color bars, etc.) and `<img>`
 * elements (watermark) from the container, inlines computed styles and
 * CSS variables, prepends a title/subtitle, and triggers a download.
 */
export function downloadChartAsSvg(
  container: HTMLElement,
  options: ChartDownloadOptions = {},
): void {
  const { title, subtitle, filename = 'chart.svg' } = options;

  // Collect content SVGs — skip tiny icon SVGs (e.g. lucide icons in buttons)
  const allSvgs = Array.from(container.querySelectorAll('svg'));
  const svgs = allSvgs.filter((s) => {
    const r = s.getBoundingClientRect();
    return r.width > 40 && r.height > 40;
  });
  if (svgs.length === 0) {
    console.warn('downloadChartAsSvg: no SVG elements found in container');
    return;
  }

  const computed = getComputedStyle(document.documentElement);
  const fontFamily = getComputedStyle(document.body).fontFamily || 'Inter, sans-serif';
  const containerRect = container.getBoundingClientRect();

  // Measure header
  const padding = 16;
  let headerH = padding;
  const headerEls: string[] = [];

  if (title) {
    headerH += 20;
    const color = resolveVars('var(--foreground)', computed);
    headerEls.push(
      `<text x="${padding}" y="${headerH}" font-family="${escapeXml(fontFamily)}" font-size="16" font-weight="600" fill="${color}">${escapeXml(title)}</text>`,
    );
    headerH += 4;
  }
  if (subtitle) {
    headerH += 16;
    const color = resolveVars('var(--muted-foreground)', computed);
    headerEls.push(
      `<text x="${padding}" y="${headerH}" font-family="${escapeXml(fontFamily)}" font-size="14" fill="${color}">${escapeXml(subtitle)}</text>`,
    );
    headerH += 4;
  }
  if (headerEls.length > 0) headerH += 8; // gap before chart
  else headerH = 0;

  // Clone each content SVG and position it at its actual DOM location
  const svgGroups: string[] = [];
  for (const svg of svgs) {
    const clone = svg.cloneNode(true) as SVGSVGElement;
    inlineStyles(svg, clone);

    const svgRect = svg.getBoundingClientRect();
    const x = svgRect.left - containerRect.left;
    const y = svgRect.top - containerRect.top + headerH;
    const w = svgRect.width;
    const h = svgRect.height;
    const viewBox = svg.getAttribute('viewBox') || `0 0 ${w} ${h}`;

    clone.removeAttribute('xmlns');
    const content = Array.from(clone.childNodes)
      .map((n) => new XMLSerializer().serializeToString(n))
      .join('\n');

    svgGroups.push(
      `<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${viewBox}">`,
      content,
      '</svg>',
    );
  }

  // Collect <img> elements (watermark, etc.) at their actual positions
  const imageEls: string[] = [];
  for (const img of Array.from(container.querySelectorAll('img'))) {
    const dataUrl = imgToDataUrl(img);
    if (!dataUrl) continue;
    const imgRect = img.getBoundingClientRect();
    const opacity = parseFloat(getComputedStyle(img).opacity) || 1;
    const x = imgRect.left - containerRect.left;
    const y = imgRect.top - containerRect.top + headerH;
    const w = imgRect.width;
    const h = imgRect.height;
    imageEls.push(
      `<image href="${dataUrl}" x="${x}" y="${y}" width="${w}" height="${h}" opacity="${opacity}"/>`,
    );
  }

  const totalW = containerRect.width;
  const totalH = headerH + containerRect.height;

  const svgStr = [
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">`,
    `<rect width="${totalW}" height="${totalH}" fill="#ffffff"/>`,
    ...headerEls,
    ...svgGroups,
    ...imageEls,
    '</svg>',
  ].join('\n');

  const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** @deprecated Use downloadChartAsSvg instead. */
export const downloadChartAsPng = downloadChartAsSvg;

// --- CSV download ---

/**
 * Download an array of objects as a CSV file.
 */
export function downloadCsv(
  data: Record<string, unknown>[],
  filename: string = 'chart-data.csv',
): void {
  if (data.length === 0) {
    console.warn('downloadCsv: no data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((h) => {
        const val = row[h];
        const str = val == null ? '' : String(val);
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str;
      })
      .join(','),
  );

  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
