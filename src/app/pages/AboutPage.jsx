import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import SEOHead from '../../components/SEO/SEOHead'
import aboutHeroImage from '../../assets/images/support-images/support44.png'
import aboutStoryImage from '../../assets/images/support-images/support45.png'
import aboutTrustImage from '../../assets/images/support-images/support46.png'
import { normalizeLocale } from '../../i18n/locales'
import i18n from '../../i18n/config'
import { toLocalizedPath } from '../../seo/siteConfig'

function AboutPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const { locale: localeParam } = useParams()
  const locale = normalizeLocale(localeParam ?? i18n.resolvedLanguage ?? i18n.language)

  const valueKeys = useMemo(
    () => ['dignity', 'clarity', 'compassion', 'confidentiality'],
    [],
  )
  const trustKeys = useMemo(
    () => ['confidentialCare', 'practicalResources', 'transparentInformation'],
    [],
  )

  return (
    <>
      <SEOHead
        title={t('seo.about.title')}
        description={t('seo.about.description')}
        path={location.pathname}
      />
      <article className="org-page about-page">
        <section className="org-section about-hero" aria-labelledby="about-page-title">
          <div className="org-container about-hero-inner">
            <div className="about-hero-content">
              <p className="org-eyebrow">{t('about.hero.eyebrow')}</p>
              <h1 id="about-page-title">{t('about.hero.title')}</h1>
              <p>{t('about.hero.description')}</p>
              <div className="about-hero-actions">
                <Link
                  className="org-button org-button-accent"
                  to={toLocalizedPath('/resources/hotlines', locale)}
                >
                  {t('about.hero.primaryCta')}
                </Link>
                <Link
                  className="org-button org-button-ghost"
                  to={toLocalizedPath('/contact', locale)}
                >
                  {t('about.hero.secondaryCta')}
                </Link>
              </div>
            </div>
            <div className="about-hero-visual" aria-hidden="true">
              <img src={aboutHeroImage} alt="" loading="eager" decoding="async" />
            </div>
          </div>
        </section>

        <section className="org-section" aria-labelledby="about-mv-title">
          <div className="org-container">
            <h2 id="about-mv-title" className="sr-only">
              {t('about.mission.title')}
            </h2>
            <div className="about-mv-grid">
              <article className="org-card about-float-card">
                <h3>{t('about.mission.title')}</h3>
                <p>{t('about.mission.body')}</p>
              </article>
              <article className="org-card about-float-card">
                <h3>{t('about.vision.title')}</h3>
                <p>{t('about.vision.body')}</p>
              </article>
            </div>
          </div>
        </section>

        <section
          className="org-section org-section-alt"
          aria-labelledby="about-values-title"
        >
          <div className="org-container">
            <div className="about-values-shell">
              <h2 id="about-values-title" className="org-section-heading">
                {t('about.values.title')}
              </h2>
              <p className="org-section-intro">{t('about.values.description')}</p>
              <div className="about-values-grid">
                {valueKeys.map((item) => (
                  <article key={item} className="org-card about-value-card">
                    <h3>{t(`about.values.items.${item}.title`)}</h3>
                    <p>{t(`about.values.items.${item}.body`)}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="org-section" aria-labelledby="about-story-title">
          <div className="org-container">
            <div className="about-story-panel">
              <div className="about-story-content">
                <h2 id="about-story-title" className="org-section-heading">
                  {t('about.story.title')}
                </h2>
                <p>{t('about.story.bodyOne')}</p>
                <p>{t('about.story.bodyTwo')}</p>
                <Link
                  className="org-button org-button-outline"
                  to={toLocalizedPath('/resources/find-local-help', locale)}
                >
                  {t('about.story.cta')}
                </Link>
              </div>
              <div className="about-story-visual" aria-hidden="true">
                <img src={aboutStoryImage} alt="" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </section>

        <section
          className="org-section org-section-warm"
          aria-labelledby="about-trust-title"
        >
          <div className="org-container">
            <div className="about-trust-panel">
              <div className="about-trust-visual" aria-hidden="true">
                <img src={aboutTrustImage} alt="" loading="lazy" decoding="async" />
              </div>
              <div className="about-trust-content">
                <h2 id="about-trust-title" className="org-section-heading">
                  {t('about.trust.title')}
                </h2>
                <p className="org-section-intro">{t('about.trust.description')}</p>
                <div className="about-trust-grid">
                  {trustKeys.map((item) => (
                    <article key={item} className="about-trust-item">
                      <h3>{t(`about.trust.items.${item}.title`)}</h3>
                      <p>{t(`about.trust.items.${item}.body`)}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="org-section about-closing-section"
          aria-labelledby="about-closing-title"
        >
          <div className="org-container">
            <div className="about-closing-panel">
              <h2 id="about-closing-title" className="org-section-heading">
                {t('about.closing.title')}
              </h2>
              <p>{t('about.closing.body')}</p>
              <Link
                className="org-button org-button-accent"
                to={toLocalizedPath('/resources/hotlines', locale)}
              >
                {t('about.closing.cta')}
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}

export default AboutPage
