// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_POLICYENGINE_APP_URL,
  POLICYENGINE_APP_LABEL,
  policyEngineTools,
} from '../../src/layout/PolicyEngineTools';

/**
 * policyengine.org builds its Tools menu from app-v2's apps.json: the main
 * app, then every entry with a `toolsMenu` label, by country, sorted by
 * label (app/src/utils/toolsMenu.ts and website/src/lib/toolsMenu.ts).
 * ui-kit can't import apps.json, so src/layout/PolicyEngineTools.ts keeps a
 * copy, and this test applies the same rule to app-v2's main branch and
 * compares.
 *
 * It reads over the network, so `bun run test` skips it.
 * .github/workflows/tools-menu-parity.yml runs it when the copy changes and
 * weekly, to catch a change on policyengine.org while nothing changes here.
 *
 * What it can't see:
 * - It applies its own copy of the rule rather than running app-v2's code.
 *   If app-v2 changes the rule itself (another filter, a different sort),
 *   this test can pass while the menus differ. app-v2's own tests
 *   (website/src/__tests__/lib/toolsMenu.test.ts) pin its side of the rule.
 * - It reads CALCULATOR_URL's default in the code. A deployment that sets
 *   NEXT_PUBLIC_CALCULATOR_URL or VITE_CALCULATOR_URL links the main app
 *   somewhere else, and this test can't tell.
 */
const APP_V2 =
  'https://raw.githubusercontent.com/PolicyEngine/policyengine-app-v2/main';
const APPS_JSON_URL = `${APP_V2}/app/src/data/apps/apps.json`;
// The calculator's header and the website's header each name the main app
// and give its URL, so check both.
const APP_TOOLS_MENU_URL = `${APP_V2}/app/src/utils/toolsMenu.ts`;
const APP_CONSTANTS_URL = `${APP_V2}/app/src/constants.ts`;
const WEBSITE_TOOLS_MENU_URL = `${APP_V2}/website/src/lib/toolsMenu.ts`;
const MAIN_APP_LABEL_PATTERN = /MAIN_APP_LABEL\s*=\s*['"]([^'"]+)['"]/;
// `[^;]*?` spans the line break in the website's two-line declaration.
const CALCULATOR_URL_PATTERN = /CALCULATOR_URL\s*=[^;]*?\|\|\s*['"]([^'"]+)['"]/;

/** GET `url`, retrying once if the connection fails (not on an HTTP error). */
async function fetchText(url: string): Promise<string> {
  let response: Response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(8_000) });
  } catch {
    response = await fetch(url, { signal: AbortSignal.timeout(8_000) });
  }
  if (!response.ok) {
    throw new Error(`GET ${url}: ${response.status}`);
  }
  return response.text();
}

/** The first capture of `pattern` in app-v2's `url`, or a readable failure. */
async function readFromSource(url: string, pattern: RegExp): Promise<string> {
  const match = (await fetchText(url)).match(pattern);
  if (!match) {
    throw new Error(`${url} no longer matches ${pattern}; update this test`);
  }
  return match[1];
}

interface AppEntry {
  slug: string;
  countryId: string;
  toolsMenu?: { label: string } | null;
}

/** app-v2's rule (getToolsMenuEntries) applied to its apps.json. */
function toolsByCountry(apps: AppEntry[]) {
  const byCountry: Record<string, { slug: string; label: string }[]> = {};
  for (const app of apps) {
    if (!app.toolsMenu) continue;
    if (typeof app.toolsMenu.label !== 'string') {
      throw new Error(`apps.json ${app.countryId}/${app.slug}: toolsMenu has no label`);
    }
    (byCountry[app.countryId] ??= []).push({
      slug: app.slug,
      label: app.toolsMenu.label,
    });
  }
  for (const tools of Object.values(byCountry)) {
    tools.sort((a, b) => a.label.localeCompare(b.label, 'en'));
  }
  return byCountry;
}

describe('Tools menu parity with policyengine.org', () => {
  it('lists the same tools as app-v2’s apps.json, in the same order', async () => {
    const text = await fetchText(APPS_JSON_URL);
    let apps: unknown;
    try {
      apps = JSON.parse(text);
    } catch (error) {
      throw new Error(
        `${APPS_JSON_URL} is not JSON (${String(error)}): ${text.slice(0, 200)}`,
      );
    }
    expect(Array.isArray(apps), `${APPS_JSON_URL} is not an array`).toBe(true);

    expect(
      policyEngineTools,
      'src/layout/PolicyEngineTools.ts differs from the toolsMenu entries in ' +
        'app-v2’s app/src/data/apps/apps.json; update the copy so zone apps ' +
        'and policyengine.org show the same Tools menu',
    ).toStrictEqual(toolsByCountry(apps as AppEntry[]));
  }, 20_000);

  it.each([
    ['the calculator', APP_TOOLS_MENU_URL, APP_CONSTANTS_URL],
    ['the website', WEBSITE_TOOLS_MENU_URL, WEBSITE_TOOLS_MENU_URL],
  ])('names and links the main app as %s’s header does', async (_, labelUrl, appUrl) => {
    expect(
      POLICYENGINE_APP_LABEL,
      `POLICYENGINE_APP_LABEL differs from MAIN_APP_LABEL in ${labelUrl}`,
    ).toBe(await readFromSource(labelUrl, MAIN_APP_LABEL_PATTERN));
    expect(
      DEFAULT_POLICYENGINE_APP_URL,
      `DEFAULT_POLICYENGINE_APP_URL differs from CALCULATOR_URL’s default in ${appUrl}`,
    ).toBe(await readFromSource(appUrl, CALCULATOR_URL_PATTERN));
  }, 35_000);
});
