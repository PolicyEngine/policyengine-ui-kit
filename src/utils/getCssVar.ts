/**
 * Read a CSS custom property value at runtime.
 * Useful for Recharts and other SVG-based libraries that
 * need resolved color strings (not CSS var() references).
 *
 * @example
 *   getCssVar('--pe-color-primary-500') // '#319795'
 */
export function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
