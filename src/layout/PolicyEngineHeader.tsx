'use client';

import { Header, type CountryConfig, type HeaderProps, type NavItemConfig } from './header';
import { DEFAULT_POLICYENGINE_APP_URL } from './PolicyEngineTools';
import {
  DEFAULT_POLICYENGINE_BASE_URL,
  getPolicyEngineCountrySwitchUrl,
  getPolicyEngineCountryUrl,
  getPolicyEngineNavItems,
  policyEngineCountries,
  type PolicyEngineCountryId,
} from './PolicyEngineSiteConfig';

export interface PolicyEngineHeaderProps
  extends Omit<
    HeaderProps,
    'navItems' | 'countries' | 'currentCountry' | 'logoHref' | 'onCountryChange'
  > {
  country?: PolicyEngineCountryId;
  baseUrl?: string;
  /** The main app's origin, which the Tools menu's first row links to. */
  appUrl?: string;
  navItems?: NavItemConfig[];
  countries?: CountryConfig[];
  logoHref?: string;
  onCountryChange?: (id: string) => void;
}

export function PolicyEngineHeader({
  country = 'us',
  baseUrl = DEFAULT_POLICYENGINE_BASE_URL,
  appUrl = DEFAULT_POLICYENGINE_APP_URL,
  navItems,
  countries = policyEngineCountries,
  logoHref,
  onCountryChange,
  ...props
}: PolicyEngineHeaderProps) {
  const handleCountryChange =
    onCountryChange ??
    ((countryId: string) => {
      if (typeof window !== 'undefined') {
        window.location.href = getPolicyEngineCountrySwitchUrl(countryId, {
          baseUrl,
          countries,
        });
      }
    });

  return (
    <Header
      navItems={navItems ?? getPolicyEngineNavItems(country, baseUrl, appUrl)}
      countries={countries}
      currentCountry={country}
      logoHref={logoHref ?? getPolicyEngineCountryUrl(country, baseUrl)}
      onCountryChange={handleCountryChange}
      {...props}
    />
  );
}
