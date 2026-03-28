import { Helmet } from 'react-helmet-async'
import { GSC_VERIFICATION_CODE } from '../../config/env'
import { SEO_DEFAULTS, SITE_LOCALE, SITE_NAME, toAbsoluteUrl } from '../../seo/siteConfig'

function SEOHead({
  title = SEO_DEFAULTS.title,
  description = SEO_DEFAULTS.description,
  path = '/',
  canonical,
  ogImage = SEO_DEFAULTS.ogImage,
  ogType = 'website',
  noindex = false,
  schema = [],
}) {
  const canonicalUrl = toAbsoluteUrl(canonical ?? path)
  const resolvedSchemas = Array.isArray(schema) ? schema : [schema]
  const robotsContent = noindex ? 'noindex,nofollow' : 'index,follow'
  const googleSiteVerification = GSC_VERIFICATION_CODE

  return (
    <Helmet prioritizeSeoTags>
      <html lang="es-MX" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content={SITE_LOCALE} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content={SEO_DEFAULTS.twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {googleSiteVerification ? (
        <meta name="google-site-verification" content={googleSiteVerification} />
      ) : null}

      {resolvedSchemas.filter(Boolean).map((item, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(item)}
        </script>
      ))}
    </Helmet>
  )
}

export default SEOHead
