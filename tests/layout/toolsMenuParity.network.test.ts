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
 */
const APP_V2 =
  'https://raw.githubusercontent.com/PolicyEngine/policyengine-app-v2/main';
const APPS_JSON_URL = `${APP_V2}/app/src/data/apps/apps.json`;
const TOOLS_MENU_URL = `${APP_V2}/app/src/utils/toolsMenu.ts`;
const CONSTANTS_URL = `${APP_V2}/app/src/constants.ts`;

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

  it('names and links the main app as app-v2 does', async () => {
    expect(
      POLICYENGINE_APP_LABEL,
      'POLICYENGINE_APP_LABEL differs from MAIN_APP_LABEL in app-v2',
    ).toBe(
      await readFromSource(TOOLS_MENU_URL, /MAIN_APP_LABEL\s*=\s*['"]([^'"]+)['"]/),
    );
    expect(
      DEFAULT_POLICYENGINE_APP_URL,
      'DEFAULT_POLICYENGINE_APP_URL differs from CALCULATOR_URL’s default in app-v2',
    ).toBe(
      await readFromSource(
        CONSTANTS_URL,
        /CALCULATOR_URL\s*=[^\n]*\|\|\s*['"]([^'"]+)['"]/,
      ),
    );
  }, 35_000);
});
