import type { GeoJSONFeatureCollection } from '../types';

// Base path for GeoJSON data files - will be different in built package vs source
const getDataPath = (filename: string): string => {
  // In production (built package), data is in dist/data/
  // During development, we'll use the JSON files directly
  if (typeof window !== 'undefined') {
    // Browser environment - fetch from published package location
    return `https://unpkg.com/@policyengine/ui-kit/dist/data/${filename}`;
  }
  // Node environment or bundler - will be resolved by bundler
  return `./json/${filename}`;
};

// Cache to avoid redundant fetches
const cache = new Map<string, Promise<any>>();

async function loadJSON<T>(filename: string): Promise<T> {
  if (cache.has(filename)) {
    return cache.get(filename) as Promise<T>;
  }

  const promise = (async () => {
    try {
      // Try dynamic import first (for development)
      const module = await import(`./json/${filename}`);
      return module.default;
    } catch {
      // Fall back to fetch (for production)
      const path = getDataPath(filename);
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`Failed to load ${filename}: ${response.statusText}`);
      }
      return response.json();
    }
  })();

  cache.set(filename, promise);
  return promise;
}

export async function loadCongressionalDistrictsGeo(): Promise<GeoJSONFeatureCollection> {
  return loadJSON<GeoJSONFeatureCollection>('congressionalDistrictsGeo.json');
}

export async function loadCongressionalDistrictsHex(): Promise<GeoJSONFeatureCollection> {
  return loadJSON<GeoJSONFeatureCollection>('congressionalDistrictsHex.json');
}

export async function loadUKConstituenciesGeo(): Promise<GeoJSONFeatureCollection> {
  return loadJSON<GeoJSONFeatureCollection>('ukConstituenciesGeo.json');
}

export async function loadUKConstituenciesHex(): Promise<Record<string, { x: number; y: number; gss: string }>> {
  return loadJSON<Record<string, { x: number; y: number; gss: string }>>('ukConstituenciesHex.json');
}

export async function loadStateSenateDistrictsGeo(): Promise<GeoJSONFeatureCollection> {
  return loadJSON<GeoJSONFeatureCollection>('stateSenateDistrictsGeo.json');
}

export async function loadStateHouseDistrictsGeo(): Promise<GeoJSONFeatureCollection> {
  return loadJSON<GeoJSONFeatureCollection>('stateHouseDistrictsGeo.json');
}
