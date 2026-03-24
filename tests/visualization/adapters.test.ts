import { describe, it, expect } from 'vitest';
import {
  transformConstituencyData,
  transformConstituencyAbsoluteChange,
  transformConstituencyRelativeChange,
  type ConstituencyImpactData,
  transformLocalAuthorityData,
  transformLocalAuthorityAbsoluteChange,
  transformLocalAuthorityRelativeChange,
  type LocalAuthorityImpactData,
} from '../../src/visualization/adapters';

const CONSTITUENCY_DATA: ConstituencyImpactData = {
  'Bethnal Green and Stepney': {
    average_household_income_change: 150,
    relative_household_income_change: 0.03,
    x: 5,
    y: 10,
  },
  'Cities of London and Westminster': {
    average_household_income_change: -200,
    relative_household_income_change: -0.02,
    x: 4,
    y: 9,
  },
};

const LOCAL_AUTHORITY_DATA: LocalAuthorityImpactData = {
  Camden: {
    average_household_income_change: 100,
    relative_household_income_change: 0.025,
    x: 3,
    y: 7,
  },
  Westminster: {
    average_household_income_change: -50,
    relative_household_income_change: -0.01,
    x: 4,
    y: 8,
  },
};

describe('transformConstituencyData', () => {
  it('transforms absolute change field', () => {
    const result = transformConstituencyData(CONSTITUENCY_DATA, 'average_household_income_change');
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('Bethnal Green and Stepney');
    expect(result[0].value).toBe(150);
    expect(result[0].x).toBe(5);
    expect(result[0].y).toBe(10);
  });

  it('transforms relative change field', () => {
    const result = transformConstituencyData(CONSTITUENCY_DATA, 'relative_household_income_change');
    expect(result[0].value).toBe(0.03);
    expect(result[1].value).toBe(-0.02);
  });

  it('returns empty array for empty input', () => {
    expect(transformConstituencyData({}, 'average_household_income_change')).toEqual([]);
  });

  it('uses constituency name as both id and label', () => {
    const result = transformConstituencyData(CONSTITUENCY_DATA, 'average_household_income_change');
    for (const dp of result) {
      expect(dp.id).toBe(dp.label);
    }
  });
});

describe('transformConstituencyAbsoluteChange', () => {
  it('uses average_household_income_change', () => {
    const result = transformConstituencyAbsoluteChange(CONSTITUENCY_DATA);
    expect(result[0].value).toBe(150);
    expect(result[1].value).toBe(-200);
  });
});

describe('transformConstituencyRelativeChange', () => {
  it('uses relative_household_income_change', () => {
    const result = transformConstituencyRelativeChange(CONSTITUENCY_DATA);
    expect(result[0].value).toBe(0.03);
    expect(result[1].value).toBe(-0.02);
  });
});

describe('transformLocalAuthorityData', () => {
  it('transforms local authority data', () => {
    const result = transformLocalAuthorityData(LOCAL_AUTHORITY_DATA, 'average_household_income_change');
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('Camden');
    expect(result[0].value).toBe(100);
  });

  it('returns empty array for empty input', () => {
    expect(transformLocalAuthorityData({}, 'average_household_income_change')).toEqual([]);
  });
});

describe('transformLocalAuthorityAbsoluteChange', () => {
  it('uses average_household_income_change', () => {
    const result = transformLocalAuthorityAbsoluteChange(LOCAL_AUTHORITY_DATA);
    expect(result[0].value).toBe(100);
    expect(result[1].value).toBe(-50);
  });
});

describe('transformLocalAuthorityRelativeChange', () => {
  it('uses relative_household_income_change', () => {
    const result = transformLocalAuthorityRelativeChange(LOCAL_AUTHORITY_DATA);
    expect(result[0].value).toBe(0.025);
    expect(result[1].value).toBe(-0.01);
  });
});
