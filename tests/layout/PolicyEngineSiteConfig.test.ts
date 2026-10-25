import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import type { NavItemConfig } from '../../src/layout/header';
import { policyEngineFeaturedTools } from '../../src/layout/PolicyEngineFeaturedTools';
import {
  DEFAULT_POLICYENGINE_BASE_URL,
  getPolicyEngineAllToolsUrl,
  getPolicyEngineFeaturedTools,
  getPolicyEngineNavItems,
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

const countries = fc.oneof(
  fc.constantFrom('us', 'uk'),
  // Other countries, including keys every object inherits.
  fc.constantFrom('ca', 'ng', 'il', '', 'US', 'constructor', '__proto__', 'toString'),
  fc.string(),
);

// Origins as consumers pass them: scheme, host, optional port, any number of
// trailing slashes (which the site config strips).
const baseUrls = fc
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

describe('PolicyEngine Tools menu', () => {
  it('lists the US tools right after Research', () => {
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
    expect(toolsItem(navItems)).toEqual({
      label: 'Tools',
      href: 'https://policyengine.org/us/research?types=interactive',
      children: [
        {
          label: 'CliffWatch',
          href: 'https://policyengine.org/us/cliffwatch',
          external: true,
        },
        {
          label: 'OBBBA household explorer',
          href: 'https://policyengine.org/us/obbba-households',
          external: true,
        },
        {
          label: 'State legislative tracker',
          href: 'https://policyengine.org/us/bill-tracker',
          external: true,
        },
        {
          label: 'All interactive tools',
          href: 'https://policyengine.org/us/research?types=interactive',
          external: true,
        },
      ],
    });
  });

  it('lists UK CliffWatch at /uk/uk-cliff-watch for the UK', () => {
    const navItems = getPolicyEngineNavItems('uk');

    expect(navItems.map((item) => item.label)).toEqual([
      'Research',
      'Tools',
      'Model',
      'API',
      'About',
      'Donate',
    ]);
    expect(toolsItem(navItems)).toEqual({
      label: 'Tools',
      href: 'https://policyengine.org/uk/research?types=interactive',
      children: [
        {
          label: 'UK CliffWatch',
          href: 'https://policyengine.org/uk/uk-cliff-watch',
          external: true,
        },
        {
          label: 'All interactive tools',
          href: 'https://policyengine.org/uk/research?types=interactive',
          external: true,
        },
      ],
    });
  });

  it.each(['ca', 'ng', 'il', 'US', '', 'constructor', '__proto__'])(
    'has no Tools menu for country %j',
    (country) => {
      expect(toolsItem(getPolicyEngineNavItems(country))).toBeUndefined();
      expect(getPolicyEngineNavItems(country)).toEqual(
        navItemsWithoutTools(country, DEFAULT_POLICYENGINE_BASE_URL),
      );
      expect(getPolicyEngineFeaturedTools(country)).toEqual([]);
    },
  );

  it('builds tool links on a custom base URL', () => {
    expect(
      getPolicyEngineFeaturedTools('uk', 'https://staging.policyengine.org//'),
    ).toEqual([
      {
        slug: 'uk-cliff-watch',
        label: 'UK CliffWatch',
        description: policyEngineFeaturedTools.uk[0].description,
        href: 'https://staging.policyengine.org/uk/uk-cliff-watch',
      },
    ]);
    expect(
      getPolicyEngineAllToolsUrl('us', 'https://staging.policyengine.org/'),
    ).toBe('https://staging.policyengine.org/us/research?types=interactive');
  });

  it('defaults to the US on policyengine.org', () => {
    expect(getPolicyEngineFeaturedTools()).toEqual(
      getPolicyEngineFeaturedTools('us', DEFAULT_POLICYENGINE_BASE_URL),
    );
    expect(getPolicyEngineAllToolsUrl()).toBe(
      'https://policyengine.org/us/research?types=interactive',
    );
  });

  it('keeps every tool entry well formed', () => {
    for (const [country, tools] of Object.entries(policyEngineFeaturedTools)) {
      expect(tools.length, country).toBeGreaterThan(0);
      for (const tool of tools) {
        expect(tool.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
        expect(tool.label.trim()).not.toBe('');
        expect(tool.description.trim()).not.toBe('');
      }
      expect(new Set(tools.map((tool) => tool.slug)).size).toBe(tools.length);
      expect(new Set(tools.map((tool) => tool.label)).size).toBe(tools.length);
      expect(tools.some((tool) => tool.label === 'All interactive tools')).toBe(
        false,
      );
    }
  });
});

describe('PolicyEngine Tools menu properties', () => {
  it('appears only for a country with tools, and only right after Research', () => {
    fc.assert(
      fc.property(countries, baseUrls, (country, baseUrl) => {
        const navItems = getPolicyEngineNavItems(country, baseUrl);
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
      fc.property(countries, baseUrls, (country, baseUrl) => {
        expect(
          getPolicyEngineNavItems(country, baseUrl).filter(
            (item) => item.label !== 'Tools',
          ),
        ).toEqual(navItemsWithoutTools(country, baseUrl));
      }),
    );
  });

  it('links every row to a full-page-load URL under the country on the base URL', () => {
    fc.assert(
      fc.property(fc.constantFrom('us', 'uk'), baseUrls, (country, baseUrl) => {
        const origin = baseUrl.replace(/\/+$/, '');
        const tools = toolsItem(getPolicyEngineNavItems(country, baseUrl));
        const rows = tools?.children ?? [];
        const expectedTools = policyEngineFeaturedTools[country];

        expect(rows.map((row) => row.label)).toEqual([
          ...expectedTools.map((tool) => tool.label),
          'All interactive tools',
        ]);
        expect(new Set(rows.map((row) => row.href)).size).toBe(rows.length);
        for (const row of rows) {
          expect(row.external).toBe(true);
          expect(row.href.startsWith(`${origin}/${country}/`)).toBe(true);
          const url = new URL(row.href);
          expect(`${url.protocol}//${url.host}`).toBe(new URL(origin).origin);
        }
        rows.slice(0, -1).forEach((row, i) => {
          expect(new URL(row.href).pathname).toBe(
            `/${country}/${expectedTools[i].slug}`,
          );
          expect(new URL(row.href).search).toBe('');
        });
        const allTools = new URL(rows[rows.length - 1].href);
        expect(allTools.pathname).toBe(`/${country}/research`);
        expect(allTools.searchParams.get('types')).toBe('interactive');
        expect(tools?.href).toBe(rows[rows.length - 1].href);
      }),
    );
  });

  it('never sends the UK menu to /uk/cliffwatch', () => {
    fc.assert(
      fc.property(baseUrls, (baseUrl) => {
        const paths = (
          toolsItem(getPolicyEngineNavItems('uk', baseUrl))?.children ?? []
        ).map((row) => new URL(row.href).pathname);

        expect(paths).toContain('/uk/uk-cliff-watch');
        expect(paths.some((path) => /^\/uk\/cliffwatch(\/|$)/.test(path))).toBe(
          false,
        );
      }),
    );
  });

  it('returns fresh, equal results on every call', () => {
    fc.assert(
      fc.property(countries, baseUrls, (country, baseUrl) => {
        const first = getPolicyEngineFeaturedTools(country, baseUrl);
        const second = getPolicyEngineFeaturedTools(country, baseUrl);
        expect(second).toEqual(first);

        for (const tool of first) {
          tool.slug = 'mutated';
          tool.href = 'mutated';
        }
        expect(getPolicyEngineFeaturedTools(country, baseUrl)).toEqual(second);
        expect(getPolicyEngineNavItems(country, baseUrl)).toEqual(
          getPolicyEngineNavItems(country, baseUrl),
        );
      }),
    );
  });
});
