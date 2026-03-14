import { forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { HomeHeaderContent } from './HomeHeaderContent';

export interface NavItemConfig {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
}

export interface CountryConfig {
  id: string;
  label: string;
  flagEmoji?: string;
}

export interface HomeHeaderProps {
  /** Navigation items — simple links or items with dropdown children */
  navItems: NavItemConfig[];
  /** Available countries for the country selector */
  countries?: CountryConfig[];
  /** Currently selected country id */
  currentCountry?: string;
  /** Callback when a country is selected */
  onCountryChange?: (id: string) => void;
  /** Navigation callback — called when any nav link is clicked */
  onNavigate?: (href: string) => void;
  /** Custom link component (e.g. React Router Link, Next.js Link) */
  linkComponent?: React.ElementType;
  /** Logo image source URL */
  logoSrc?: string;
  /** Logo link href */
  logoHref?: string;
  /** Whether an external sidebar/navbar is opened (for sidebar toggle button) */
  navbarOpened?: boolean;
  /** Callback to toggle an external sidebar/navbar */
  onToggleNavbar?: () => void;
  /** Additional CSS class names */
  className?: string;
  /** Style overrides */
  styles?: { root?: React.CSSProperties };
}

/**
 * HomeHeader — gradient teal header bar for the PolicyEngine home page.
 *
 * Features:
 * - Sticky positioning with shadow
 * - Gradient background (teal-800 to teal-600)
 * - Logo with configurable link
 * - Desktop navigation with Apple-style dropdown menus
 * - Mobile hamburger menu using Sheet component
 * - Country selector dropdown
 */
export const HomeHeader = forwardRef<HTMLDivElement, HomeHeaderProps>(
  (
    {
      navItems,
      countries,
      currentCountry,
      onCountryChange,
      onNavigate,
      linkComponent,
      logoSrc,
      logoHref,
      navbarOpened,
      onToggleNavbar,
      className,
      styles,
    },
    ref,
  ) => {
    const [mobileMenuOpened, setMobileMenuOpened] = useState(false);

    return (
      <div
        ref={ref}
        className={cn(className)}
        style={{
          position: 'sticky',
          top: 0,
          padding: '8px 32px',
          height: 'var(--spacing-header, 58px)',
          background:
            'linear-gradient(to right, var(--color-teal-800), var(--color-teal-600))',
          borderBottom: '0.5px solid var(--color-teal-700)',
          boxShadow:
            '0px 2px 4px -1px rgba(0, 0, 0, 0.06), 0px 4px 6px -1px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          fontFamily: 'var(--font-sans)',
          width: '100%',
          boxSizing: 'border-box',
          ...styles?.root,
        }}
      >
        <HomeHeaderContent
          navItems={navItems}
          opened={mobileMenuOpened}
          onOpen={() => setMobileMenuOpened(true)}
          onClose={() => setMobileMenuOpened(false)}
          onNavigate={onNavigate}
          linkComponent={linkComponent}
          logoSrc={logoSrc}
          logoHref={logoHref}
          countries={countries}
          currentCountry={currentCountry}
          onCountryChange={onCountryChange}
          navbarOpened={navbarOpened}
          onToggleNavbar={onToggleNavbar}
        />
      </div>
    );
  },
);
HomeHeader.displayName = 'HomeHeader';
