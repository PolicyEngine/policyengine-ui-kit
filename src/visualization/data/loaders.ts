import type { CongressNumber, CongressionalDistrictMembers, GeoJSONFeatureCollection } from '../types';

type UKConstituencyHex = Record<string, { x: number; y: number; gss: string }>;

const SUPPORTED_CONGRESSES: readonly number[] = [119, 120];

/**
 * The Congress whose map to load. JavaScript callers can pass a string such as "120", so read
 * the value as a number; anything else falls back to the 119th map with a warning, instead of
 * drawing the wrong boundaries silently.
 */
function mapCongress(congress: CongressNumber, loader: string): CongressNumber {
  const value = Number(congress);
  if (SUPPORTED_CONGRESSES.includes(value)) return value as CongressNumber;
  console.warn(`${loader}: no map for congress ${String(congress)}; loading the 119th Congress map`);
  return 119;
}

/**
 * Congressional district boundaries. The 119th file is Census's 2024 cartographic boundary
 * file; the 120th file and its sources are described in data-sources/congressional-districts.
 *
 * Both files key districts by `DISTRICT_ID` ("TX-35"), with `STATEFP`, `GEOID`, `GEOIDFQ`,
 * `CDSESSN` and `NAMELSAD`. The 120th file also has `CD120FP`, `CONGRESS`, `STUSPS` and
 * `STATE_NAME`, and doesn't have the 119th file's `CD119FP`, `ALAND`, `AWATER` or `LSAD`.
 */
export async function loadCongressionalDistrictsGeo(
  congress: CongressNumber = 119,
): Promise<GeoJSONFeatureCollection> {
  const mod =
    mapCongress(congress, 'loadCongressionalDistrictsGeo') === 120
      ? await import('./congressionalDistrictsGeo120.json')
      : await import('./congressionalDistrictsGeo.json');
  return mod.default as GeoJSONFeatureCollection;
}

/**
 * Equal-area hex districts, from The Downballot's hexmap (CC BY 4.0): v3.1 for the 119th,
 * v3.2 for the 120th. v3.2 moves the hexes of CA, FL, NC, OH, TN, TX and UT. Alabama and
 * Louisiana also redrew their districts for the 120th, but The Downballot didn't move their
 * hexes, so those hexes keep their 119th positions.
 */
export async function loadCongressionalDistrictsHex(
  congress: CongressNumber = 119,
): Promise<GeoJSONFeatureCollection> {
  const mod =
    mapCongress(congress, 'loadCongressionalDistrictsHex') === 120
      ? await import('./congressionalDistrictsHex120.json')
      : await import('./congressionalDistrictsHex.json');
  return mod.default as GeoJSONFeatureCollection;
}

/**
 * Members-elect by district, with race calls as of the file's `as_of` date (see
 * data-sources/congressional-districts). Only the 120th Congress has a file so far. Show
 * "Not yet called" for districts whose status says so.
 */
export async function loadCongressionalDistrictMembers(
  congress: 120 = 120,
): Promise<CongressionalDistrictMembers> {
  if (Number(congress) !== 120) {
    throw new Error(
      `loadCongressionalDistrictMembers: no members file for congress ${String(congress)}; only the 120th is available`,
    );
  }
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
