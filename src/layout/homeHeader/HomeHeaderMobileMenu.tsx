import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../../primitives/Sheet';
import type { CountryConfig, NavItemConfig } from './HomeHeader';
import { HomeHeaderCountrySelector } from './HomeHeaderCountrySelector';

interface HomeHeaderMobileMenuProps {
  opened: boolean;
  onOpen: () => void;
  onClose: () => void;
  navItems: NavItemConfig[];
  onNavigate?: (href: string) => void;
  linkComponent?: React.ElementType;
  countries?: CountryConfig[];
  currentCountry?: string;
  onCountryChange?: (id: string) => void;
}

/**
 * Mobile navigation: hamburger button + Sheet slide-in panel.
 * Visible below the lg breakpoint.
 */
export function HomeHeaderMobileMenu({
  opened,
  onOpen,
  onClose,
  navItems,
  onNavigate,
  linkComponent,
  countries,
  currentCountry,
  onCountryChange,
}: HomeHeaderMobileMenuProps) {
  const handleNavigate = (href: string) => {
    onClose();
    if (onNavigate) {
      onNavigate(href);
    } else {
      window.location.href = href;
    }
  };

  return (
    <>
      {/* Mobile burger + country selector */}
      <div className="flex lg:hidden items-center" style={{ gap: '16px' }}>
        {countries && countries.length > 0 && (
          <HomeHeaderCountrySelector
            countries={countries}
            currentCountry={currentCountry}
            onCountryChange={onCountryChange}
          />
        )}
        <button
          type="button"
          className="p-1 rounded bg-transparent border-none cursor-pointer"
          onClick={onOpen}
          aria-label="Toggle navigation"
        >
          <Menu size={24} color="var(--text-inverse)" />
        </button>
      </div>

      {/* Sheet slide-in */}
      <Sheet open={opened} onOpenChange={(open) => !open && onClose()}>
        <SheetContent
          side="right"
          className="w-[300px]"
          style={{ backgroundColor: 'var(--color-teal-600)' }}
        >
          <SheetHeader>
            <SheetTitle className="text-white">Menu</SheetTitle>
          </SheetHeader>
          <div
            className="flex flex-col"
            style={{ gap: '24px', padding: '24px' }}
          >
            {navItems.map((item) =>
              item.children && item.children.length > 0 ? (
                <div key={item.label}>
                  <span
                    style={{
                      color: 'var(--text-inverse)',
                      fontWeight: 500,
                      fontSize: '14px',
                      marginBottom: '8px',
                      display: 'block',
                      fontFamily: 'var(--font-sans)',
                    }}
                  >
                    {item.label}
                  </span>
                  <div
                    className="flex flex-col"
                    style={{ gap: '8px', paddingLeft: '16px' }}
                  >
                    {item.children.map((child) => {
                      if (linkComponent) {
                        const LinkComp = linkComponent;
                        return (
                          <LinkComp
                            key={child.label}
                            href={child.href}
                            to={child.href}
                            onClick={onClose}
                            style={{
                              color: 'var(--text-inverse)',
                              textDecoration: 'none',
                              fontWeight: 400,
                              fontSize: '14px',
                              fontFamily: 'var(--font-sans)',
                            }}
                          >
                            {child.label}
                          </LinkComp>
                        );
                      }
                      return (
                        <a
                          key={child.label}
                          href={child.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavigate(child.href);
                          }}
                          style={{
                            color: 'var(--text-inverse)',
                            textDecoration: 'none',
                            fontWeight: 400,
                            fontSize: '14px',
                            fontFamily: 'var(--font-sans)',
                          }}
                        >
                          {child.label}
                        </a>
                      );
                    })}
                  </div>
                </div>
              ) : (
                (() => {
                  if (linkComponent) {
                    const LinkComp = linkComponent;
                    return (
                      <LinkComp
                        key={item.label}
                        href={item.href}
                        to={item.href}
                        onClick={onClose}
                        style={{
                          color: 'var(--text-inverse)',
                          textDecoration: 'none',
                          fontWeight: 500,
                          fontSize: '14px',
                          fontFamily: 'var(--font-sans)',
                          display: 'block',
                        }}
                      >
                        {item.label}
                      </LinkComp>
                    );
                  }
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={
                        onNavigate
                          ? (e: React.MouseEvent) => {
                              e.preventDefault();
                              handleNavigate(item.href);
                            }
                          : undefined
                      }
                      style={{
                        color: 'var(--text-inverse)',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: '14px',
                        fontFamily: 'var(--font-sans)',
                        display: 'block',
                      }}
                    >
                      {item.label}
                    </a>
                  );
                })()
              ),
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
