import type { HexMapDataPoint } from '../types';

export interface LocalAuthorityImpactData {
  [localAuthorityName: string]: {
    average_household_income_change: number;
    relative_household_income_change: number;
    x: number;
    y: number;
  };
}

export function transformLocalAuthorityData(
  apiData: LocalAuthorityImpactData,
  valueField: 'average_household_income_change' | 'relative_household_income_change',
): HexMapDataPoint[] {
  return Object.entries(apiData).map(([localAuthorityName, data]) => ({
    id: localAuthorityName,
    label: localAuthorityName,
    value: data[valueField],
    x: data.x,
    y: data.y,
  }));
}

export function transformLocalAuthorityAbsoluteChange(
  apiData: LocalAuthorityImpactData,
): HexMapDataPoint[] {
  return transformLocalAuthorityData(apiData, 'average_household_income_change');
}

export function transformLocalAuthorityRelativeChange(
  apiData: LocalAuthorityImpactData,
): HexMapDataPoint[] {
  return transformLocalAuthorityData(apiData, 'relative_household_income_change');
}
