import { describe, it, expect } from 'vitest';
import {
  absoluteChangeMessage,
  relativeChangeMessage,
  budgetChangeMessage,
  wordWrap,
} from '../../src/utils/chartMessages';

describe('absoluteChangeMessage', () => {
  it('generates increase message', () => {
    const msg = absoluteChangeMessage('reform', 'tax revenue', 100);
    expect(msg).toContain('increase');
    expect(msg).toContain('tax revenue');
  });

  it('generates decrease message', () => {
    const msg = absoluteChangeMessage('reform', 'spending', -50);
    expect(msg).toContain('decrease');
  });

  it('generates no-change message within tolerance', () => {
    const msg = absoluteChangeMessage('reform', 'revenue', 0.0001, 0.001);
    expect(msg).toContain('no effect');
  });

  it('uses custom formatter', () => {
    const msg = absoluteChangeMessage('reform', 'revenue', 1000, 0.001, (v) => `$${v}`);
    expect(msg).toContain('$1000');
  });
});

describe('relativeChangeMessage', () => {
  it('generates increase message with percent', () => {
    const msg = relativeChangeMessage('reform', 'poverty rate', 0.023);
    expect(msg).toContain('increase');
    expect(msg).toContain('poverty rate');
  });

  it('generates no-change message', () => {
    const msg = relativeChangeMessage('reform', 'inequality', 0);
    expect(msg).toContain('no effect');
  });
});

describe('budgetChangeMessage', () => {
  it('formats with currency abbreviation', () => {
    const msg = budgetChangeMessage('reform', 'revenue', 1_200_000_000, 'us');
    expect(msg).toContain('increase');
    expect(msg).toContain('$1.2bn');
  });
});

describe('wordWrap', () => {
  it('wraps long text', () => {
    const text = 'This is a very long sentence that should be wrapped at some point in the middle';
    const wrapped = wordWrap(text, 30);
    const lines = wrapped.split('\n');
    expect(lines.length).toBeGreaterThan(1);
    lines.forEach((line) => {
      expect(line.length).toBeLessThanOrEqual(35); // allow a bit of slack for word boundaries
    });
  });

  it('does not wrap short text', () => {
    const text = 'Short text';
    expect(wordWrap(text, 30)).toBe('Short text');
  });
});
