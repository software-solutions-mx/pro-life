import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import SEOHead from '../../components/SEO/SEOHead'
import heroBannerPrimary from '../../assets/images/main-logos/banner4.png'
import heroBannerSecondary from '../../assets/images/main-logos/banner3.png'
import heroSupportImage from '../../assets/images/support-images/support1.png'
import { normalizeLocale } from '../../i18n/locales'
import i18n from '../../i18n/config'
import { toLocalizedPath } from '../../seo/siteConfig'

function HomePage() {
  const { t } = useTranslation()
  const location = useLocation()
  const { locale: localeParam } = useParams()
  const locale = normalizeLocale(localeParam ?? i18n.resolvedLanguage ?? i18n.language)

  return (
    <>
      <SEOHead
        title={t('seo.home.title')}
        description={t('seo.home.description')}
        path={location.pathname}
      />
      <article className="org-page">
        <section className="org-hero" aria-labelledby="home-page-title">
          <div className="org-hero-media-layer" aria-hidden="true">
            <img
              className="org-hero-wave org-hero-wave-primary"
              src={heroBannerPrimary}
              alt=""
              loading="eager"
              decoding="async"
            />
            <img
              className="org-hero-wave org-hero-wave-secondary"
              src={heroBannerSecondary}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="org-container org-hero-inner">
            <div className="org-hero-content">
              <p className="org-eyebrow">{t('home.hero.eyebrow')}</p>
              <h1 id="home-page-title">{t('home.hero.title')}</h1>
              <p>{t('home.hero.description')}</p>
              <div className="org-hero-actions">
                <Link
                  className="org-button org-button-accent"
                  to={toLocalizedPath('/resources/hotlines', locale)}
                >
                  {t('home.hero.primaryCta')}
                </Link>
                <Link
                  className="org-button org-button-ghost"
                  to={toLocalizedPath('/options', locale)}
                >
                  {t('home.hero.secondaryCta')}
                </Link>
              </div>
              <p className="org-hero-trust">{t('home.hero.trustLine')}</p>
            </div>
            <div className="org-hero-visual" aria-hidden="true">
              <div className="org-hero-emblem-shell">
                <img src={heroSupportImage} alt="" loading="eager" decoding="async" />
              </div>
              <div className="org-hero-ribbon-shell">
                <img src={heroBannerPrimary} alt="" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </section>

        <section className="org-section">
          <div className="org-container org-content-wrap">
            <h2 className="org-section-heading">{t('home.mission.title')}</h2>
            <p className="org-section-intro">{t('home.mission.body')}</p>
          </div>
        </section>

        <section
          className="org-section org-section-alt"
          aria-labelledby="support-paths-title"
        >
          <div className="org-container">
            <h2 id="support-paths-title" className="org-section-heading">
              {t('home.paths.title')}
            </h2>
            <p className="org-section-intro">{t('home.paths.description')}</p>
            <div className="org-grid">
              <article className="org-card">
                <h3>{t('home.paths.parenting.title')}</h3>
                <p>{t('home.paths.parenting.body')}</p>
                <Link
                  className="org-button org-button-outline"
                  to={toLocalizedPath('/options/parenting', locale)}
                >
                  {t('home.paths.parenting.cta')}
                </Link>
              </article>
              <article className="org-card">
                <h3>{t('home.paths.adoption.title')}</h3>
                <p>{t('home.paths.adoption.body')}</p>
                <Link
                  className="org-button org-button-outline"
                  to={toLocalizedPath('/options/adoption', locale)}
                >
                  {t('home.paths.adoption.cta')}
                </Link>
              </article>
              <article className="org-card">
                <h3>{t('home.paths.options.title')}</h3>
                <p>{t('home.paths.options.body')}</p>
                <Link
                  className="org-button org-button-outline"
                  to={toLocalizedPath('/options', locale)}
                >
                  {t('home.paths.options.cta')}
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section className="org-section" aria-labelledby="resource-spotlight-title">
          <div className="org-container">
            <h2 id="resource-spotlight-title" className="org-section-heading">
              {t('home.resources.title')}
            </h2>
            <p className="org-section-intro">{t('home.resources.description')}</p>
            <div className="org-grid">
              <article className="org-card">
                <h3>{t('home.resources.localHelp.title')}</h3>
                <p>{t('home.resources.localHelp.body')}</p>
                <Link
                  className="org-button org-button-outline"
                  to={toLocalizedPath('/resources/find-local-help', locale)}
                >
                  {t('home.resources.localHelp.cta')}
                </Link>
              </article>
              <article className="org-card">
                <h3>{t('home.resources.hotlines.title')}</h3>
                <p>{t('home.resources.hotlines.body')}</p>
                <Link
                  className="org-button org-button-outline"
                  to={toLocalizedPath('/resources/hotlines', locale)}
                >
                  {t('home.resources.hotlines.cta')}
                </Link>
              </article>
              <article className="org-card">
                <h3>{t('home.resources.support.title')}</h3>
                <p>{t('home.resources.support.body')}</p>
                <Link
                  className="org-button org-button-outline"
                  to={toLocalizedPath('/resources/emotional-support', locale)}
                >
                  {t('home.resources.support.cta')}
                </Link>
              </article>
            </div>
          </div>
        </section>

        <section
          className="org-section org-section-warm"
          aria-labelledby="faq-preview-title"
        >
          <div className="org-container org-content-wrap">
            <h2 id="faq-preview-title" className="org-section-heading">
              {t('home.faq.title')}
            </h2>
            <p className="org-section-intro">{t('home.faq.description')}</p>
            <ul className="org-faq-list">
              <li className="org-faq-item">{t('home.faq.items.q1')}</li>
              <li className="org-faq-item">{t('home.faq.items.q2')}</li>
              <li className="org-faq-item">{t('home.faq.items.q3')}</li>
            </ul>
            <Link
              className="org-button org-button-primary"
              to={toLocalizedPath('/faq', locale)}
            >
              {t('home.faq.cta')}
            </Link>
          </div>
        </section>

        <section
          className="org-section org-section-alt"
          aria-labelledby="final-cta-title"
        >
          <div className="org-container org-content-wrap">
            <h2 id="final-cta-title" className="org-section-heading">
              {t('home.finalCta.title')}
            </h2>
            <p>{t('home.finalCta.body')}</p>
            <Link
              className="org-button org-button-accent"
              to={toLocalizedPath('/resources/hotlines', locale)}
            >
              {t('home.finalCta.cta')}
            </Link>
          </div>
        </section>
      </article>
    </>
  )
}

export default HomePage
