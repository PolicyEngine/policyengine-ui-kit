import type { NavItemConfig } from './Header';
import { HeaderNavItem } from './HeaderNavItem';

interface HeaderNavProps {
  navItems: NavItemConfig[];
  onNavigate?: (href: string) => void;
  linkComponent?: React.ElementType;
}

/**
 * Desktop navigation bar — hidden below lg breakpoint.
 */
export function HeaderNav({
  navItems,
  onNavigate,
  linkComponent,
}: HeaderNavProps) {
  return (
    <div className="hidden lg:flex items-center gap-6">
      {navItems.map((item) => (
        <HeaderNavItem
          key={item.label}
          item={item}
          onNavigate={onNavigate}
          linkComponent={linkComponent}
        />
      ))}
    </div>
  );
}
