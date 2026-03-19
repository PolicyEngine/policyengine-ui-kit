/**
 * Population-weighted geographic centers for particle distribution.
 * Each center has a normalized [0,1] x/y position and a weight proportional
 * to the population it represents.
 */

export interface PopulationCenter {
  name: string;
  x: number;
  y: number;
  weight: number;
}

/**
 * US population centers (major metro areas).
 * Positions are normalized to [0,1] based on lat/lon mapping.
 */
export const US_CENTERS: PopulationCenter[] = [
  { name: 'New York', x: 0.87, y: 0.32, weight: 20.1 },
  { name: 'Los Angeles', x: 0.12, y: 0.58, weight: 13.2 },
  { name: 'Chicago', x: 0.65, y: 0.30, weight: 9.5 },
  { name: 'Dallas', x: 0.50, y: 0.62, weight: 7.6 },
  { name: 'Houston', x: 0.48, y: 0.70, weight: 7.1 },
  { name: 'Washington DC', x: 0.82, y: 0.40, weight: 6.3 },
  { name: 'Philadelphia', x: 0.85, y: 0.35, weight: 6.2 },
  { name: 'Miami', x: 0.83, y: 0.75, weight: 6.1 },
  { name: 'Atlanta', x: 0.74, y: 0.56, weight: 6.0 },
  { name: 'Boston', x: 0.90, y: 0.27, weight: 4.9 },
  { name: 'Phoenix', x: 0.20, y: 0.58, weight: 4.8 },
  { name: 'San Francisco', x: 0.07, y: 0.42, weight: 4.7 },
  { name: 'Seattle', x: 0.10, y: 0.15, weight: 4.0 },
  { name: 'Minneapolis', x: 0.55, y: 0.20, weight: 3.6 },
  { name: 'San Diego', x: 0.13, y: 0.60, weight: 3.3 },
  { name: 'Denver', x: 0.32, y: 0.38, weight: 2.9 },
  { name: 'St. Louis', x: 0.60, y: 0.43, weight: 2.8 },
  { name: 'Tampa', x: 0.78, y: 0.72, weight: 3.2 },
  { name: 'Detroit', x: 0.72, y: 0.27, weight: 4.3 },
  { name: 'Portland', x: 0.08, y: 0.18, weight: 2.5 },
  { name: 'Charlotte', x: 0.78, y: 0.50, weight: 2.6 },
  { name: 'San Antonio', x: 0.42, y: 0.68, weight: 2.5 },
  { name: 'Pittsburgh', x: 0.78, y: 0.33, weight: 2.3 },
  { name: 'Sacramento', x: 0.08, y: 0.40, weight: 2.3 },
  { name: 'Las Vegas', x: 0.18, y: 0.50, weight: 2.2 },
  { name: 'Austin', x: 0.44, y: 0.66, weight: 2.2 },
  { name: 'Columbus', x: 0.72, y: 0.35, weight: 2.1 },
  { name: 'Indianapolis', x: 0.67, y: 0.37, weight: 2.0 },
  { name: 'Nashville', x: 0.68, y: 0.50, weight: 1.9 },
  { name: 'Kansas City', x: 0.52, y: 0.40, weight: 2.1 },
  { name: 'Cleveland', x: 0.73, y: 0.30, weight: 2.0 },
  { name: 'New Orleans', x: 0.58, y: 0.70, weight: 1.3 },
  { name: 'Salt Lake City', x: 0.24, y: 0.35, weight: 1.2 },
  { name: 'Raleigh', x: 0.80, y: 0.48, weight: 1.4 },
  { name: 'Milwaukee', x: 0.63, y: 0.26, weight: 1.6 },
];

/**
 * UK population centers (major urban areas).
 * Positions are normalized to [0,1].
 */
export const UK_CENTERS: PopulationCenter[] = [
  { name: 'London', x: 0.58, y: 0.82, weight: 9.0 },
  { name: 'Birmingham', x: 0.48, y: 0.60, weight: 2.9 },
  { name: 'Manchester', x: 0.45, y: 0.42, weight: 2.8 },
  { name: 'Leeds', x: 0.52, y: 0.40, weight: 1.9 },
  { name: 'Glasgow', x: 0.35, y: 0.12, weight: 1.7 },
  { name: 'Liverpool', x: 0.40, y: 0.43, weight: 1.5 },
  { name: 'Newcastle', x: 0.50, y: 0.28, weight: 1.1 },
  { name: 'Sheffield', x: 0.52, y: 0.44, weight: 1.4 },
  { name: 'Bristol', x: 0.38, y: 0.78, weight: 1.0 },
  { name: 'Edinburgh', x: 0.42, y: 0.10, weight: 1.3 },
  { name: 'Cardiff', x: 0.32, y: 0.78, weight: 0.8 },
  { name: 'Nottingham', x: 0.52, y: 0.54, weight: 0.8 },
  { name: 'Leicester', x: 0.52, y: 0.58, weight: 0.7 },
  { name: 'Southampton', x: 0.48, y: 0.88, weight: 0.7 },
  { name: 'Belfast', x: 0.15, y: 0.20, weight: 0.6 },
  { name: 'Aberdeen', x: 0.50, y: 0.05, weight: 0.5 },
];
