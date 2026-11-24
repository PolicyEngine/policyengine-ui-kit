import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  loadCongressionalDistrictMembers,
  loadCongressionalDistrictsGeo,
  loadCongressionalDistrictsHex,
} from '../../src/visualization/data/loaders';
import type { CongressNumber } from '../../src/visualization/types';

// What an untyped JavaScript caller might pass.
const untyped = (value: unknown) => value as CongressNumber;

describe('congressional district loaders', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('load the 119th maps by default and the 120th maps when asked', async () => {
    const geo119 = await loadCongressionalDistrictsGeo();
    const geo120 = await loadCongressionalDistrictsGeo(120);
    expect(geo119.features[0].properties.CD119FP).toBeDefined();
    expect(geo120.features[0].properties.CONGRESS).toBe(120);
    const hex119 = await loadCongressionalDistrictsHex();
    const hex120 = await loadCongressionalDistrictsHex(120);
    expect(hex120).not.toBe(hex119);
  });

  it('read a Congress passed as a string', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const geo = await loadCongressionalDistrictsGeo(untyped('120'));
    expect(geo.features[0].properties.CONGRESS).toBe(120);
    expect(warn).not.toHaveBeenCalled();
  });

  it('warn and load the 119th map for a Congress with no map', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const geo = await loadCongressionalDistrictsGeo(untyped(121));
    expect(geo.features[0].properties.CD119FP).toBeDefined();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('no map for congress 121'));
    await loadCongressionalDistrictsHex(untyped(121));
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it('load the 120th members file, and refuse a Congress with none', async () => {
    const members = await loadCongressionalDistrictMembers();
    expect(members.congress).toBe(120);
    expect((await loadCongressionalDistrictMembers(120)).congress).toBe(120);
    await expect(loadCongressionalDistrictMembers(untyped(119) as 120)).rejects.toThrow(
      'no members file for congress 119',
    );
  });
});
