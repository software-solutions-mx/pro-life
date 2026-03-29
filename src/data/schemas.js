import { SITE_URL } from '../seo/siteConfig'

export function createOrganizationSchema(name) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url: SITE_URL,
    logo: `${SITE_URL}/og/og-default.svg`,
  }
}

export function createWebsiteSchema(name) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: SITE_URL,
  }
}
