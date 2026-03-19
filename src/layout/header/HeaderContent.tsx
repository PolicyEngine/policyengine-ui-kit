import type { CountryConfig, NavItemConfig } from './Header';
import { HeaderCountrySelector } from './HeaderCountrySelector';
import { HeaderLogo } from './HeaderLogo';
import { HeaderMobileMenu } from './HeaderMobileMenu';
import { HeaderNav } from './HeaderNav';

interface HeaderContentProps {
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
export function HeaderContent({
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
}: HeaderContentProps) {
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
          <HeaderLogo
            logoSrc={logoSrc}
            logoHref={logoHref}
            linkComponent={linkComponent}
            onNavigate={onNavigate}
          />
          <HeaderNav
            navItems={navItems}
            onNavigate={onNavigate}
            linkComponent={linkComponent}
          />
        </div>

        {/* Right: Desktop actions (country selector) */}
        <div className="hidden lg:flex items-center">
          {countries && countries.length > 0 && (
            <HeaderCountrySelector
              countries={countries}
              currentCountry={currentCountry}
              onCountryChange={onCountryChange}
            />
          )}
        </div>

        {/* Mobile menu (burger + sheet) */}
        <HeaderMobileMenu
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
