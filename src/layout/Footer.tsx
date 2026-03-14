import { forwardRef, type HTMLAttributes, type ComponentType, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Stack } from './Stack';
import { Container } from './Container';
import whiteWordmark from '../assets/logos/policyengine/white.svg';

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** Navigation links rendered in the left column */
  links?: { href: string; text: string }[];
  /** Social media icon links */
  socialLinks?: {
    icon: ComponentType<{ size?: number }>;
    href: string;
    label: string;
    onClick?: () => void;
  }[];
  /** Custom logo element — overrides logoSrc */
  logo?: ReactNode;
  /** Logo image URL — defaults to bundled white PolicyEngine wordmark */
  logoSrc?: string;
  /** Slot for a subscribe form or any content in the right column */
  subscribeSlot?: ReactNode;
  /** Copyright text override */
  copyrightText?: string;
  styles?: { root?: React.CSSProperties };
}

export const Footer = forwardRef<HTMLElement, FooterProps>(
  (
    {
      links,
      socialLinks,
      logo,
      logoSrc,
      subscribeSlot,
      copyrightText,
      className,
      styles,
      children,
      ...props
    },
    ref,
  ) => {
    const resolvedLogo = logo ?? (
      <img
        src={logoSrc ?? whiteWordmark}
        alt="PolicyEngine"
        className="h-[52px] w-auto"
      />
    );

    const resolvedCopyright =
      copyrightText ?? `\u00A9 ${new Date().getFullYear()} PolicyEngine`;

    return (
      <footer
        ref={ref}
        className={cn('w-full', className)}
        style={{
          padding: '48px 64px',
          background:
            'linear-gradient(to right, var(--color-teal-800, #234E52), var(--color-teal-600, #2C7A7B))',
          ...styles?.root,
        }}
        {...props}
      >
        <Container size="2xl">
          {resolvedLogo}
          <div className="grid grid-cols-1 md:grid-cols-2 mt-8 gap-12">
            <Stack gap="2xl" align="start">
              {links && links.length > 0 && (
                <Stack gap="xs">
                  {links.map(({ href, text }) => (
                    <a
                      key={href}
                      href={href}
                      className="text-white text-base no-underline font-sans"
                    >
                      {text}
                    </a>
                  ))}
                </Stack>
              )}

              <Stack gap="md">
                {socialLinks && socialLinks.length > 0 && (
                  <div className="flex flex-row items-center gap-3">
                    {socialLinks.map(({ icon: Icon, href, label, onClick }) => (
                      <a
                        key={href}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="text-white"
                        onClick={onClick}
                      >
                        <Icon size={24} />
                      </a>
                    ))}
                  </div>
                )}
                <p className="text-xs text-white m-0 font-sans">
                  {resolvedCopyright}
                </p>
              </Stack>
            </Stack>

            {subscribeSlot}
          </div>
          {children}
        </Container>
      </footer>
    );
  },
);
Footer.displayName = 'Footer';
