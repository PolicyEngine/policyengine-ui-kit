import { Footer, type FooterProps } from './Footer';
import {
  DEFAULT_POLICYENGINE_BASE_URL,
  getPolicyEngineFooterLinks,
  type PolicyEngineCountryId,
} from './PolicyEngineSiteConfig';

export interface PolicyEngineFooterProps extends Omit<FooterProps, 'links'> {
  country?: PolicyEngineCountryId;
  baseUrl?: string;
  links?: FooterProps['links'];
}

export function PolicyEngineFooter({
  country = 'us',
  baseUrl = DEFAULT_POLICYENGINE_BASE_URL,
  links,
  ...props
}: PolicyEngineFooterProps) {
  return (
    <Footer
      links={links ?? getPolicyEngineFooterLinks(country, baseUrl)}
      {...props}
    />
  );
}
