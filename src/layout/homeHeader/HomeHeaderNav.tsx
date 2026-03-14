import type { NavItemConfig } from './HomeHeader';
import { HomeHeaderNavItem } from './HomeHeaderNavItem';

interface HomeHeaderNavProps {
  navItems: NavItemConfig[];
  onNavigate?: (href: string) => void;
  linkComponent?: React.ElementType;
}

/**
 * Desktop navigation bar — hidden below lg breakpoint.
 */
export function HomeHeaderNav({
  navItems,
  onNavigate,
  linkComponent,
}: HomeHeaderNavProps) {
  return (
    <div className="hidden lg:flex items-center gap-6">
      {navItems.map((item) => (
        <HomeHeaderNavItem
          key={item.label}
          item={item}
          onNavigate={onNavigate}
          linkComponent={linkComponent}
        />
      ))}
    </div>
  );
}
