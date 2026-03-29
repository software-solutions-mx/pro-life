import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { HELP_PHONE_LABEL, HELP_PHONE_URI } from '../../../config/env'
import footerLogo from '../../../assets/images/main-logos/logo2.png'
import footerBanner from '../../../assets/images/main-logos/banner1.png'
import { toLocalizedPath } from '../../../seo/siteConfig'

function SiteFooter({ locale }) {
  const { t } = useTranslation()

  const quickLinks = useMemo(
    () => [
      { key: 'home', path: '/' },
      { key: 'about', path: '/about' },
      { key: 'resources', path: '/resources' },
      { key: 'stories', path: '/testimonials' },
      { key: 'faq', path: '/faq' },
      { key: 'contact', path: '/contact' },
    ],
    [],
  )

  const legalLinks = useMemo(
    () => [
      { key: 'privacy', path: '/legal/privacy-policy' },
      { key: 'terms', path: '/legal/terms-of-use' },
      { key: 'disclaimer', path: '/legal/disclaimer' },
      { key: 'medical', path: '/legal/medical-disclaimer' },
      { key: 'crisis', path: '/legal/mental-health-crisis-disclaimer' },
      { key: 'cookies', path: '/legal/cookie-policy' },
    ],
    [],
  )

  return (
    <footer className="org-footer" aria-label={t('a11y.siteFooter')}>
      <div className="org-footer-wave" aria-hidden="true">
        <img src={footerBanner} alt="" loading="lazy" decoding="async" />
      </div>
      <div className="org-container">
        <div className="org-footer-brand" aria-hidden="true">
          <span className="org-footer-brand-mark">
            <img src={footerLogo} alt="" loading="lazy" decoding="async" />
          </span>
          <div className="org-footer-brand-copy">
            <span className="org-footer-brand-name">{t('brand.shortName')}</span>
            <span className="org-footer-brand-tagline">{t('brand.tagline')}</span>
          </div>
        </div>

        <div className="org-footer-grid">
          <section aria-labelledby="footer-mission-title">
            <h2 id="footer-mission-title" className="org-footer-title">
              {t('footer.missionTitle')}
            </h2>
            <p className="org-footer-mission">{t('footer.missionText')}</p>
          </section>

          <nav aria-label={t('a11y.quickLinks')}>
            <h2 className="org-footer-title">{t('footer.quickLinksTitle')}</h2>
            <ul className="org-footer-links">
              {quickLinks.map((item) => (
                <li key={item.key}>
                  <Link
                    className="org-footer-link"
                    to={toLocalizedPath(item.path, locale)}
                  >
                    {t(`navigation.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section className="org-footer-help" aria-labelledby="footer-help-title">
            <h2 id="footer-help-title" className="org-footer-title">
              {t('footer.helpTitle')}
            </h2>
            {HELP_PHONE_URI ? (
              <a className="org-footer-help-link" href={HELP_PHONE_URI}>
                {HELP_PHONE_LABEL}
              </a>
            ) : null}
            <p className="org-footer-help-note">{t('footer.helpText')}</p>
            <nav aria-label={t('a11y.legalLinks')}>
              <h2 className="org-footer-title">{t('footer.legalTitle')}</h2>
              <ul className="org-footer-links">
                {legalLinks.map((item) => (
                  <li key={item.key}>
                    <Link
                      className="org-footer-link"
                      to={toLocalizedPath(item.path, locale)}
                    >
                      {t(`legal.${item.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        </div>

        <div className="org-footer-meta">
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
          <ul className="org-footer-meta-links">
            {legalLinks.slice(0, 4).map((item) => (
              <li key={item.key}>
                <Link
                  className="org-footer-meta-link"
                  to={toLocalizedPath(item.path, locale)}
                >
                  {t(`legal.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
          <p>{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
