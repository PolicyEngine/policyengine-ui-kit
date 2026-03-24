import { useCallback, useRef } from 'react';

/**
 * Merge an internal container ref with an optional external export ref.
 * Returns a stable callback ref and the internal RefObject.
 */
export function useMergedRef<T extends HTMLElement>(
  exportRef?: React.Ref<T>,
): { containerRef: React.RefObject<T | null>; mergedRef: (node: T | null) => void } {
  const containerRef = useRef<T | null>(null);

  const mergedRef = useCallback(
    (node: T | null) => {
      (containerRef as React.MutableRefObject<T | null>).current = node;
      if (typeof exportRef === 'function') {
        exportRef(node);
      } else if (exportRef) {
        (exportRef as React.MutableRefObject<T | null>).current = node;
      }
    },
    [exportRef],
  );

  return { containerRef, mergedRef };
}
