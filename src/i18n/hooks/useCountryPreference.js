import { useCallback, useEffect, useMemo, useState } from 'react'

export const COUNTRY_PREFERENCE_STORAGE_KEY = 'vbhl_country_preference'
const COUNTRY_CHANGE_EVENT = 'vbhl-country-change'

const LOCALE_COUNTRY_FALLBACKS = {
  en: 'US',
  es: 'MX',
  fr: 'FR',
  pt: 'BR',
}

function normalizeCountryCode(countryCode) {
  if (typeof countryCode !== 'string' || countryCode.length !== 2) {
    return null
  }

  return countryCode.toUpperCase()
}

function getRegionFromLocale(localeCode) {
  if (typeof localeCode !== 'string' || localeCode.length === 0) {
    return null
  }

  try {
    const parsed = new Intl.Locale(localeCode)
    return parsed.region?.toUpperCase() ?? null
  } catch {
    const match = localeCode.match(/[-_]([A-Za-z]{2})\b/)
    return match ? match[1].toUpperCase() : null
  }
}

function inferCountryCode(countryCodes, locale) {
  if (typeof navigator !== 'undefined') {
    const browserLocales = [
      ...(Array.isArray(navigator.languages) ? navigator.languages : []),
      navigator.language,
      Intl.DateTimeFormat().resolvedOptions().locale,
    ].filter(Boolean)

    for (const localeCode of browserLocales) {
      const region = getRegionFromLocale(localeCode)
      if (region && countryCodes.includes(region)) {
        return region
      }
    }
  }

  const fallbackCountry = LOCALE_COUNTRY_FALLBACKS[locale]
  if (fallbackCountry && countryCodes.includes(fallbackCountry)) {
    return fallbackCountry
  }

  return countryCodes[0]
}

function readStoredCountryCode() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return normalizeCountryCode(localStorage.getItem(COUNTRY_PREFERENCE_STORAGE_KEY))
  } catch {
    return null
  }
}

function writeStoredCountryCode(countryCode) {
  if (typeof window === 'undefined') {
    return
  }

  try {
    localStorage.setItem(COUNTRY_PREFERENCE_STORAGE_KEY, countryCode)
  } catch {
    // Ignore storage write errors to keep UI functional.
  }
}

function broadcastCountryChange(countryCode) {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(COUNTRY_CHANGE_EVENT, { detail: { countryCode } }))
}

export function useCountryPreference(countryCodes, locale) {
  const normalizedCountryCodes = useMemo(
    () => [...new Set(countryCodes.map(normalizeCountryCode).filter(Boolean))],
    [countryCodes],
  )

  const inferredCountryCode = useMemo(
    () => inferCountryCode(normalizedCountryCodes, locale),
    [locale, normalizedCountryCodes],
  )

  const [internalCountryCode, setInternalCountryCode] = useState(() => {
    const storedCountryCode = readStoredCountryCode()
    if (storedCountryCode && normalizedCountryCodes.includes(storedCountryCode)) {
      return storedCountryCode
    }

    return inferredCountryCode
  })

  const countryCode = normalizedCountryCodes.includes(internalCountryCode)
    ? internalCountryCode
    : inferredCountryCode

  const setCountryCode = useCallback(
    (nextCountryCode) => {
      const normalizedCountryCode = normalizeCountryCode(nextCountryCode)

      if (
        !normalizedCountryCode ||
        !normalizedCountryCodes.includes(normalizedCountryCode)
      ) {
        return
      }

      setInternalCountryCode(normalizedCountryCode)
      writeStoredCountryCode(normalizedCountryCode)
      broadcastCountryChange(normalizedCountryCode)
    },
    [normalizedCountryCodes],
  )

  useEffect(() => {
    writeStoredCountryCode(countryCode)
  }, [countryCode])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const onStorage = (event) => {
      if (event.key !== COUNTRY_PREFERENCE_STORAGE_KEY) {
        return
      }

      const nextCountryCode = normalizeCountryCode(event.newValue)
      if (nextCountryCode && normalizedCountryCodes.includes(nextCountryCode)) {
        setInternalCountryCode(nextCountryCode)
      }
    }

    const onCountryChange = (event) => {
      const nextCountryCode = normalizeCountryCode(event.detail?.countryCode)
      if (nextCountryCode && normalizedCountryCodes.includes(nextCountryCode)) {
        setInternalCountryCode(nextCountryCode)
      }
    }

    window.addEventListener('storage', onStorage)
    window.addEventListener(COUNTRY_CHANGE_EVENT, onCountryChange)

    return () => {
      window.removeEventListener('storage', onStorage)
      window.removeEventListener(COUNTRY_CHANGE_EVENT, onCountryChange)
    }
  }, [normalizedCountryCodes])

  return {
    countryCode,
    setCountryCode,
  }
}
