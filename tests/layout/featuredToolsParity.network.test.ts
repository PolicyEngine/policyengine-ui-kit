// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { policyEngineFeaturedTools } from '../../src/layout/PolicyEngineFeaturedTools';

/**
 * policyengine.org's own header and homepage read their Tools list from this
 * file in PolicyEngine/policyengine-app-v2. ui-kit keeps a copy because
 * app-v2 is still on ui-kit 0.4, so it can't import the list from here yet.
 * Once app-v2 reads it from ui-kit and deletes its own file, delete this test.
 *
 * This reads app-v2's main branch over the network, so `bun run test` skips
 * it. .github/workflows/featured-tools-parity.yml runs it when this copy
 * changes and weekly, to catch a change on policyengine.org while nothing
 * changes here.
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
    const text = await response.text();
    let appV2Tools: unknown;
    try {
      appV2Tools = JSON.parse(text);
    } catch (error) {
      throw new Error(
        `${APP_V2_FEATURED_TOOLS_URL} is not JSON (${String(error)}): ${text.slice(0, 200)}`,
      );
    }

    expect(
      policyEngineFeaturedTools,
      'src/layout/PolicyEngineFeaturedTools.ts differs from app-v2’s ' +
        'app/src/data/featuredTools.json; change them together so zone ' +
        'apps and policyengine.org show the same Tools menu',
    ).toStrictEqual(appV2Tools);
  }, 20_000);
});
