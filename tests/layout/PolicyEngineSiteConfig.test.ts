import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import type { NavItemConfig } from '../../src/layout/header';
import {
  DEFAULT_POLICYENGINE_APP_URL,
  POLICYENGINE_APP_LABEL,
  policyEngineTools,
} from '../../src/layout/PolicyEngineTools';
import {
  DEFAULT_POLICYENGINE_BASE_URL,
  getPolicyEngineAppUrl,
  getPolicyEngineNavItems,
  getPolicyEngineTools,
  getPolicyEngineUrl,
} from '../../src/layout/PolicyEngineSiteConfig';

/**
 * The nav as it was in 0.12.1, before the Tools menu. Adding Tools must leave
 * every other item, and its position relative to the others, unchanged.
 */
function navItemsWithoutTools(country: string, baseUrl: string): NavItemConfig[] {
  const navItems: NavItemConfig[] = [
    { label: 'Research', href: getPolicyEngineUrl(country, 'research', baseUrl) },
    { label: 'Model', href: getPolicyEngineUrl(country, 'model', baseUrl) },
    { label: 'API', href: getPolicyEngineUrl(country, 'api', baseUrl) },
    {
      label: 'About',
      href: getPolicyEngineUrl(country, 'team', baseUrl),
      children: [
        {
          label: 'Team',
          href: getPolicyEngineUrl(country, 'team', baseUrl),
          description: 'Meet the PolicyEngine team',
        },
        {
          label: 'Supporters',
          href: getPolicyEngineUrl(country, 'supporters', baseUrl),
          description: 'Organizations supporting PolicyEngine',
        },
        {
          label: 'Citations',
          href: getPolicyEngineUrl(country, 'citations', baseUrl),
          description: 'How to cite PolicyEngine',
        },
      ],
    },
    { label: 'Donate', href: getPolicyEngineUrl(country, 'donate', baseUrl) },
  ];
  if (country === 'us') {
    navItems.splice(3, 0, {
      label: 'Python',
      href: getPolicyEngineUrl(country, 'python', baseUrl),
    });
  }
  return navItems;
}

function toolsItem(navItems: NavItemConfig[]) {
  return navItems.find((item) => item.label === 'Tools');
}

/**
 * Invariants, for every country C, base URL B and app URL A:
 *   1. The nav has a Tools item exactly when C has tools (the US and the UK),
 *      once, right after Research.
 *   2. Every other item is as it was in 0.12.1.
 *   3. Tools lists the main app at `<A>/C` first, then exactly C's tools in
 *      label order, each at `<B>/C/<slug>`. Every row is a full page load.
 *   4. The OBBBA explorer and the bill tracker are research, not tools, and
 *      the UK menu never links to `/uk/cliffwatch`, the US app's path.
 *   5. Calls are deterministic and return fresh objects; the shared data is
 *      frozen.
 */
const countries = fc.oneof(
  fc.constantFrom('us', 'uk'),
  // Other countries, including keys every object inherits.
  fc.constantFrom('ca', 'ng', 'il', '', 'US', 'constructor', '__proto__', 'toString'),
  fc.string(),
);

// Origins as consumers pass them: scheme, host, optional port, any number of
// trailing slashes (which the site config strips).
const origins = fc
  .record({
    scheme: fc.constantFrom('http', 'https'),
    host: fc.domain(),
    port: fc.option(fc.integer({ min: 1, max: 65535 }), { nil: undefined }),
    slashes: fc.integer({ min: 0, max: 3 }),
  })
  .map(
    ({ scheme, host, port, slashes }) =>
      `${scheme}://${host}${port === undefined ? '' : `:${port}`}${'/'.repeat(slashes)}`,
  );

const US_TOOLS = [
  ['CliffWatch', 'cliffwatch'],
  ['Coverage Compass', 'coverage-compass'],
  ['GiveCalc', 'givecalc'],
  ['Marriage calculator', 'marriage'],
  ['QBI deduction calculator', 'qbi-calculator'],
  ['SPM threshold calculator', 'spm-calculator'],
  ['TANF calculator', 'tanf-calculator'],
];

const UK_TOOLS = [
  ['Marriage calculator', 'marriage'],
  ['Student loan calculator', 'uk-student-loan-calculator'],
  ['UK CliffWatch', 'uk-cliff-watch'],
];

