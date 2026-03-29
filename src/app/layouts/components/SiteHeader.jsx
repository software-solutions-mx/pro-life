import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'
import { HELP_PHONE_LABEL, HELP_PHONE_URI } from '../../../config/env'
import mainLogo from '../../../assets/images/main-logos/logo6.png'
import { toLocalizedPath } from '../../../seo/siteConfig'

function SiteHeader({ locale }) {
  const { t } = useTranslation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

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
          {HELP_PHONE_URI ? (
            <a className="org-nav-phone" href={HELP_PHONE_URI}>
              {t('navigation.callNow', { phone: HELP_PHONE_LABEL })}
            </a>
          ) : null}
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
            {HELP_PHONE_URI ? (
              <a className="org-button org-button-outline" href={HELP_PHONE_URI}>
                {t('navigation.callNow', { phone: HELP_PHONE_LABEL })}
              </a>
            ) : null}
          </section>
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
