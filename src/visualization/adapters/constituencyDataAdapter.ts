import type { HexMapDataPoint } from '../types';

export interface ConstituencyImpactData {
  [constituencyName: string]: {
    average_household_income_change: number;
    relative_household_income_change: number;
    x: number;
    y: number;
  };
}

export function transformConstituencyData(
  apiData: ConstituencyImpactData,
  valueField: 'average_household_income_change' | 'relative_household_income_change',
): HexMapDataPoint[] {
  return Object.entries(apiData).map(([constituencyName, data]) => ({
    id: constituencyName,
    label: constituencyName,
    value: data[valueField],
    x: data.x,
    y: data.y,
  }));
}

export function transformConstituencyAbsoluteChange(
  apiData: ConstituencyImpactData,
): HexMapDataPoint[] {
  return transformConstituencyData(apiData, 'average_household_income_change');
}

export function transformConstituencyRelativeChange(
  apiData: ConstituencyImpactData,
): HexMapDataPoint[] {
  return transformConstituencyData(apiData, 'relative_household_income_change');
}
