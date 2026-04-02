import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import SEOHead from '../../components/SEO/SEOHead'
import resourcesHeroImage from '../../assets/images/support-images/support38.png'
import resourceImageBabyFeet from '../../assets/images/support-images/support52.png'
import resourceImageBeams from '../../assets/images/support-images/support62.png'
import resourceImageLake from '../../assets/images/support-images/support70.png'
import resourceImageBabyFace from '../../assets/images/support-images/support149.png'
import { SUPPORTED_COUNTRY_CODES } from '../../data/countries'
import resourcesCatalog from '../../data/resources/resources.sample.json'
import { normalizeLocale } from '../../i18n/locales'
import i18n from '../../i18n/config'
import { useCountryPreference } from '../../i18n/hooks/useCountryPreference'
import { toLocalizedPath } from '../../seo/siteConfig'

const RESOURCE_IMAGES = {
  babyFeet: resourceImageBabyFeet,
  beams: resourceImageBeams,
  lake: resourceImageLake,
  babyFace: resourceImageBabyFace,
}

function toPhoneUri(value) {
  const normalized = value.replace(/[^\d+]/g, '')
  return normalized.startsWith('+') ? normalized : `+${normalized}`
}

function toMapUrl(address) {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`
}

function ResourcesPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const { locale: localeParam } = useParams()
  const locale = normalizeLocale(localeParam ?? i18n.resolvedLanguage ?? i18n.language)

  const { countryCode: activeCountryCode } = useCountryPreference(
    SUPPORTED_COUNTRY_CODES,
    locale,
  )
  const selectedCountryName = t(`countries.${activeCountryCode}`, {
    defaultValue: activeCountryCode,
  })

  const filteredResources = useMemo(
    () =>
      resourcesCatalog.resources.filter(
        (resource) => resource.countryCode === activeCountryCode,
      ),
    [activeCountryCode],
  )

  return (
    <>
      <SEOHead
        title={t('seo.resources.title')}
        description={t('seo.resources.description')}
        path={location.pathname}
      />
      <article className="org-page resources-page">
        <section
          className="org-section resources-hero"
          aria-labelledby="resources-page-title"
        >
          <div className="org-container resources-hero-inner">
            <div className="resources-hero-content">
              <p className="org-eyebrow">{t('resourcesPage.hero.eyebrow')}</p>
              <h1 id="resources-page-title">{t('resourcesPage.hero.title')}</h1>
              <p className="resources-country-badge">
                {t('resourcesPage.countryLoadingLegend', {
                  country: selectedCountryName,
                })}
              </p>
              <div className="resources-hero-actions">
                <Link
                  className="org-button org-button-accent"
                  to={toLocalizedPath('/resources/hotlines', locale)}
                >
                  {t('resourcesPage.hero.primaryCta')}
                </Link>
                <Link
                  className="org-button org-button-ghost"
                  to={toLocalizedPath('/contact', locale)}
                >
                  {t('resourcesPage.hero.secondaryCta')}
                </Link>
              </div>
            </div>
            <div className="resources-hero-visual" aria-hidden="true">
              <img src={resourcesHeroImage} alt="" loading="eager" decoding="async" />
            </div>
          </div>
        </section>

        <section
          className="org-section org-section-alt"
          aria-labelledby="resources-gallery"
        >
          <div className="org-container">
            <div className="resources-gallery-shell">
              <h2 id="resources-gallery" className="org-section-heading">
                {t('resourcesPage.gallery.title', { country: selectedCountryName })}
              </h2>
              <p className="org-section-intro">
                {t('resourcesPage.gallery.description', {
                  country: selectedCountryName,
                })}
              </p>

              {filteredResources.length > 0 ? (
                <div className="resources-gallery-table" role="list">
                  {filteredResources.map((resource) => (
                    <article
                      key={resource.id}
                      className="resources-gallery-row"
                      role="listitem"
                    >
                      <div className="resources-gallery-poster" aria-hidden="true">
                        <img
                          src={RESOURCE_IMAGES[resource.imageKey] ?? resourceImageBeams}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="resources-gallery-copy">
                        <h3>{resource.title}</h3>
                        <p>{resource.description}</p>
                        <div className="resources-gallery-meta">
                          <span className="resources-gallery-type">
                            {t(`resourcesPage.types.${resource.resourceType}`)}
                          </span>
                          {resource.resourceType === 'phone' ? (
                            <a href={`tel:${toPhoneUri(resource.resourceValue)}`}>
                              {`${t('resourcesPage.actions.callNow')}: ${resource.resourceValue}`}
                            </a>
                          ) : null}
                          {resource.resourceType === 'url' ? (
                            <a
                              href={resource.resourceValue}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              {t('resourcesPage.actions.visitWebsite')}
                            </a>
                          ) : null}
                          {resource.resourceType === 'address' ? (
                            <a
                              href={toMapUrl(resource.resourceValue)}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              {`${t('resourcesPage.actions.openMap')}: ${resource.resourceValue}`}
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="resources-empty-state">{t('resourcesPage.empty')}</p>
              )}
            </div>
          </div>
        </section>

        <section
          className="org-section resources-closing-section"
          aria-labelledby="resources-closing-title"
        >
          <div className="org-container">
            <div className="resources-closing-panel">
              <h2 id="resources-closing-title" className="org-section-heading">
                {t('resourcesPage.closing.title')}
              </h2>
              <p>{t('resourcesPage.closing.body')}</p>
              <Link
                className="org-button org-button-accent"
                to={toLocalizedPath('/resources/hotlines', locale)}
              >
                {t('resourcesPage.closing.cta')}
              </Link>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}

export default ResourcesPage
