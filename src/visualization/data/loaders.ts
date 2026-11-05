import type { CongressNumber, CongressionalDistrictMembers, GeoJSONFeatureCollection } from '../types';

type UKConstituencyHex = Record<string, { x: number; y: number; gss: string }>;

/**
 * Congressional district boundaries. The 119th file is Census's 2024 cartographic boundary
 * file; the 120th file and its sources are described in data-sources/congressional-districts.
 */
export async function loadCongressionalDistrictsGeo(
  congress: CongressNumber = 119,
): Promise<GeoJSONFeatureCollection> {
  const mod =
    congress === 120
      ? await import('./congressionalDistrictsGeo120.json')
      : await import('./congressionalDistrictsGeo.json');
  return mod.default as GeoJSONFeatureCollection;
}

/** Equal-area hex districts, from The Downballot's hexmap (CC BY 4.0): v3.1 for the 119th, v3.2 for the 120th. */
export async function loadCongressionalDistrictsHex(
  congress: CongressNumber = 119,
): Promise<GeoJSONFeatureCollection> {
  const mod =
    congress === 120
      ? await import('./congressionalDistrictsHex120.json')
      : await import('./congressionalDistrictsHex.json');
  return mod.default as GeoJSONFeatureCollection;
}

/**
 * Members-elect of the 120th Congress by district, with race calls as of the file's `as_of`
 * date (see data-sources/congressional-districts). Show "Not yet called" for districts whose
 * status says so.
 */
export async function loadCongressionalDistrictMembers120(): Promise<CongressionalDistrictMembers> {
  const mod = await import('./congressionalDistrictMembers120.json');
  return mod.default as CongressionalDistrictMembers;
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
