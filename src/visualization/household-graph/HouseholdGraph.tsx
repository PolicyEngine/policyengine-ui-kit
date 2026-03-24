/**
 * Animated particle-based household visualization.
 *
 * Renders 10,000 particles on a canvas, distributed across population centers
 * for a given country. Each particle is colored by policy impact (positive,
 * negative, or neutral) to visualize winners and losers at a glance.
 */

import { useRef, useEffect, useCallback, useMemo } from 'react';
import type { CountryId } from '../../types/country';
import { US_CENTERS, UK_CENTERS, type PopulationCenter } from './populationCenters';
import { cn } from '../../utils/cn';

// --- Raw hex colors for canvas (CSS vars don't work in canvas) ---
const COLORS = {
  positive: '#319795',   // teal-500
  negative: '#475569',   // gray-600
  neutral: '#E2E8F0',    // gray-200
  background: '#FFFFFF',
};

const PARTICLE_COUNT = 10_000;

export interface GraphNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

/**
 * Generate a graph of particles distributed around population centers.
 */
export function generateGraph(countryId: CountryId): GraphNode[] {
  const centers = countryId === 'uk' ? UK_CENTERS : US_CENTERS;
  const totalWeight = centers.reduce((s, c) => s + c.weight, 0);

  const nodes: GraphNode[] = [];
  let assigned = 0;

  for (let i = 0; i < centers.length; i++) {
    const center = centers[i];
    const count =
      i === centers.length - 1
        ? PARTICLE_COUNT - assigned
        : Math.round((center.weight / totalWeight) * PARTICLE_COUNT);

    for (let j = 0; j < count; j++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 0.08; // spread around center
      nodes.push({
        x: Math.max(0, Math.min(1, center.x + Math.cos(angle) * radius)),
        y: Math.max(0, Math.min(1, center.y + Math.sin(angle) * radius)),
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
        color: COLORS.neutral,
      });
    }
    assigned += count;
  }

  return nodes;
}

export interface ImpactDistribution {
  positiveShare: number;
  negativeShare: number;
  neutralShare: number;
}

/**
 * Apply impact colors to a graph based on winners/losers distribution.
 */
export function generateImpactForPrompt(
  nodes: GraphNode[],
  distribution: ImpactDistribution,
): GraphNode[] {
  const total = nodes.length;
  const posCount = Math.round(distribution.positiveShare * total);
  const negCount = Math.round(distribution.negativeShare * total);

  // Shuffle indices for random assignment
  const indices = Array.from({ length: total }, (_, i) => i);
  for (let i = total - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return nodes.map((node, idx) => {
    const shuffledIdx = indices[idx];
    let color: string;
    if (shuffledIdx < posCount) {
      color = COLORS.positive;
    } else if (shuffledIdx < posCount + negCount) {
      color = COLORS.negative;
    } else {
      color = COLORS.neutral;
    }
    return { ...node, color };
  });
}

// --- Canvas component ---

export interface HouseholdGraphProps {
  countryId?: CountryId;
  distribution?: ImpactDistribution;
  width?: number;
  height?: number;
  particleSize?: number;
  animate?: boolean;
  className?: string;
  styles?: { root?: React.CSSProperties };
}

export function HouseholdGraph({
  countryId = 'us',
  distribution,
  width = 800,
  height = 500,
  particleSize = 1.5,
  animate = true,
  className,
  styles,
}: HouseholdGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<GraphNode[]>([]);
  const animationRef = useRef<number>(0);

  // Compute nodes (pure — no side effects)
  const computedNodes = useMemo(() => {
    let nodes = generateGraph(countryId);
    if (distribution) {
      nodes = generateImpactForPrompt(nodes, distribution);
    }
    return nodes;
  }, [countryId, distribution]);
  nodesRef.current = computedNodes;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = width * dpr;
    const h = height * dpr;

    ctx.clearRect(0, 0, w, h);

    const nodes = nodesRef.current;
    for (const node of nodes) {
      if (animate) {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > 1) node.vx *= -1;
        if (node.y < 0 || node.y > 1) node.vy *= -1;
        node.x = Math.max(0, Math.min(1, node.x));
        node.y = Math.max(0, Math.min(1, node.y));
      }

      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(
        node.x * w,
        node.y * h,
        particleSize * dpr,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }, [width, height, particleSize, animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    if (animate) {
      const tick = () => {
        draw();
        animationRef.current = requestAnimationFrame(tick);
      };
      tick();
      return () => cancelAnimationFrame(animationRef.current);
    } else {
      draw();
    }
  }, [draw, animate, width, height]);

  return (
    <div className={cn('relative', className)} style={styles?.root}>
      <canvas
        ref={canvasRef}
        style={{ width, height, display: 'block' }}
      />
    </div>
  );
}
