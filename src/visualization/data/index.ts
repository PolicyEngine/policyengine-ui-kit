// Async loaders for GeoJSON data (to avoid bundling 24MB of data)
export {
  loadCongressionalDistrictsGeo,
  loadCongressionalDistrictsHex,
  loadUKConstituenciesGeo,
  loadUKConstituenciesHex,
  loadStateSenateDistrictsGeo,
  loadStateHouseDistrictsGeo,
} from './loaders';

// Legacy sync exports are no longer available - use async loaders above
// These constants have been externalized to reduce bundle size from 27MB to <1MB
