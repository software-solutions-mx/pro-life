import { SITE_URL as ENV_SITE_URL } from '../config/env'
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  getLocaleMeta,
  normalizeLocale,
} from '../i18n/locales'

export const SITE_URL = ENV_SITE_URL
export const SITE_LOCALE = LOCALE_META[DEFAULT_LOCALE].ogLocale

export function toAbsoluteUrl(path = '/') {
  try {
    return new URL(path, SITE_URL).toString()
  } catch {
    return SITE_URL
  }
}

export function normalizePath(path = '/') {
  if (typeof path !== 'string' || path.length === 0) {
    return '/'
  }

  const ensuredLeadingSlash = path.startsWith('/') ? path : `/${path}`
  return ensuredLeadingSlash.replace(/\/{2,}/g, '/')
}

export function stripLocaleFromPath(path = '/') {
  const normalizedPath = normalizePath(path)
  const firstSegment = normalizedPath.split('/').filter(Boolean)[0]
  const normalizedLocale = normalizeLocale(firstSegment)

  if (firstSegment && normalizedLocale in LOCALE_META) {
    const strippedPath = normalizedPath.replace(`/${firstSegment}`, '') || '/'
    return normalizePath(strippedPath)
  }

  return normalizedPath
}

export function toLocalizedPath(path = '/', locale = DEFAULT_LOCALE) {
  const normalizedPath = stripLocaleFromPath(path)
  const normalizedLocale = normalizeLocale(locale)

  if (normalizedLocale === DEFAULT_LOCALE) {
    return normalizedPath
  }

  return normalizePath(
    `/${normalizedLocale}${normalizedPath === '/' ? '' : normalizedPath}`,
  )
}

export function getAlternateLocaleUrls(path = '/') {
  const normalizedBasePath = stripLocaleFromPath(path)
  const locales = Object.keys(LOCALE_META)

  const links = locales.map((locale) => {
    const localeMeta = getLocaleMeta(locale)
    const localePath = toLocalizedPath(normalizedBasePath, locale)
    return {
      locale,
      hrefLang: localeMeta.hreflang,
      href: toAbsoluteUrl(localePath),
      ogLocale: localeMeta.ogLocale,
    }
  })

  return {
    links,
    xDefault: toAbsoluteUrl(toLocalizedPath(normalizedBasePath, DEFAULT_LOCALE)),
  }
}
