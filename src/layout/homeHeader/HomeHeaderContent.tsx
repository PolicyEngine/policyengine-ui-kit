import type { CountryConfig, NavItemConfig } from './HomeHeader';
import { HomeHeaderCountrySelector } from './HomeHeaderCountrySelector';
import { HomeHeaderLogo } from './HomeHeaderLogo';
import { HomeHeaderMobileMenu } from './HomeHeaderMobileMenu';
import { HomeHeaderNav } from './HomeHeaderNav';

interface HomeHeaderContentProps {
  navItems: NavItemConfig[];
  opened: boolean;
  onOpen: () => void;
  onClose: () => void;
  onNavigate?: (href: string) => void;
  linkComponent?: React.ElementType;
  logoSrc?: string;
  logoHref?: string;
  countries?: CountryConfig[];
  currentCountry?: string;
  onCountryChange?: (id: string) => void;
  navbarOpened?: boolean;
  onToggleNavbar?: () => void;
}

/**
 * Flex layout arranging logo, desktop nav, and action buttons.
 */
export function HomeHeaderContent({
  navItems,
  opened,
  onOpen,
  onClose,
  onNavigate,
  linkComponent,
  logoSrc,
  logoHref,
  countries,
  currentCountry,
  onCountryChange,
}: HomeHeaderContentProps) {
  return (
    <div style={{ height: '100%', width: '100%', padding: 0, margin: 0 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
        }}
      >
        {/* Left: Logo + Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <HomeHeaderLogo
            logoSrc={logoSrc}
            logoHref={logoHref}
            linkComponent={linkComponent}
            onNavigate={onNavigate}
          />
          <HomeHeaderNav
            navItems={navItems}
            onNavigate={onNavigate}
            linkComponent={linkComponent}
          />
        </div>

        {/* Right: Desktop actions (country selector) */}
        <div className="hidden lg:flex items-center">
          {countries && countries.length > 0 && (
            <HomeHeaderCountrySelector
              countries={countries}
              currentCountry={currentCountry}
              onCountryChange={onCountryChange}
            />
          )}
        </div>

        {/* Mobile menu (burger + sheet) */}
        <HomeHeaderMobileMenu
          opened={opened}
          onOpen={onOpen}
          onClose={onClose}
          navItems={navItems}
          onNavigate={onNavigate}
          linkComponent={linkComponent}
          countries={countries}
          currentCountry={currentCountry}
          onCountryChange={onCountryChange}
        />
      </div>
    </div>
  );
}
