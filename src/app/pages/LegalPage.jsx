import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import SEOHead from '../../components/SEO/SEOHead'
import NotFoundState from '../../components/states/NotFoundState'
import { normalizeLocale } from '../../i18n/locales'
import i18n from '../../i18n/config'
import { toLocalizedPath } from '../../seo/siteConfig'

const LEGAL_SLUG_TO_KEY = {
  'privacy-policy': 'privacy',
  'terms-of-use': 'terms',
  disclaimer: 'disclaimer',
  'medical-disclaimer': 'medical',
  'mental-health-crisis-disclaimer': 'crisis',
  'cookie-policy': 'cookies',
}

const LEGAL_SECTION_KEYS = ['one', 'two', 'three']

function LegalPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const { locale: localeParam, policySlug } = useParams()
  const locale = normalizeLocale(localeParam ?? i18n.resolvedLanguage ?? i18n.language)
  const legalKey = LEGAL_SLUG_TO_KEY[policySlug]

  const sectionKeys = useMemo(() => LEGAL_SECTION_KEYS, [])

  if (!legalKey) {
    return (
      <>
        <SEOHead
          title={t('seo.notFound.title')}
          description={t('seo.notFound.description')}
          path={location.pathname}
          noindex
        />
        <NotFoundState
          title={t('errors.notFound.title')}
          message={t('errors.notFound.message')}
          actionLabel={t('errors.actions.backToHome')}
          homePath={toLocalizedPath('/', locale)}
        />
      </>
    )
  }

  return (
    <>
      <SEOHead
        title={t(`seo.legalPages.${legalKey}.title`)}
        description={t(`seo.legalPages.${legalKey}.description`)}
        path={location.pathname}
      />
      <article className="org-page legal-page">
        <section className="org-section" aria-labelledby="legal-page-title">
          <div className="org-container org-content-wrap">
            <p className="org-eyebrow">{t('legalPages.eyebrow')}</p>
            <h1 id="legal-page-title">{t(`legal.${legalKey}`)}</h1>
            <p className="org-section-intro">{t(`legalPages.${legalKey}.intro`)}</p>
            <p>
              {`${t('legalPages.updatedLabel')}: ${t(`legalPages.${legalKey}.updatedValue`)}`}
            </p>
            <div className="org-hero-actions">
              <Link
                className="org-button org-button-accent"
                to={toLocalizedPath('/resources/hotlines', locale)}
              >
                {t('legalPages.actions.resources')}
              </Link>
              <Link
                className="org-button org-button-ghost"
                to={toLocalizedPath('/contact', locale)}
              >
                {t('legalPages.actions.contact')}
              </Link>
            </div>
          </div>
        </section>

        <section className="org-section org-section-alt" aria-labelledby="legal-sections">
          <div className="org-container">
            <h2 id="legal-sections" className="org-section-heading">
              {t(`legalPages.${legalKey}.sectionsTitle`)}
            </h2>
            <div className="org-grid">
              {sectionKeys.map((sectionKey) => (
                <article key={sectionKey} className="org-card">
                  <h3>{t(`legalPages.${legalKey}.sections.${sectionKey}.title`)}</h3>
                  <p>{t(`legalPages.${legalKey}.sections.${sectionKey}.body`)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </article>
    </>
  )
}

export default LegalPage
