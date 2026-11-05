export type MapVisualizationType = 'geographic' | 'hex';

/**
 * The Congress whose district boundaries a US district map draws. Draw the boundaries the
 * data was computed on: 119th-Congress results on the 119th map, 120th on the 120th.
 */
export type CongressNumber = 119 | 120;

/** One district's member-elect (or sitting member), keyed by DISTRICT_ID in {@link CongressionalDistrictMembers}. */
export interface CongressionalDistrictMember {
  /** "Texas's 35th congressional district" */
  label: string;
  /** "not_yet_called" until a winner is called; name and party are then null. */
  status: 'called' | 'not_yet_called';
  name: string | null;
  /** Party letter for labels such as "Jane Doe (D)". */
  party: string | null;
  /** The party's own name, e.g. "Democratic–Farmer–Labor" for Minnesota's Democrats. */
  party_name: string | null;
}

export interface CongressionalDistrictMembers {
  congress: CongressNumber;
  /** When the source was read (UTC). */
  as_of: string;
  source: string;
  source_url: string;
  called: number;
  not_yet_called: number;
  districts: Record<string, CongressionalDistrictMember>;
}

export interface ChoroplethDataPoint {
  geoId: string;
  label: string;
  value: number;
}

export interface HexMapDataPoint {
  id: string;
  label: string;
  value: number;
  x: number;
  y: number;
}

export interface ColorScaleConfig {
  colors: string[];
  symmetric?: boolean;
}

export interface ColorRange {
  min: number;
  max: number;
}

export interface ChoroplethMapConfig {
  width?: number;
  height?: number;
  colorScale?: ColorScaleConfig;
  projectionConfig?: Record<string, unknown>;
  defaultFill?: string;
  borderColor?: string;
  borderWidth?: number;
  showColorBar?: boolean;
  formatValue?: (value: number) => string;
}

export interface HexMapConfig {
  hexSize?: number;
  gap?: number;
  colorScale?: ColorScaleConfig;
  showLabels?: boolean;
  labelFontSize?: number;
}

export interface GeoJSONFeature {
  type: 'Feature';
  properties: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: number[][] | number[][][] | number[][][][];
  };
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
  [key: string]: unknown;
}
