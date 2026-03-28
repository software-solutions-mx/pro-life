export const SITE_NAME = 'Software Solutions'
export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://softwaresolutions.com.mx'
export const SITE_LOCALE = 'es_MX'

export const SEO_DEFAULTS = {
  title: 'Desarrollo de Software a la Medida en México | Software Solutions',
  description:
    'Software Solutions: desarrollamos aplicaciones web, sistemas empresariales y software personalizado para empresas en México. Cotización sin costo.',
  ogImage: `${SITE_URL}/og/og-default.svg`,
  twitterCard: 'summary_large_image',
}

export function toAbsoluteUrl(path = '/') {
  try {
    return new URL(path, SITE_URL).toString()
  } catch {
    return SITE_URL
  }
}
