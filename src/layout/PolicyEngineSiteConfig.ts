import type { CountryConfig, NavItemConfig } from './header';
import type { FooterProps } from './Footer';

export type PolicyEngineCountryId = 'us' | 'uk' | (string & {});

export const DEFAULT_POLICYENGINE_BASE_URL = 'https://policyengine.org';

export const policyEngineCountries: CountryConfig[] = [
  { id: 'us', label: 'United States' },
  { id: 'uk', label: 'United Kingdom' },
];

function normalizeBaseUrl(baseUrl = DEFAULT_POLICYENGINE_BASE_URL) {
  return baseUrl.replace(/\/+$/, '');
}

export function getPolicyEngineCountryUrl(
  country: PolicyEngineCountryId = 'us',
  baseUrl = DEFAULT_POLICYENGINE_BASE_URL,
) {
  return `${normalizeBaseUrl(baseUrl)}/${country}`;
}

export function getPolicyEngineUrl(
  country: PolicyEngineCountryId = 'us',
  path = '',
  baseUrl = DEFAULT_POLICYENGINE_BASE_URL,
) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getPolicyEngineCountryUrl(country, baseUrl)}${normalizedPath}`;
}

export function getPolicyEngineNavItems(
  country: PolicyEngineCountryId = 'us',
  baseUrl = DEFAULT_POLICYENGINE_BASE_URL,
): NavItemConfig[] {
  return [
    {
      label: 'Research',
      href: getPolicyEngineUrl(country, 'research', baseUrl),
    },
    {
      label: 'Model',
      href: getPolicyEngineUrl(country, 'model', baseUrl),
    },
    {
      label: 'API',
      href: getPolicyEngineUrl(country, 'api', baseUrl),
    },
    {
      label: 'Python',
      href: getPolicyEngineUrl(country, 'python', baseUrl),
    },
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
    {
      label: 'Donate',
      href: getPolicyEngineUrl(country, 'donate', baseUrl),
    },
  ];
}

export function getPolicyEngineFooterLinks(
  country: PolicyEngineCountryId = 'us',
  baseUrl = DEFAULT_POLICYENGINE_BASE_URL,
): NonNullable<FooterProps['links']> {
  return [
    { text: 'About us', href: getPolicyEngineUrl(country, 'team', baseUrl) },
    { text: 'Donate', href: getPolicyEngineUrl(country, 'donate', baseUrl) },
    {
      text: 'Developer tools',
      href: getPolicyEngineUrl(country, 'dev-tools', baseUrl),
    },
    {
      text: 'Privacy policy',
      href: getPolicyEngineUrl(country, 'privacy', baseUrl),
    },
    {
      text: 'Terms and conditions',
      href: getPolicyEngineUrl(country, 'terms', baseUrl),
    },
  ];
}
