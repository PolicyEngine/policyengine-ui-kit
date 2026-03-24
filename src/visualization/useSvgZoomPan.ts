import { useCallback, useRef, useState } from 'react';

export interface SvgZoomPanState {
  zoom: number;
  pan: [number, number];
  handlers: {
    onWheel: (e: React.WheelEvent) => void;
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onReset: () => void;
  };
}

export function useSvgZoomPan(): SvgZoomPanState {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<[number, number]>([0, 0]);
  const isPanning = useRef(false);
  const panStart = useRef<[number, number]>([0, 0]);
  const panOrigin = useRef<[number, number]>([0, 0]);

  const onZoomIn = useCallback(() => setZoom((z) => Math.min(z * 1.5, 20)), []);
  const onZoomOut = useCallback(() => setZoom((z) => Math.max(z / 1.5, 0.5)), []);
  const onReset = useCallback(() => {
    setZoom(1);
    setPan([0, 0]);
  }, []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => {
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      return Math.min(Math.max(z * factor, 0.5), 20);
    });
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isPanning.current = true;
    panStart.current = [e.clientX, e.clientY];
    panOrigin.current = [...pan] as [number, number];
    (e.target as Element).setPointerCapture(e.pointerId);
  }, [pan]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current[0];
    const dy = e.clientY - panStart.current[1];
    setPan([panOrigin.current[0] + dx / zoom, panOrigin.current[1] + dy / zoom]);
  }, [zoom]);

  const onPointerUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  return {
    zoom,
    pan,
    handlers: { onWheel, onPointerDown, onPointerMove, onPointerUp, onZoomIn, onZoomOut, onReset },
  };
}
