import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import SEOHead from '../../components/SEO/SEOHead'
import storiesHeroImage from '../../assets/images/support-images/support40.png'
import storyImageNewborn from '../../assets/images/support-images/support41.png'
import storyImageHopeHand from '../../assets/images/support-images/support48.png'
import storyImageGlow from '../../assets/images/support-images/support54.png'
import storyImageBabyHand from '../../assets/images/support-images/support57.png'
import storiesCatalog from '../../data/stories/stories.sample.json'
import { normalizeLocale } from '../../i18n/locales'
import i18n from '../../i18n/config'
import { toLocalizedPath } from '../../seo/siteConfig'

const LOCALE_COUNTRY_FALLBACKS = {
  en: 'US',
  es: 'MX',
  fr: 'FR',
  pt: 'BR',
}

const STORY_IMAGES = {
  newborn: storyImageNewborn,
  hopeHand: storyImageHopeHand,
  glow: storyImageGlow,
  babyHand: storyImageBabyHand,
}

function countryCodeToFlag(code) {
  if (typeof code !== 'string' || code.length !== 2) {
    return ''
  }

  return code
    .toUpperCase()
    .split('')
    .map((character) => String.fromCodePoint(127397 + character.charCodeAt(0)))
    .join('')
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

function StoriesPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const { locale: localeParam } = useParams()
  const locale = normalizeLocale(localeParam ?? i18n.resolvedLanguage ?? i18n.language)

  const countries = storiesCatalog.countries
  const countryCodes = useMemo(
    () => countries.map((country) => country.code),
    [countries],
  )
  const defaultCountryCode = useMemo(
    () => inferCountryCode(countryCodes, locale),
    [countryCodes, locale],
  )
  const [selectedCountryCode, setSelectedCountryCode] = useState(() => defaultCountryCode)
  const activeCountryCode = countryCodes.includes(selectedCountryCode)
    ? selectedCountryCode
    : defaultCountryCode

  const selectedCountry = useMemo(
    () => countries.find((country) => country.code === activeCountryCode) ?? countries[0],
    [activeCountryCode, countries],
  )

  const filteredStories = useMemo(
    () =>
      storiesCatalog.stories.filter((story) => story.countryCode === activeCountryCode),
    [activeCountryCode],
  )

  return (
    <>
      <SEOHead
        title={t('seo.stories.title')}
        description={t('seo.stories.description')}
        path={location.pathname}
      />
      <article className="org-page stories-page">
        <section
          className="org-section stories-hero"
          aria-labelledby="stories-page-title"
        >
          <div className="org-container stories-hero-inner">
            <div className="stories-hero-content">
              <p className="org-eyebrow">{t('storiesPage.hero.eyebrow')}</p>
              <h1 id="stories-page-title">{t('storiesPage.hero.title')}</h1>
              <p>{t('storiesPage.hero.description')}</p>
              <div className="stories-country-panel">
                <label className="stories-country-label" htmlFor="stories-country-select">
                  {t('storiesPage.selector.label')}
                </label>
                <div className="stories-country-control">
                  <span aria-hidden="true">{countryCodeToFlag(activeCountryCode)}</span>
                  <select
                    id="stories-country-select"
                    className="stories-country-select"
                    value={activeCountryCode}
                    onChange={(event) => setSelectedCountryCode(event.target.value)}
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {`${countryCodeToFlag(country.code)} ${country.name}`}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="stories-country-helper">
                  {t('storiesPage.selector.helper')}
                </p>
              </div>
              <div className="stories-hero-actions">
                <Link
                  className="org-button org-button-accent"
                  to={toLocalizedPath('/resources/hotlines', locale)}
                >
                  {t('storiesPage.hero.primaryCta')}
                </Link>
                <Link
                  className="org-button org-button-ghost"
                  to={toLocalizedPath('/contact', locale)}
                >
                  {t('storiesPage.hero.secondaryCta')}
                </Link>
              </div>
            </div>
            <div className="stories-hero-visual" aria-hidden="true">
              <img src={storiesHeroImage} alt="" loading="eager" decoding="async" />
            </div>
          </div>
        </section>

        <section
          className="org-section org-section-alt"
          aria-labelledby="stories-gallery"
        >
          <div className="org-container">
            <div className="stories-gallery-shell">
              <h2 id="stories-gallery" className="org-section-heading">
                {t('storiesPage.gallery.title', { country: selectedCountry.name })}
              </h2>
              <p className="org-section-intro">
                {t('storiesPage.gallery.description', { country: selectedCountry.name })}
              </p>
              {filteredStories.length > 0 ? (
                <div className="stories-gallery-grid" role="list">
                  {filteredStories.map((story) => (
                    <article key={story.id} className="stories-card" role="listitem">
                      <div className="stories-card-image-wrap" aria-hidden="true">
                        <img
                          src={STORY_IMAGES[story.imageKey] ?? storyImageGlow}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="stories-card-copy">
                        <h3>{story.title}</h3>
                        <p>{story.author}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <p className="stories-empty-state">{t('storiesPage.empty')}</p>
              )}
            </div>
          </div>
        </section>
      </article>
    </>
  )
}

export default StoriesPage
