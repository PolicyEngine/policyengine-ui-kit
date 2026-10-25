import { forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { HeaderContent } from './HeaderContent';

/** A row in a nav item's dropdown. */
export interface NavItemChildConfig {
  label: string;
  href: string;
  description?: string;
  /** Overrides the parent item's `external` for this row. */
  external?: boolean;
}

export interface NavItemConfig {
  label: string;
  href: string;
  /**
   * Render a plain `<a>` that the browser follows as a full page load in
   * the same tab, skipping `linkComponent` and `onNavigate`. Use it for a
   * page served by another zone, which a client-side router can't reach.
   * Dropdown rows inherit it unless they set their own.
   */
  external?: boolean;
  children?: NavItemChildConfig[];
}

export interface CountryConfig {
  id: string;
  label: string;
  flagEmoji?: string;
}

export interface HeaderProps {
  /** Navigation items — simple links or items with dropdown children */
  navItems: NavItemConfig[];
  /** Available countries for the country selector */
  countries?: CountryConfig[];
  /** Currently selected country id */
  currentCountry?: string;
  /** Callback when a country is selected */
  onCountryChange?: (id: string) => void;
  /**
   * Navigation callback — called when a nav link is clicked, except
   * `external` items, which the browser follows itself
   */
  onNavigate?: (href: string) => void;
  /**
   * Custom link component (e.g. React Router Link, Next.js Link), used for
   * every nav link except `external` items
   */
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
 * Header — gradient teal header bar for PolicyEngine.
 *
 * Features:
 * - Sticky positioning with shadow
 * - Gradient background (teal-800 to teal-600)
 * - Logo with configurable link
 * - Desktop navigation with Apple-style dropdown menus
 * - Mobile hamburger menu using Sheet component
 * - Country selector dropdown
 */
export const Header = forwardRef<HTMLDivElement, HeaderProps>(
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
        <HeaderContent
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
Header.displayName = 'Header';
