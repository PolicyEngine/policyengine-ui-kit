'use client';

import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { PolicyEngineFooter, type PolicyEngineFooterProps } from './PolicyEngineFooter';
import { PolicyEngineHeader, type PolicyEngineHeaderProps } from './PolicyEngineHeader';
import { DEFAULT_POLICYENGINE_BASE_URL, type PolicyEngineCountryId } from './PolicyEngineSiteConfig';

export interface PolicyEngineShellProps {
  children: ReactNode;
  country?: PolicyEngineCountryId;
  baseUrl?: string;
  showFooter?: boolean;
  headerProps?: Omit<PolicyEngineHeaderProps, 'country' | 'baseUrl'>;
  footerProps?: Omit<PolicyEngineFooterProps, 'country' | 'baseUrl'>;
  className?: string;
  mainClassName?: string;
}

export function PolicyEngineShell({
  children,
  country = 'us',
  baseUrl = DEFAULT_POLICYENGINE_BASE_URL,
  showFooter = true,
  headerProps,
  footerProps,
  className,
  mainClassName,
}: PolicyEngineShellProps) {
  return (
    <div className={cn('min-h-screen flex flex-col', className)}>
      <PolicyEngineHeader country={country} baseUrl={baseUrl} {...headerProps} />
      <main className={cn('flex-1', mainClassName)}>{children}</main>
      {showFooter && (
        <PolicyEngineFooter country={country} baseUrl={baseUrl} {...footerProps} />
      )}
    </div>
  );
}
