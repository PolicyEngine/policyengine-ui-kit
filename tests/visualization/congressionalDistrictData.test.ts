import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { geoAlbersUsa, geoArea, geoEquirectangular, geoPath, type GeoProjection } from 'd3-geo';
import { describe, expect, it } from 'vitest';
import geo119 from '../../src/visualization/data/congressionalDistrictsGeo.json';
import geo120 from '../../src/visualization/data/congressionalDistrictsGeo120.json';
import hex119 from '../../src/visualization/data/congressionalDistrictsHex.json';
import hex120 from '../../src/visualization/data/congressionalDistrictsHex120.json';
import members120 from '../../src/visualization/data/congressionalDistrictMembers120.json';
import type {
  CongressionalDistrictMembers,
  GeoJSONFeatureCollection,
} from '../../src/visualization/types';

const ids = (collection: unknown) =>
  (collection as GeoJSONFeatureCollection).features.map((f) => f.properties.DISTRICT_ID as string);

// The states whose hexes The Downballot moved in hexmap v3.2 (2026).
const HEX_MOVED = new Set(['CA', 'FL', 'NC', 'OH', 'TN', 'TX', 'UT']);

// d3-geo reads the GeoJSON as is; the casts only drop the JSON modules' literal types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asD3 = (collection: unknown) => collection as any;

// Each map with the projection USDistrictChoroplethMap draws it with.
const MAPS = [
  { name: 'geographic', projection: geoAlbersUsa, files: { 119: geo119, 120: geo120 } },
  { name: 'hex', projection: geoEquirectangular, files: { 119: hex119, 120: hex120 } },
] as const;

describe('US district map files', () => {
  it('wind every shape so d3-geo draws the district, not the rest of the globe', () => {
    for (const map of MAPS) {
      for (const [congress, collection] of Object.entries(map.files)) {
        // A ring wound the wrong way encloses everything but the district: more than half the sphere.
        const inverted = (collection as GeoJSONFeatureCollection).features
          .filter((f) => geoArea(asD3(f)) >= 2 * Math.PI)
          .map((f) => f.properties.DISTRICT_ID);
        expect(inverted, `${map.name} map, ${congress}th Congress`).toEqual([]);
      }
    }
  });

  it('draw the 120th maps over the same area as the 119th maps', () => {
    for (const map of MAPS) {
      const projection: GeoProjection = map.projection().fitExtent(
        [
          [20, 20],
          [780, 480],
        ],
        asD3(map.files[119]),
      );
      const path = geoPath(projection);
      const [[x0, y0], [x1, y1]] = path.bounds(asD3(map.files[119]));
      const [[a0, b0], [a1, b1]] = path.bounds(asD3(map.files[120]));
      for (const [got, want] of [
        [a0, x0],
        [b0, y0],
        [a1, x1],
        [b1, y1],
      ]) {
        expect(Math.abs(got - want), `${map.name} map bounds`).toBeLessThan(2);
      }
    }
  });
});

describe('120th Congress district data', () => {
  it('has the same district IDs as the 119th boundaries, one shape each', () => {
    expect(ids(geo120)).toHaveLength(437);
    expect(new Set(ids(geo120)).size).toBe(437);
    expect(new Set(ids(geo120))).toEqual(new Set(ids(geo119)));
  });

  it('marks every boundary as the 120th Congress with Census codes', () => {
    for (const f of (geo120 as GeoJSONFeatureCollection).features) {
      expect(f.properties.CONGRESS).toBe(120);
      expect(f.properties.CDSESSN).toBe('120');
      expect(f.properties.GEOIDFQ).toBe(`5002000US${f.properties.STATEFP}${f.properties.CD120FP}`);
    }
  });

  it('writes at-large districts and DC as -01, as the API does', () => {
    const byId = new Map((geo120 as GeoJSONFeatureCollection).features.map((f) => [f.properties.DISTRICT_ID, f]));
    expect(byId.get('AK-01')?.properties.CD120FP).toBe('00');
    expect(byId.get('DC-01')?.properties.CD120FP).toBe('98');
    expect(byId.has('PR-98')).toBe(true);
  });

  it('has a hex for every district and keeps the hexes of states The Downballot did not move', () => {
    expect(new Set(ids(hex120))).toEqual(new Set(ids(hex119)));
    const old = new Map((hex119 as GeoJSONFeatureCollection).features.map((f) => [f.properties.DISTRICT_ID, f]));
    for (const f of (hex120 as GeoJSONFeatureCollection).features) {
      const state = f.properties.STATEAB as string;
      if (!HEX_MOVED.has(state)) {
        expect(f.geometry).toEqual(old.get(f.properties.DISTRICT_ID)?.geometry);
      }
    }
  });

  it('has a member entry for every district, with a name and party once the race is called', () => {
    const members = members120 as CongressionalDistrictMembers;
    const mapIds = new Set(ids(geo120).filter((id) => id !== 'PR-98'));
    expect(new Set(Object.keys(members.districts))).toEqual(mapIds);
    const entries = Object.values(members.districts);
    for (const m of entries) {
      expect(m.label).toMatch(/congressional district$/);
      if (m.status === 'called') {
        expect(m.name).toBeTruthy();
        expect(['D', 'R', 'I', 'L', 'G']).toContain(m.party);
      } else {
        expect(m.status).toBe('not_yet_called');
        expect(m.name).toBeNull();
        expect(m.party).toBeNull();
      }
    }
    expect(entries.filter((m) => m.status === 'called')).toHaveLength(members.called);
    expect(members.called + members.not_yet_called).toBe(436);
    expect(members.source_url).toMatch(/oldid=\d+$/);
  });

  it('lists the same districts in the key table as on the map, excluding Puerto Rico', () => {
    const csv = readFileSync(
      resolve(__dirname, '../../data-sources/congressional-districts/cd120/district_keys_cd120.csv'),
      'utf8',
    );
    const [header, ...rows] = csv.trim().split(/\r?\n/);
    const column = header.split(',').indexOf('district_id');
    const tableIds = new Set(rows.map((r) => r.split(',')[column]));
    const mapIds = new Set(ids(geo120).filter((id) => id !== 'PR-98'));
    expect(tableIds.size).toBe(436);
    expect(tableIds).toEqual(mapIds);
  });
});