function expectedToolsItem(country: string, tools: string[][]): NavItemConfig {
  const mainApp = `https://app.policyengine.org/${country}`;
  return {
    label: 'Tools',
    href: mainApp,
    external: true,
    children: [
      { label: 'PolicyEngine app', href: mainApp, external: true },
      ...tools.map(([label, slug]) => ({
        label,
        href: `https://policyengine.org/${country}/${slug}`,
        external: true,
      })),
    ],
  };
}

describe('PolicyEngine Tools menu', () => {
  it('lists the main app, then the US tools by label, right after Research', () => {
    const navItems = getPolicyEngineNavItems('us');

    expect(navItems.map((item) => item.label)).toEqual([
      'Research',
      'Tools',
      'Model',
      'API',
      'Python',
      'About',
      'Donate',
    ]);
    expect(toolsItem(navItems)).toEqual(expectedToolsItem('us', US_TOOLS));
  });

  it('lists the main app, then the UK tools by label, with UK CliffWatch at /uk/uk-cliff-watch', () => {
    const navItems = getPolicyEngineNavItems('uk');

    expect(navItems.map((item) => item.label)).toEqual([
      'Research',
      'Tools',
      'Model',
      'API',
      'About',
      'Donate',
    ]);
    expect(toolsItem(navItems)).toEqual(expectedToolsItem('uk', UK_TOOLS));
  });

  it.each(['ca', 'ng', 'il', 'US', '', 'constructor', '__proto__'])(
    'has no Tools menu for country %j',
    (country) => {
      expect(toolsItem(getPolicyEngineNavItems(country))).toBeUndefined();
      expect(getPolicyEngineNavItems(country)).toEqual(
        navItemsWithoutTools(country, DEFAULT_POLICYENGINE_BASE_URL),
      );
      expect(getPolicyEngineTools(country)).toEqual([]);
    },
  );

  it('builds links on a custom base URL and app URL', () => {
    expect(
      getPolicyEngineTools('uk', 'https://staging.policyengine.org//')[2],
    ).toEqual({
      slug: 'uk-cliff-watch',
      label: 'UK CliffWatch',
      href: 'https://staging.policyengine.org/uk/uk-cliff-watch',
    });
    expect(getPolicyEngineAppUrl('uk', 'https://app.staging.policyengine.org/')).toBe(
      'https://app.staging.policyengine.org/uk',
    );
    const tools = toolsItem(
      getPolicyEngineNavItems(
        'us',
        'https://staging.policyengine.org',
        'https://app.staging.policyengine.org',
      ),
    );
    expect(tools?.href).toBe('https://app.staging.policyengine.org/us');
    expect(tools?.children?.[0]).toEqual({
      label: 'PolicyEngine app',
      href: 'https://app.staging.policyengine.org/us',
      external: true,
    });
    expect(tools?.children?.[1].href).toBe(
      'https://staging.policyengine.org/us/cliffwatch',
    );
  });

  it('defaults to the US on policyengine.org and app.policyengine.org', () => {
    expect(getPolicyEngineTools()).toEqual(
      getPolicyEngineTools('us', DEFAULT_POLICYENGINE_BASE_URL),
    );
    expect(getPolicyEngineAppUrl()).toBe('https://app.policyengine.org/us');
    expect(DEFAULT_POLICYENGINE_APP_URL).toBe('https://app.policyengine.org');
    expect(POLICYENGINE_APP_LABEL).toBe('PolicyEngine app');
    expect(getPolicyEngineNavItems('uk')).toEqual(
      getPolicyEngineNavItems(
        'uk',
        DEFAULT_POLICYENGINE_BASE_URL,
        DEFAULT_POLICYENGINE_APP_URL,
      ),
    );
  });

  it('freezes the shared data so one header cannot change another', () => {
    expect(Object.isFrozen(policyEngineTools)).toBe(true);
    for (const tools of Object.values(policyEngineTools)) {
      expect(Object.isFrozen(tools)).toBe(true);
      for (const tool of tools ?? []) {
        expect(Object.isFrozen(tool)).toBe(true);
      }
    }
  });

  it('keeps every country’s tools well formed and sorted by label', () => {
    expect(Object.keys(policyEngineTools).sort()).toEqual(['uk', 'us']);
    for (const [country, tools = []] of Object.entries(policyEngineTools)) {
      expect(tools.length, country).toBeGreaterThan(0);
      for (const tool of tools) {
        expect(tool.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        expect(tool.label.trim()).not.toBe('');
        expect(tool.label).not.toBe(POLICYENGINE_APP_LABEL);
      }
      expect(new Set(tools.map((tool) => tool.slug)).size).toBe(tools.length);
      for (let i = 1; i < tools.length; i++) {
        expect(
          tools[i - 1].label.localeCompare(tools[i].label, 'en'),
          `${country}: ${tools[i - 1].label} before ${tools[i].label}`,
        ).toBeLessThan(0);
      }
    }
  });
});

describe('PolicyEngine Tools menu properties', () => {
  it('appears only for a country with tools, and only right after Research', () => {
    fc.assert(
      fc.property(countries, origins, origins, (country, baseUrl, appUrl) => {
        const navItems = getPolicyEngineNavItems(country, baseUrl, appUrl);
        const hasTools = country === 'us' || country === 'uk';

        expect(navItems.filter((item) => item.label === 'Tools')).toHaveLength(
          hasTools ? 1 : 0,
        );
        expect(navItems[0].label).toBe('Research');
        if (hasTools) {
          expect(navItems[1].label).toBe('Tools');
        }
      }),
    );
  });

  it('leaves every other nav item as it was before Tools', () => {
    fc.assert(
      fc.property(countries, origins, origins, (country, baseUrl, appUrl) => {
        expect(
          getPolicyEngineNavItems(country, baseUrl, appUrl).filter(
            (item) => item.label !== 'Tools',
          ),
        ).toEqual(navItemsWithoutTools(country, baseUrl));
      }),
    );
  });

  it('lists the main app, then exactly the country’s tools by label, each a full page load', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('us', 'uk'),
        origins,
        origins,
        (country, baseUrl, appUrl) => {
          const base = baseUrl.replace(/\/+$/, '');
          const app = appUrl.replace(/\/+$/, '');
          const tools = toolsItem(getPolicyEngineNavItems(country, baseUrl, appUrl));
          const [mainApp, ...rows] = tools?.children ?? [];
          const expectedTools = policyEngineTools[country]!;

          expect(tools?.external).toBe(true);
          expect(mainApp).toEqual({
            label: 'PolicyEngine app',
            href: `${app}/${country}`,
            external: true,
          });
          expect(tools?.href).toBe(mainApp.href);
          expect(rows.map((row) => row.label)).toEqual(
            expectedTools.map((tool) => tool.label),
          );
          rows.forEach((row, i) => {
            expect(row.external).toBe(true);
            expect(row.href).toBe(`${base}/${country}/${expectedTools[i].slug}`);
            const url = new URL(row.href);
            expect(url.origin).toBe(new URL(base).origin);
            expect(url.pathname).toBe(`/${country}/${expectedTools[i].slug}`);
            expect(url.search).toBe('');
            if (i > 0) {
              expect(rows[i - 1].label.localeCompare(row.label, 'en')).toBeLessThan(0);
            }
          });
          const labels = tools!.children!.map((row) => row.label);
          expect(new Set(labels).size).toBe(labels.length);
          expect(new Set(rows.map((row) => row.href)).size).toBe(rows.length);
        },
      ),
    );
  });

  it('leaves out research and never sends the UK menu to /uk/cliffwatch', () => {
    fc.assert(
      fc.property(countries, origins, (country, baseUrl) => {
        const paths = (
          toolsItem(getPolicyEngineNavItems(country, baseUrl))?.children ?? []
        )
          .slice(1)
          .map((row) => new URL(row.href).pathname);

        for (const research of ['obbba-households', 'bill-tracker']) {
          expect(paths).not.toContain(`/${country}/${research}`);
        }
        expect(paths.some((path) => /^\/uk\/cliffwatch(\/|$)/.test(path))).toBe(
          false,
        );
        if (country === 'uk') {
          expect(paths).toContain('/uk/uk-cliff-watch');
        }
      }),
    );
  });

  it('returns fresh, equal results on every call', () => {
    fc.assert(
      fc.property(countries, origins, origins, (country, baseUrl, appUrl) => {
        const first = getPolicyEngineTools(country, baseUrl);
        const second = getPolicyEngineTools(country, baseUrl);
        expect(second).toEqual(first);

        for (const tool of first) {
          tool.slug = 'mutated';
          tool.href = 'mutated';
        }
        expect(getPolicyEngineTools(country, baseUrl)).toEqual(second);

        const navItems = getPolicyEngineNavItems(country, baseUrl, appUrl);
        const expected = getPolicyEngineNavItems(country, baseUrl, appUrl);
        expect(navItems).toEqual(expected);
        for (const item of navItems) {
          item.href = 'mutated';
          for (const row of item.children ?? []) {
            row.href = 'mutated';
          }
        }
        expect(getPolicyEngineNavItems(country, baseUrl, appUrl)).toEqual(expected);
      }),
    );
  });
});
