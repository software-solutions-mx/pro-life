const DEFAULT_SITE_URL = 'https://softwaresolutions.com.mx'
const DEFAULT_TRANSLATION_URL = '/locales/{{lng}}/{{ns}}.json'
const DEFAULT_API_BASE_URL = '/api'
const DEFAULT_SENTRY_TRACE_SAMPLE_RATE = 0.1
const DEFAULT_APP_VERSION = 'local'

function parseBoolean(value, fallback = false) {
  if (typeof value !== 'string') return fallback
  const normalized = value.trim().toLowerCase()
  if (normalized === 'true') return true
  if (normalized === 'false') return false
  return fallback
}

function parseNumber(value, fallback) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function normalizeBaseUrl(value, fallback) {
  if (typeof value !== 'string' || value.length === 0) {
    return fallback
  }

  return value.endsWith('/') ? value.slice(0, -1) : value
}

function normalizeUrl(value, fallback, keyName) {
  if (typeof value !== 'string' || value.length === 0) {
    return fallback
  }

  try {
    const normalized = new URL(value).toString()
    return normalized.endsWith('/') ? normalized.slice(0, -1) : normalized
  } catch {
    if (import.meta.env.DEV) {
      console.warn(`[env] Invalid URL for ${keyName}. Falling back to ${fallback}.`)
    }
    return fallback
  }
}

const rawEnv = import.meta.env

export const ENV_MODE = rawEnv.MODE ?? 'development'
export const APP_ENV = rawEnv.VITE_APP_ENV ?? ENV_MODE
export const IS_DEV = Boolean(rawEnv.DEV)
export const IS_PROD = Boolean(rawEnv.PROD)
export const APP_VERSION = rawEnv.VITE_APP_VERSION ?? DEFAULT_APP_VERSION

export const SITE_URL = normalizeUrl(
  rawEnv.VITE_SITE_URL,
  DEFAULT_SITE_URL,
  'VITE_SITE_URL',
)
export const API_BASE_URL = normalizeBaseUrl(
  rawEnv.VITE_API_BASE_URL,
  DEFAULT_API_BASE_URL,
)
export const TRANSLATION_URL = rawEnv.VITE_TRANSLATION_URL ?? DEFAULT_TRANSLATION_URL
export const GSC_VERIFICATION_CODE = rawEnv.VITE_GSC_VERIFICATION_CODE
export const ANALYTICS_DEBUG = parseBoolean(rawEnv.VITE_ANALYTICS_DEBUG, false)
export const GTM_ID_ENV = rawEnv.VITE_GTM_ID
export const GA4_MEASUREMENT_ID_ENV = rawEnv.VITE_GA4_ID

export const SENTRY_DSN = rawEnv.VITE_SENTRY_DSN
export const SENTRY_ENVIRONMENT = rawEnv.VITE_SENTRY_ENVIRONMENT ?? APP_ENV
export const SENTRY_RELEASE = rawEnv.VITE_SENTRY_RELEASE ?? 'local'
export const SENTRY_TRACES_SAMPLE_RATE = parseNumber(
  rawEnv.VITE_SENTRY_TRACES_SAMPLE_RATE,
  DEFAULT_SENTRY_TRACE_SAMPLE_RATE,
)

if (IS_PROD && !rawEnv.VITE_SITE_URL) {
  console.warn(
    '[env] VITE_SITE_URL is not configured. Using default production site URL.',
  )
}
