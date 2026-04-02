import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import SEOHead from '../../components/SEO/SEOHead'
import NotFoundState from '../../components/states/NotFoundState'
import resourcesHeroImage from '../../assets/images/support-images/support38.png'
import resourceImageBabyFeet from '../../assets/images/support-images/support52.png'
import resourceImageBeams from '../../assets/images/support-images/support62.png'
import resourceImageLake from '../../assets/images/support-images/support70.png'
import resourceImageBabyFace from '../../assets/images/support-images/support149.png'
import { SUPPORTED_COUNTRY_CODES } from '../../data/countries'
import resourcesCatalog from '../../data/resources/resources.sample.json'
import i18n from '../../i18n/config'
import { useCountryPreference } from '../../i18n/hooks/useCountryPreference'
import { normalizeLocale } from '../../i18n/locales'
import { toLocalizedPath } from '../../seo/siteConfig'

const RESOURCE_IMAGES = {
  babyFeet: resourceImageBabyFeet,
  beams: resourceImageBeams,
  lake: resourceImageLake,
  babyFace: resourceImageBabyFace,
  clouds: resourcesHeroImage,
}

const TOPIC_CONFIG = {
  hotlines: {
    key: 'hotlines',
    filter: (resource) => resource.resourceType === 'phone',
  },
  'find-local-help': {
    key: 'findLocalHelp',
    filter: (resource) => resource.resourceType === 'address',
  },
  'emotional-support': {
    key: 'emotionalSupport',
    filter: (resource) => resource.resourceType === 'url',
  },
}

const EMERGENCY_CONTACTS_BY_COUNTRY = {
  US: { emergencyNumber: '911', crisisNumber: '988' },
  MX: { emergencyNumber: '911', crisisNumber: '800 911 2000' },
  FR: { emergencyNumber: '112', crisisNumber: '0 800 71 40 40' },
  BR: { emergencyNumber: '190', crisisNumber: '188' },
}

function toPhoneUri(value) {
  const normalized = value.replace(/[^\d+]/g, '')
  return normalized.startsWith('+') ? normalized : `+${normalized}`
}

function toMapUrl(address) {
  return `https://maps.google.com/?q=${encodeURIComponent(address)}`
}

function ResourceTopicPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const { locale: localeParam, topic } = useParams()
  const locale = normalizeLocale(localeParam ?? i18n.resolvedLanguage ?? i18n.language)
  const topicConfig = TOPIC_CONFIG[topic]
  const { countryCode } = useCountryPreference(SUPPORTED_COUNTRY_CODES, locale)
  const selectedCountryName = t(`countries.${countryCode}`, {
    defaultValue: countryCode,
  })

  const topicResources = useMemo(() => {
    if (!topicConfig) {
      return []
    }

    return resourcesCatalog.resources.filter(
      (resource) => resource.countryCode === countryCode && topicConfig.filter(resource),
    )
  }, [countryCode, topicConfig])

  if (!topicConfig) {
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

  const topicKey = topicConfig.key
  const emergencyContacts =
    EMERGENCY_CONTACTS_BY_COUNTRY[countryCode] ?? EMERGENCY_CONTACTS_BY_COUNTRY.US

  return (
    <>
      <SEOHead
        title={t(`seo.resourceTopics.${topicKey}.title`)}
        description={t(`seo.resourceTopics.${topicKey}.description`)}
        path={location.pathname}
      />
      <article className="org-page resources-page">
        <section
          className="org-section resources-hero"
          aria-labelledby="topic-page-title"
        >
          <div className="org-container resources-hero-inner">
            <div className="resources-hero-content">
              <p className="org-eyebrow">{t('resourceTopics.eyebrow')}</p>
              <h1 id="topic-page-title">{t(`resourceTopics.${topicKey}.title`)}</h1>
              <p>{t(`resourceTopics.${topicKey}.description`)}</p>
              <p className="resources-country-badge">
                {t(`resourceTopics.${topicKey}.countryLegend`, {
                  country: selectedCountryName,
                })}
              </p>
              <div className="resources-hero-actions">
                <Link
                  className="org-button org-button-accent"
                  to={toLocalizedPath('/resources', locale)}
                >
                  {t('resourceTopics.actions.backToResources')}
                </Link>
                <Link
                  className="org-button org-button-ghost"
                  to={toLocalizedPath('/contact', locale)}
                >
                  {t('resourceTopics.actions.contact')}
                </Link>
              </div>
            </div>
            <div className="resources-hero-visual" aria-hidden="true">
              <img src={resourcesHeroImage} alt="" loading="eager" decoding="async" />
            </div>
          </div>
        </section>

        {topicKey === 'hotlines' ? (
          <section className="org-section" aria-labelledby="hotline-emergency-title">
            <div className="org-container">
              <article className="org-card">
                <h2 id="hotline-emergency-title">
                  {t('resourceTopics.hotlines.emergencyTitle')}
                </h2>
                <p>
                  {t('resourceTopics.hotlines.emergencyBody', {
                    emergencyNumber: emergencyContacts.emergencyNumber,
                    crisisNumber: emergencyContacts.crisisNumber,
                  })}
                </p>
                <div className="org-hero-actions">
                  <a
                    className="org-button org-button-accent"
                    href={`tel:${toPhoneUri(emergencyContacts.emergencyNumber)}`}
                  >
                    {t('resourceTopics.hotlines.emergencyCallPrimary', {
                      number: emergencyContacts.emergencyNumber,
                    })}
                  </a>
                  <a
                    className="org-button org-button-outline"
                    href={`tel:${toPhoneUri(emergencyContacts.crisisNumber)}`}
                  >
                    {t('resourceTopics.hotlines.emergencyCallSecondary', {
                      number: emergencyContacts.crisisNumber,
                    })}
                  </a>
                </div>
              </article>
            </div>
          </section>
        ) : null}

        <section
          className="org-section org-section-alt"
          aria-labelledby="topic-results-title"
        >
          <div className="org-container">
            <h2 id="topic-results-title" className="org-section-heading">
              {t(`resourceTopics.${topicKey}.resultsTitle`, {
                country: selectedCountryName,
              })}
            </h2>

            {topicResources.length > 0 ? (
              <div className="resources-gallery-table" role="list">
                {topicResources.map((resource) => (
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
              <p className="resources-empty-state">
                {t(`resourceTopics.${topicKey}.empty`, {
                  country: selectedCountryName,
                })}
              </p>
            )}
          </div>
        </section>
      </article>
    </>
  )
}

export default ResourceTopicPage
