import { describe, it, expect } from 'vitest';
import {
  SLDU_QUALIFYING_STATES,
  SLDL_QUALIFYING_STATES,
  isStateQualified,
  STATE_FIPS_TO_ABBREV,
  STATE_ABBREV_TO_FIPS,
} from '../../src/visualization/utils';

describe('SLDU_QUALIFYING_STATES', () => {
  it('has 29 entries', () => {
    expect(SLDU_QUALIFYING_STATES).toHaveLength(29);
  });

  it('includes CA and TX', () => {
    expect(SLDU_QUALIFYING_STATES).toContain('CA');
    expect(SLDU_QUALIFYING_STATES).toContain('TX');
  });

  it('excludes NE (unicameral) and AK (small pop)', () => {
    expect(SLDU_QUALIFYING_STATES).not.toContain('NE');
    expect(SLDU_QUALIFYING_STATES).not.toContain('AK');
  });
});

describe('SLDL_QUALIFYING_STATES', () => {
  it('has 8 entries', () => {
    expect(SLDL_QUALIFYING_STATES).toHaveLength(8);
  });

  it('includes TX and CA', () => {
    expect(SLDL_QUALIFYING_STATES).toContain('TX');
    expect(SLDL_QUALIFYING_STATES).toContain('CA');
  });

  it('excludes WA (below 100k threshold)', () => {
    expect(SLDL_QUALIFYING_STATES).not.toContain('WA');
  });
});

describe('isStateQualified', () => {
  it('returns true for CA upper', () => {
    expect(isStateQualified('CA', 'upper')).toBe(true);
  });

  it('returns true for CA lower', () => {
    expect(isStateQualified('CA', 'lower')).toBe(true);
  });

  it('returns false for WA lower', () => {
    expect(isStateQualified('WA', 'lower')).toBe(false);
  });

  it('returns true for WA upper', () => {
    expect(isStateQualified('WA', 'upper')).toBe(true);
  });

  it('is case insensitive', () => {
    expect(isStateQualified('ca', 'upper')).toBe(true);
    expect(isStateQualified('tx', 'lower')).toBe(true);
  });

  it('returns false for non-qualifying states', () => {
    expect(isStateQualified('AK', 'upper')).toBe(false);
    expect(isStateQualified('AK', 'lower')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isStateQualified('', 'upper')).toBe(false);
    expect(isStateQualified('', 'lower')).toBe(false);
  });

  it('returns false for invalid state code', () => {
    expect(isStateQualified('ZZ', 'upper')).toBe(false);
    expect(isStateQualified('XX', 'lower')).toBe(false);
  });
});

describe('STATE_FIPS_TO_ABBREV', () => {
  it('reverses STATE_ABBREV_TO_FIPS', () => {
    expect(STATE_FIPS_TO_ABBREV['06']).toBe('CA');
    expect(STATE_FIPS_TO_ABBREV['48']).toBe('TX');
    expect(STATE_FIPS_TO_ABBREV['36']).toBe('NY');
  });

  it('has same number of entries as STATE_ABBREV_TO_FIPS', () => {
    expect(Object.keys(STATE_FIPS_TO_ABBREV).length).toBe(
      Object.keys(STATE_ABBREV_TO_FIPS).length,
    );
  });
});
