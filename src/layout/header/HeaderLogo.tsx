import { forwardRef } from 'react';
import whiteWordmark from '../../assets/logos/policyengine/white.svg';

export interface HeaderLogoProps {
  logoSrc?: string;
  logoHref?: string;
  linkComponent?: React.ElementType;
  onNavigate?: (href: string) => void;
}

export const HeaderLogo = forwardRef<HTMLDivElement, HeaderLogoProps>(
  ({ logoSrc, logoHref = '/', linkComponent, onNavigate }, ref) => {
    const imgEl = (
      <img
        src={logoSrc ?? whiteWordmark}
        alt="PolicyEngine"
        style={{ height: '24px', width: 'auto' }}
      />
    );

    const containerStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      marginRight: '16px',
      textDecoration: 'none',
    };

    if (linkComponent) {
      const LinkComp = linkComponent;
      return (
        <div ref={ref}>
          <LinkComp href={logoHref} to={logoHref} style={containerStyle}>
            {imgEl}
          </LinkComp>
        </div>
      );
    }

    return (
      <div ref={ref}>
        <a
          href={logoHref}
          style={containerStyle}
          onClick={
            onNavigate
              ? (e: React.MouseEvent) => {
                  e.preventDefault();
                  onNavigate(logoHref);
                }
              : undefined
          }
        >
          {imgEl}
        </a>
      </div>
    );
  },
);
HeaderLogo.displayName = 'HeaderLogo';
