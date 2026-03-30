import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import SEOHead from '../../components/SEO/SEOHead'
import optionsHeroImage from '../../assets/images/support-images/support39.png'
import optionsSupportImage from '../../assets/images/support-images/support71.png'
import optionsClosingImage from '../../assets/images/support-images/support98.png'
import { SUPPORTED_COUNTRY_CODES } from '../../data/countries'
import { normalizeLocale } from '../../i18n/locales'
import i18n from '../../i18n/config'
import { useCountryPreference } from '../../i18n/hooks/useCountryPreference'
import { toLocalizedPath } from '../../seo/siteConfig'

function OptionsPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const { locale: localeParam } = useParams()
  const locale = normalizeLocale(localeParam ?? i18n.resolvedLanguage ?? i18n.language)
  const { countryCode } = useCountryPreference(SUPPORTED_COUNTRY_CODES, locale)
  const selectedCountryName = t(`countries.${countryCode}`, {
    defaultValue: countryCode,
  })

  const pathKeys = useMemo(
    () => ['continuingPregnancy', 'parenting', 'adoption', 'understandingAbortion'],
    [],
  )
  const frameworkKeys = useMemo(
    () => ['biologicalFacts', 'ethicalPerspective', 'faithBeliefs'],
    [],
  )
  const commitmentKeys = useMemo(
    () => ['nonJudgment', 'confidentiality', 'medicalNotice'],
    [],
  )

  return (
    <>
      <SEOHead
        title={t('seo.options.title')}
        description={t('seo.options.description')}
        path={location.pathname}
      />
      <article className="org-page options-page">
        <section
          className="org-section options-hero"
          aria-labelledby="options-page-title"
        >
          <div className="org-container options-hero-inner">
            <div className="options-hero-content">
              <p className="org-eyebrow">{t('optionsPage.hero.eyebrow')}</p>
              <h1 id="options-page-title">{t('optionsPage.hero.title')}</h1>
              <p className="options-country-badge">
                {t('optionsPage.countryLoadingLegend', {
                  country: selectedCountryName,
                })}
              </p>
              <div className="options-hero-actions">
                <Link
                  className="org-button org-button-accent"
                  to={toLocalizedPath('/resources/hotlines', locale)}
                >
                  {t('optionsPage.hero.primaryCta')}
                </Link>
                <Link
                  className="org-button org-button-ghost"
                  to={toLocalizedPath('/contact', locale)}
                >
                  {t('optionsPage.hero.secondaryCta')}
                </Link>
              </div>
            </div>
            <div className="options-hero-visual" aria-hidden="true">
              <img src={optionsHeroImage} alt="" loading="eager" decoding="async" />
            </div>
          </div>
        </section>

        <section className="org-section" aria-labelledby="options-orientation-title">
          <div className="org-container">
            <div className="options-orientation-panel">
              <div className="options-orientation-content">
                <h2 id="options-orientation-title" className="org-section-heading">
                  {t('optionsPage.orientation.title')}
                </h2>
                <p>{t('optionsPage.orientation.bodyOne')}</p>
                <p>{t('optionsPage.orientation.bodyTwo')}</p>
              </div>
              <div className="options-orientation-visual" aria-hidden="true">
                <img src={optionsSupportImage} alt="" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </section>

        <section
          className="org-section org-section-alt"
          aria-labelledby="options-pathways-title"
        >
          <div className="org-container">
            <h2 id="options-pathways-title" className="org-section-heading">
              {t('optionsPage.pathways.title')}
            </h2>
            <p className="org-section-intro">
              {t('optionsPage.pathways.description', { country: selectedCountryName })}
            </p>
            <div className="options-pathways-grid">
              {pathKeys.map((item) => (
                <article key={item} className="org-card options-path-card">
                  <h3>{t(`optionsPage.pathways.items.${item}.title`)}</h3>
                  <p>{t(`optionsPage.pathways.items.${item}.body`)}</p>
                  <Link
                    className="org-button org-button-outline"
                    to={toLocalizedPath(
                      t(`optionsPage.pathways.items.${item}.path`),
                      locale,
                    )}
                  >
                    {t(`optionsPage.pathways.items.${item}.cta`)}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="org-section" aria-labelledby="options-framework-title">
          <div className="org-container">
            <div className="options-framework-shell">
              <h2 id="options-framework-title" className="org-section-heading">
                {t('optionsPage.framework.title')}
              </h2>
              <p className="org-section-intro">
                {t('optionsPage.framework.description')}
              </p>
              <div className="options-framework-grid">
                {frameworkKeys.map((item) => (
                  <article key={item} className="org-card options-framework-card">
                    <h3>{t(`optionsPage.framework.items.${item}.title`)}</h3>
                    <p>{t(`optionsPage.framework.items.${item}.body`)}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="org-section org-section-warm"
          aria-labelledby="options-commitments-title"
        >
          <div className="org-container">
            <div className="options-commitments-panel">
              <div className="options-commitments-copy">
                <h2 id="options-commitments-title" className="org-section-heading">
                  {t('optionsPage.commitments.title')}
                </h2>
                <p className="org-section-intro">
                  {t('optionsPage.commitments.description')}
                </p>
                <ul className="options-commitments-list">
                  {commitmentKeys.map((item) => (
                    <li key={item} className="options-commitments-item">
                      {t(`optionsPage.commitments.items.${item}`)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="options-commitments-visual" aria-hidden="true">
                <img src={optionsClosingImage} alt="" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </section>

        <section
          className="org-section options-closing-section"
          aria-labelledby="options-closing-title"
        >
          <div className="org-container">
            <div className="options-closing-panel">
              <h2 id="options-closing-title" className="org-section-heading">
                {t('optionsPage.closing.title')}
              </h2>
              <p>{t('optionsPage.closing.body')}</p>
              <div className="options-closing-actions">
                <Link
                  className="org-button org-button-accent"
                  to={toLocalizedPath('/resources/hotlines', locale)}
                >
                  {t('optionsPage.closing.primaryCta')}
                </Link>
                <Link
                  className="org-button org-button-outline"
                  to={toLocalizedPath('/faq', locale)}
                >
                  {t('optionsPage.closing.secondaryCta')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}

export default OptionsPage
