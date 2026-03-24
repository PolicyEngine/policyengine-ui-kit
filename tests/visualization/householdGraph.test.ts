import { describe, it, expect } from 'vitest';
import {
  generateGraph,
  generateImpactForPrompt,
} from '../../src/visualization/household-graph/HouseholdGraph';

describe('generateGraph', () => {
  it('generates 10000 nodes for US', () => {
    const nodes = generateGraph('us');
    expect(nodes).toHaveLength(10_000);
  });

  it('generates 10000 nodes for UK', () => {
    const nodes = generateGraph('uk');
    expect(nodes).toHaveLength(10_000);
  });

  it('all nodes have x/y in [0,1]', () => {
    const nodes = generateGraph('us');
    const outOfBounds = nodes.filter(
      (n) => n.x < 0 || n.x > 1 || n.y < 0 || n.y > 1,
    );
    expect(outOfBounds).toHaveLength(0);
  });
});

describe('generateImpactForPrompt', () => {
  it('distributes colors correctly', () => {
    const nodes = generateGraph('us');
    const impacted = generateImpactForPrompt(nodes, {
      positiveShare: 0.3,
      negativeShare: 0.2,
      neutralShare: 0.5,
    });

    const positive = impacted.filter((n) => n.color === '#319795');
    const negative = impacted.filter((n) => n.color === '#475569');
    const neutral = impacted.filter((n) => n.color === '#E2E8F0');

    expect(positive.length).toBeCloseTo(3000, -2); // within ~100
    expect(negative.length).toBeCloseTo(2000, -2);
    expect(neutral.length).toBeCloseTo(5000, -2);
  });
});
