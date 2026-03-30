import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { SUPPORTED_COUNTRIES, countryCodeToFlag } from '../../../data/countries'
import { useCountryPreference } from '../../../i18n/hooks/useCountryPreference'
import mainLogo from '../../../assets/images/main-logos/logo6.png'
import { DEFAULT_LOCALE, normalizeLocale } from '../../../i18n/locales'
import { stripLocaleFromPath, toLocalizedPath } from '../../../seo/siteConfig'

const LANGUAGE_OPTIONS = [
  { localeCode: 'es', flagCountryCode: 'MX' },
  { localeCode: 'en', flagCountryCode: 'US' },
  { localeCode: 'fr', flagCountryCode: 'FR' },
  { localeCode: 'pt', flagCountryCode: 'BR' },
]

function SiteHeader({ locale }) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const countryCodes = useMemo(
    () => SUPPORTED_COUNTRIES.map((country) => country.code),
    [],
  )
  const { countryCode, setCountryCode } = useCountryPreference(countryCodes, locale)
  const normalizedLocale = normalizeLocale(locale)
  const activeLocale = LANGUAGE_OPTIONS.some(
    (option) => option.localeCode === normalizedLocale,
  )
    ? normalizedLocale
    : DEFAULT_LOCALE
  const countryTooltip = t('navigation.countryTooltip')
  const languageTooltip = t('navigation.languageTooltip')

  const navigationLinks = useMemo(
    () => [
      { key: 'home', path: '/' },
      { key: 'about', path: '/about' },
      { key: 'options', path: '/options' },
      { key: 'resources', path: '/resources' },
      { key: 'stories', path: '/testimonials' },
      { key: 'faq', path: '/faq' },
      { key: 'contact', path: '/contact' },
    ],
    [],
  )

  useEffect(() => {
    document.body.classList.toggle('org-nav-lock', isMobileOpen)

    return () => {
      document.body.classList.remove('org-nav-lock')
    }
  }, [isMobileOpen])

  useEffect(() => {
    if (!isMobileOpen) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMobileOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isMobileOpen])

  const handleLocaleChange = (nextLocale) => {
    const normalizedNextLocale = normalizeLocale(nextLocale)
    const basePath = stripLocaleFromPath(location.pathname)
    const nextPath = toLocalizedPath(basePath, normalizedNextLocale)
    const currentRoute = `${location.pathname}${location.search}${location.hash}`
    const nextRoute = `${nextPath}${location.search}${location.hash}`

    if (nextRoute !== currentRoute) {
      navigate(nextRoute)
    }

    setIsMobileOpen(false)
  }

  const supportPath = toLocalizedPath('/resources/hotlines', locale)

  return (
    <header className="org-nav" aria-label={t('a11y.siteHeader')}>
      <div className="org-container org-nav-inner">
        <Link
          className="org-brand"
          to={toLocalizedPath('/', locale)}
          aria-label={t('a11y.brandHome', { brand: t('brand.name') })}
        >
          <span className="org-brand-mark" aria-hidden="true">
            <img src={mainLogo} alt="" loading="eager" decoding="async" />
          </span>
          <span className="org-brand-text">
            <span className="org-brand-name">{t('brand.shortName')}</span>
            <span className="org-brand-tagline">{t('brand.tagline')}</span>
          </span>
        </Link>

        <nav className="org-nav-desktop" aria-label={t('a11y.mainNavigation')}>
          <ul className="org-nav-links">
            {navigationLinks.map((item) => (
              <li key={item.key}>
                <NavLink
                  to={toLocalizedPath(item.path, locale)}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `org-nav-link${isActive ? ' is-active' : ''}`
                  }
                >
                  {t(`navigation.${item.key}`)}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="org-nav-actions">
          <div className="org-nav-language">
            <label className="sr-only" htmlFor="global-language-select">
              {t('navigation.languageLabel')}
            </label>
            <select
              id="global-language-select"
              className="org-nav-language-select"
              value={activeLocale}
              title={languageTooltip}
              onChange={(event) => handleLocaleChange(event.target.value)}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.localeCode} value={option.localeCode}>
                  {`${countryCodeToFlag(option.flagCountryCode)} ${option.localeCode.toUpperCase()}`}
                </option>
              ))}
            </select>
          </div>
          <div className="org-nav-country">
            <label className="sr-only" htmlFor="global-country-select">
              {t('navigation.countryLabel')}
            </label>
            <select
              id="global-country-select"
              className="org-nav-country-select"
              value={countryCode}
              title={countryTooltip}
              onChange={(event) => setCountryCode(event.target.value)}
            >
              {SUPPORTED_COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {`${countryCodeToFlag(country.code)} ${t(`countries.${country.code}`)}`}
                </option>
              ))}
            </select>
          </div>
          <Link className="org-button org-button-accent org-nav-cta" to={supportPath}>
            {t('navigation.getHelpNow')}
          </Link>
          <button
            type="button"
            className="org-nav-toggle"
            aria-controls="mobile-navigation"
            aria-expanded={isMobileOpen}
            aria-label={
              isMobileOpen ? t('navigation.closeMenu') : t('navigation.openMenu')
            }
            onClick={() => setIsMobileOpen((current) => !current)}
          >
            <span className="org-nav-toggle-text" aria-hidden="true">
              {isMobileOpen ? '×' : '☰'}
            </span>
          </button>
        </div>
      </div>

      <div className="org-mobile-drawer" hidden={!isMobileOpen}>
        <button
          type="button"
          className="org-mobile-backdrop"
          aria-label={t('navigation.closeMenu')}
          onClick={() => setIsMobileOpen(false)}
        />
        <nav
          id="mobile-navigation"
          className="org-mobile-panel"
          aria-label={t('a11y.mobileNavigation')}
        >
          <div className="org-mobile-header">
            <button
              type="button"
              className="org-mobile-close"
              aria-label={t('navigation.closeMenu')}
              onClick={() => setIsMobileOpen(false)}
            >
              ×
            </button>
          </div>
          <ul className="org-mobile-links">
            {navigationLinks.map((item) => (
              <li key={item.key}>
                <NavLink
                  to={toLocalizedPath(item.path, locale)}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `org-mobile-link${isActive ? ' is-active' : ''}`
                  }
                  onClick={() => setIsMobileOpen(false)}
                >
                  {t(`navigation.${item.key}`)}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="org-mobile-country">
            <label
              className="org-mobile-country-label"
              htmlFor="global-country-select-mobile"
            >
              {t('navigation.countryLabel')}
            </label>
            <select
              id="global-country-select-mobile"
              className="org-mobile-country-select"
              value={countryCode}
              title={countryTooltip}
              onChange={(event) => setCountryCode(event.target.value)}
            >
              {SUPPORTED_COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {`${countryCodeToFlag(country.code)} ${t(`countries.${country.code}`)}`}
                </option>
              ))}
            </select>
          </div>
          <div className="org-mobile-language">
            <label
              className="org-mobile-language-label"
              htmlFor="global-language-select-mobile"
            >
              {t('navigation.languageLabel')}
            </label>
            <select
              id="global-language-select-mobile"
              className="org-mobile-language-select"
              value={activeLocale}
              title={languageTooltip}
              onChange={(event) => handleLocaleChange(event.target.value)}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.localeCode} value={option.localeCode}>
                  {`${countryCodeToFlag(option.flagCountryCode)} ${option.localeCode.toUpperCase()}`}
                </option>
              ))}
            </select>
          </div>
          <section className="org-mobile-help" aria-labelledby="mobile-help-title">
            <h2 id="mobile-help-title" className="org-mobile-help-title">
              {t('navigation.getHelpNow')}
            </h2>
            <p>{t('home.hero.trustLine')}</p>
            <Link
              className="org-button org-button-accent"
              to={supportPath}
              onClick={() => setIsMobileOpen(false)}
            >
              {t('home.hero.primaryCta')}
            </Link>
          </section>
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
