import type { GeoJSONFeatureCollection } from '../types';

type UKConstituencyHex = Record<string, { x: number; y: number; gss: string }>;

export async function loadCongressionalDistrictsGeo(): Promise<GeoJSONFeatureCollection> {
  const mod = await import('./congressionalDistrictsGeo');
  return mod.CONGRESSIONAL_DISTRICTS_GEO;
}

export async function loadCongressionalDistrictsHex(): Promise<GeoJSONFeatureCollection> {
  const mod = await import('./congressionalDistrictsHex');
  return mod.CONGRESSIONAL_DISTRICTS_HEX;
}

export async function loadUKConstituenciesGeo(): Promise<GeoJSONFeatureCollection> {
  const mod = await import('./ukConstituenciesGeo');
  return mod.UK_CONSTITUENCIES_GEO;
}

export async function loadUKConstituenciesHex(): Promise<UKConstituencyHex> {
  const mod = await import('./ukConstituenciesHex');
  return mod.UK_CONSTITUENCIES_HEX;
}

export async function loadStateSenateDistrictsGeo(): Promise<GeoJSONFeatureCollection> {
  const mod = await import('./stateSenateDistrictsGeo');
  return mod.STATE_SENATE_DISTRICTS_GEO;
}

export async function loadStateHouseDistrictsGeo(): Promise<GeoJSONFeatureCollection> {
  const mod = await import('./stateHouseDistrictsGeo');
  return mod.STATE_HOUSE_DISTRICTS_GEO;
}
