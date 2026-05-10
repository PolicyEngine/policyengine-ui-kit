import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { NavItemConfig } from './Header';

interface HeaderNavItemProps {
  item: NavItemConfig;
  onNavigate?: (href: string) => void;
  linkComponent?: React.ElementType;
}

const navItemStyle: React.CSSProperties = {
  color: 'var(--text-inverse)',
  fontWeight: 500,
  fontSize: '15px',
  fontFamily: 'var(--font-sans)',
  textDecoration: 'none',
  padding: '6px 14px',
  borderRadius: '6px',
  transition: 'background-color 0.15s ease',
  letterSpacing: '0.01em',
};

const hoverHandlers = {
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
  },
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
  },
};

const dropdownItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  textAlign: 'left',
  padding: '11px 16px',
  borderRadius: '10px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: '14px',
  fontFamily: 'var(--font-sans)',
  fontWeight: 600,
  color: 'var(--color-teal-800)',
  transition:
    'background-color 0.12s ease, color 0.12s ease, opacity 0.3s ease',
  lineHeight: '1.3',
  letterSpacing: '-0.01em',
  textDecoration: 'none',
};

/**
 * Apple-style dropdown panel with smooth height reveal and content fade.
 */
function AppleDropdown({
  items,
  open,
  onClose,
  onNavigate,
  linkComponent,
}: {
  items: NonNullable<NavItemConfig['children']>;
  open: boolean;
  onClose: () => void;
  onNavigate?: (href: string) => void;
  linkComponent?: React.ElementType;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open && contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const timer = setTimeout(() => setContentHeight(0), 250);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!open && contentHeight === 0) {
    return null;
  }

  return (
    <>
      {/* Invisible click-away layer */}
      <div
        onClick={onClose}
        role="presentation"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          cursor: 'default',
        }}
      />
      {/* Dropdown panel */}
      <div
        style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: visible
            ? 'translateX(-50%) translateY(0)'
            : 'translateX(-50%) translateY(-8px)',
          marginTop: '10px',
          minWidth: '220px',
          overflow: 'hidden',
          maxHeight: visible ? `${contentHeight}px` : '0px',
          opacity: visible ? 1 : 0,
          transition:
            'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '14px',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.97), rgba(240,249,255,0.95))',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          boxShadow:
            '0 20px 60px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(255, 255, 255, 0.6)',
          zIndex: 1001,
        }}
      >
        <div ref={contentRef} style={{ padding: '8px' }}>
          {items.map((item, i) => {
            const style = {
              ...dropdownItemStyle,
              transitionDelay: visible ? `${i * 50}ms` : '0ms',
              opacity: visible ? 1 : 0,
            };
            const content = (
              <>
                <span>{item.label}</span>
                {item.description && (
                  <span
                    style={{
                      marginLeft: '8px',
                      fontSize: '12px',
                      opacity: 0.6,
                      fontWeight: 400,
                    }}
                  >
                    {item.description}
                  </span>
                )}
              </>
            );
            const handleClick = (e: React.MouseEvent<HTMLElement>) => {
              onClose();
              if (onNavigate) {
                e.preventDefault();
                onNavigate(item.href);
              }
            };

            if (linkComponent) {
              const LinkComp = linkComponent;
              return (
                <LinkComp
                  key={item.label}
                  href={item.href}
                  to={item.href}
                  onClick={handleClick}
                  style={style}
                  {...hoverHandlers}
                >
                  {content}
                </LinkComp>
              );
            }

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={handleClick}
                style={style}
                {...hoverHandlers}
              >
                {content}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}

/**
 * Navigation item with optional Apple-style dropdown.
 */
export function HeaderNavItem({
  item,
  onNavigate,
  linkComponent,
}: HeaderNavItemProps) {
  const { label, href, children } = item;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  // Close on Escape
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setDropdownOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [dropdownOpen]);

  if (children && children.length > 0) {
    return (
      <div ref={containerRef} style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          style={{
            ...navItemStyle,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
          {...hoverHandlers}
        >
          <span>{label}</span>
          <ChevronDown
            size={15}
            color="var(--text-inverse)"
            style={{
              opacity: 0.7,
              transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </button>
        <AppleDropdown
          items={children}
          open={dropdownOpen}
          onClose={() => setDropdownOpen(false)}
          onNavigate={onNavigate}
          linkComponent={linkComponent}
        />
      </div>
    );
  }

  // Simple link item
  if (linkComponent) {
    const LinkComp = linkComponent;
    return (
      <LinkComp
        href={href}
        to={href}
        style={navItemStyle}
        {...hoverHandlers}
      >
        {label}
      </LinkComp>
    );
  }

  return (
    <a
      href={href}
      style={navItemStyle}
      onClick={
        onNavigate && href
          ? (e: React.MouseEvent) => {
              e.preventDefault();
              onNavigate(href);
            }
          : undefined
      }
      {...hoverHandlers}
    >
      {label}
    </a>
  );
}
