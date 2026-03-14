import * as React from 'react';
import { ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../primitives/Tooltip';
import { cn } from '../utils/cn';

interface SidebarNavItemProps {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href: string;
  isActive?: boolean;
  external?: boolean;
  disabled?: boolean;
  linkComponent?: React.ElementType;
  className?: string;
}

const SidebarNavItem = React.forwardRef<HTMLDivElement, SidebarNavItemProps>(
  (
    {
      label,
      icon: Icon,
      href,
      isActive = false,
      external = false,
      disabled = false,
      linkComponent: LinkComponent,
      className,
    },
    ref,
  ) => {
    const content = (
      <div className="flex items-center gap-5 flex-nowrap">
        {Icon && (
          <Icon
            className={cn(
              'size-5 shrink-0',
              disabled
                ? 'text-gray-400'
                : isActive
                  ? 'text-gray-700'
                  : 'text-muted-foreground',
            )}
          />
        )}
        <span
          className={cn(
            'flex-1 text-sm',
            isActive ? 'font-medium' : 'font-normal',
            disabled
              ? 'text-gray-400'
              : isActive
                ? 'text-gray-900'
                : 'text-gray-700',
          )}
        >
          {label}
        </span>
        {external && (
          <ExternalLink
            className={cn(
              'size-3.5 shrink-0',
              disabled ? 'text-gray-400' : 'text-muted-foreground',
            )}
          />
        )}
      </div>
    );

    const sharedClassName = cn(
      'block w-full rounded-element no-underline',
      'px-3 py-2',
      isActive ? 'bg-gray-50' : 'bg-transparent',
      disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:bg-gray-50',
      className,
    );

    if (disabled) {
      return (
        <div ref={ref}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className={cn(sharedClassName, 'border-none text-left')}
                onClick={(e) => e.preventDefault()}
              >
                {content}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Under development</TooltipContent>
          </Tooltip>
        </div>
      );
    }

    if (external) {
      return (
        <div ref={ref}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={sharedClassName}
          >
            {content}
          </a>
        </div>
      );
    }

    // Use custom link component if provided (e.g., react-router Link, Next.js Link)
    if (LinkComponent) {
      return (
        <div ref={ref}>
          <LinkComponent to={href} href={href} className={sharedClassName}>
            {content}
          </LinkComponent>
        </div>
      );
    }

    // Default: plain <a> tag
    return (
      <div ref={ref}>
        <a href={href} className={sharedClassName}>
          {content}
        </a>
      </div>
    );
  },
);

SidebarNavItem.displayName = 'SidebarNavItem';

export { SidebarNavItem };
export type { SidebarNavItemProps };
