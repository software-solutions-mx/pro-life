import { isSupportedLocale, normalizeLocale } from '../../i18n/locales'
import { toLocalizedPath } from '../../seo/siteConfig'

export function getLocalizedHomePath({ localeParam, resolvedLanguage, language } = {}) {
  const normalizedLocale = normalizeLocale(localeParam ?? resolvedLanguage ?? language)

  return toLocalizedPath(
    '/',
    isSupportedLocale(normalizedLocale) ? normalizedLocale : undefined,
  )
}
