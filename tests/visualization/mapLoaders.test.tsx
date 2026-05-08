import { render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { USDistrictChoroplethMap } from '../../src/visualization/USDistrictChoroplethMap';
import { UKConstituencyChoroplethMap } from '../../src/visualization/UKConstituencyChoroplethMap';
import { StateLegislativeDistrictMap } from '../../src/visualization/StateLegislativeDistrictMap';
import {
  loadCongressionalDistrictsGeo,
  loadCongressionalDistrictsHex,
  loadUKConstituenciesGeo,
  loadUKConstituenciesHex,
  loadStateSenateDistrictsGeo,
  loadStateHouseDistrictsGeo,
} from '../../src/visualization/data/loaders';
import type { GeoJSONFeatureCollection } from '../../src/visualization/types';

vi.mock('../../src/visualization/data/loaders', () => ({
  loadCongressionalDistrictsGeo: vi.fn(),
  loadCongressionalDistrictsHex: vi.fn(),
  loadUKConstituenciesGeo: vi.fn(),
  loadUKConstituenciesHex: vi.fn(),
  loadStateSenateDistrictsGeo: vi.fn(),
  loadStateHouseDistrictsGeo: vi.fn(),
}));

const emptyGeoJSON: GeoJSONFeatureCollection = {
  type: 'FeatureCollection',
  features: [],
};

const ukHexData = {
  'Test constituency': { x: 0, y: 0, gss: 'E00000001' },
};

const data = [{ geoId: 'CA-01', value: 1, label: 'District 1' }];

const mockedLoaders = [
  loadCongressionalDistrictsGeo,
  loadCongressionalDistrictsHex,
  loadUKConstituenciesGeo,
  loadUKConstituenciesHex,
  loadStateSenateDistrictsGeo,
  loadStateHouseDistrictsGeo,
];

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(loadCongressionalDistrictsGeo).mockResolvedValue(emptyGeoJSON);
  vi.mocked(loadCongressionalDistrictsHex).mockResolvedValue(emptyGeoJSON);
  vi.mocked(loadUKConstituenciesGeo).mockResolvedValue(emptyGeoJSON);
  vi.mocked(loadUKConstituenciesHex).mockResolvedValue(ukHexData);
  vi.mocked(loadStateSenateDistrictsGeo).mockResolvedValue(emptyGeoJSON);
  vi.mocked(loadStateHouseDistrictsGeo).mockResolvedValue(emptyGeoJSON);
});

describe('map data loader selection', () => {
  it('loads only US geographic district data for geographic view', async () => {
    render(<USDistrictChoroplethMap data={data} visualizationType="geographic" />);

    await waitFor(() => expect(loadCongressionalDistrictsGeo).toHaveBeenCalledTimes(1));

    expect(loadCongressionalDistrictsHex).not.toHaveBeenCalled();
  });

  it('loads only US hex district data for hex view', async () => {
    render(<USDistrictChoroplethMap data={data} visualizationType="hex" />);

    await waitFor(() => expect(loadCongressionalDistrictsHex).toHaveBeenCalledTimes(1));

    expect(loadCongressionalDistrictsGeo).not.toHaveBeenCalled();
  });

  it('loads only UK geographic constituency data for geographic view', async () => {
    render(<UKConstituencyChoroplethMap data={data} visualizationType="geographic" />);

    await waitFor(() => expect(loadUKConstituenciesGeo).toHaveBeenCalledTimes(1));

    expect(loadUKConstituenciesHex).not.toHaveBeenCalled();
  });

  it('loads only UK hex constituency data for hex view', async () => {
    render(<UKConstituencyChoroplethMap data={data} visualizationType="hex" />);

    await waitFor(() => expect(loadUKConstituenciesHex).toHaveBeenCalledTimes(1));

    expect(loadUKConstituenciesGeo).not.toHaveBeenCalled();
  });

  it('loads only state senate district data for upper chamber maps', async () => {
    render(<StateLegislativeDistrictMap data={data} state="CA" chamber="upper" />);

    await waitFor(() => expect(loadStateSenateDistrictsGeo).toHaveBeenCalledTimes(1));

    expect(loadStateHouseDistrictsGeo).not.toHaveBeenCalled();
  });

  it('loads only state house district data for lower chamber maps', async () => {
    render(<StateLegislativeDistrictMap data={data} state="CA" chamber="lower" />);

    await waitFor(() => expect(loadStateHouseDistrictsGeo).toHaveBeenCalledTimes(1));

    expect(loadStateSenateDistrictsGeo).not.toHaveBeenCalled();
  });

  it('does not load map data before the component has data to render', async () => {
    render(<USDistrictChoroplethMap data={[]} visualizationType="geographic" />);

    await waitFor(() => {
      for (const loader of mockedLoaders) {
        expect(loader).not.toHaveBeenCalled();
      }
    });
  });
});
