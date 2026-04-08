import type { GeoJSONFeatureCollection } from '../types';

type UKConstituencyHex = Record<string, { x: number; y: number; gss: string }>;

export async function loadCongressionalDistrictsGeo(): Promise<GeoJSONFeatureCollection> {
  const mod = await import('./congressionalDistrictsGeo.json');
  return mod.default as GeoJSONFeatureCollection;
}

export async function loadCongressionalDistrictsHex(): Promise<GeoJSONFeatureCollection> {
  const mod = await import('./congressionalDistrictsHex.json');
  return mod.default as GeoJSONFeatureCollection;
}

export async function loadUKConstituenciesGeo(): Promise<GeoJSONFeatureCollection> {
  const mod = await import('./ukConstituenciesGeo.json');
  return mod.default as GeoJSONFeatureCollection;
}

export async function loadUKConstituenciesHex(): Promise<UKConstituencyHex> {
  const mod = await import('./ukConstituenciesHex.json');
  return mod.default as UKConstituencyHex;
}

export async function loadStateSenateDistrictsGeo(): Promise<GeoJSONFeatureCollection> {
  const mod = await import('./stateSenateDistrictsGeo.json');
  return mod.default as GeoJSONFeatureCollection;
}

export async function loadStateHouseDistrictsGeo(): Promise<GeoJSONFeatureCollection> {
  const mod = await import('./stateHouseDistrictsGeo.json');
  return mod.default as GeoJSONFeatureCollection;
}
