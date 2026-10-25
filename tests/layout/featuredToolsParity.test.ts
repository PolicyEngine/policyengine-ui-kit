// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { policyEngineFeaturedTools } from '../../src/layout/PolicyEngineFeaturedTools';

/**
 * policyengine.org's own header and homepage read their Tools list from this
 * file in PolicyEngine/policyengine-app-v2. ui-kit keeps a copy because
 * app-v2 is still on ui-kit 0.4, so it can't import the list from here yet.
 * Once app-v2 reads it from ui-kit and deletes its own file, delete this test.
 *
 * This reads app-v2's main branch over the network, so it also runs on a
 * weekly schedule (.github/workflows/featured-tools-parity.yml) to catch a
 * tool added on policyengine.org when nothing changes here.
 */
const APP_V2_FEATURED_TOOLS_URL =
  'https://raw.githubusercontent.com/PolicyEngine/policyengine-app-v2/main/app/src/data/featuredTools.json';

describe('featured tools parity with policyengine.org', () => {
  it('matches app-v2’s featuredTools.json exactly', async () => {
    const response = await fetch(APP_V2_FEATURED_TOOLS_URL, {
      signal: AbortSignal.timeout(15_000),
    });
    expect(response.ok, `GET ${APP_V2_FEATURED_TOOLS_URL}: ${response.status}`).toBe(
      true,
    );

    expect(
      policyEngineFeaturedTools,
      'src/layout/PolicyEngineFeaturedTools.ts differs from app-v2’s ' +
        'app/src/data/featuredTools.json; change them together so zone ' +
        'apps and policyengine.org show the same Tools menu',
    ).toStrictEqual(await response.json());
  }, 20_000);
});
