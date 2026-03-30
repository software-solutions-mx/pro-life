import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import SEOHead from '../../components/SEO/SEOHead'
import faqHeroImage from '../../assets/images/support-images/support46.png'
import { FAQ_CATEGORY_KEYS, FAQ_ITEMS } from '../../data/faq/faqItems'
import { SUPPORTED_COUNTRY_CODES } from '../../data/countries'
import i18n from '../../i18n/config'
import { useCountryPreference } from '../../i18n/hooks/useCountryPreference'
import { normalizeLocale } from '../../i18n/locales'
import { toLocalizedPath } from '../../seo/siteConfig'

function FAQPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const { locale: localeParam } = useParams()
  const locale = normalizeLocale(localeParam ?? i18n.resolvedLanguage ?? i18n.language)

  const { countryCode } = useCountryPreference(SUPPORTED_COUNTRY_CODES, locale)
  const selectedCountryName = t(`countries.${countryCode}`, {
    defaultValue: countryCode,
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeItemId, setActiveItemId] = useState(FAQ_ITEMS[0]?.id ?? null)

  const hydratedFaqItems = useMemo(
    () =>
      FAQ_ITEMS.map((item) => ({
        ...item,
        question: t(`faqPage.items.${item.id}.question`),
        answer: t(`faqPage.items.${item.id}.answer`),
        keywords: t(`faqPage.items.${item.id}.keywords`),
      })),
    [t],
  )

  const filteredFaqItems = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase()

    return hydratedFaqItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'all' ? true : item.category === activeCategory

      if (!matchesCategory) {
        return false
      }

      if (normalizedSearchTerm.length === 0) {
        return true
      }

      const searchableText =
        `${item.question} ${item.answer} ${item.keywords}`.toLowerCase()
      return searchableText.includes(normalizedSearchTerm)
    })
  }, [activeCategory, hydratedFaqItems, searchTerm])

  const visibleActiveItemId = filteredFaqItems.some((item) => item.id === activeItemId)
    ? activeItemId
    : (filteredFaqItems[0]?.id ?? null)
  const activeFaqItem =
    filteredFaqItems.find((item) => item.id === visibleActiveItemId) ?? null

  const pickSurpriseQuestion = () => {
    if (filteredFaqItems.length === 0) {
      return
    }

    const randomIndex = Math.floor(Math.random() * filteredFaqItems.length)
    setActiveItemId(filteredFaqItems[randomIndex].id)
  }

  return (
    <>
      <SEOHead
        title={t('seo.faq.title')}
        description={t('seo.faq.description')}
        path={location.pathname}
      />
      <article className="org-page faq-page">
        <section className="org-section faq-hero" aria-labelledby="faq-page-title">
          <div className="org-container faq-hero-inner">
            <div className="faq-hero-content">
              <p className="org-eyebrow">{t('faqPage.hero.eyebrow')}</p>
              <h1 id="faq-page-title">{t('faqPage.hero.title')}</h1>
              <p>{t('faqPage.hero.description')}</p>

              <div className="faq-controls-shell">
                <label className="faq-search-label" htmlFor="faq-search-input">
                  {t('faqPage.search.label')}
                </label>
                <div className="faq-search-control">
                  <input
                    id="faq-search-input"
                    type="search"
                    value={searchTerm}
                    className="faq-search-input"
                    placeholder={t('faqPage.search.placeholder')}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                  <button
                    type="button"
                    className="faq-surprise-button"
                    onClick={pickSurpriseQuestion}
                  >
                    {t('faqPage.search.surprise')}
                  </button>
                </div>
              </div>

              <div className="faq-filter-shell" aria-label={t('faqPage.filters.label')}>
                {FAQ_CATEGORY_KEYS.map((categoryKey) => (
                  <button
                    key={categoryKey}
                    type="button"
                    className={`faq-filter-chip${activeCategory === categoryKey ? ' is-active' : ''}`}
                    onClick={() => setActiveCategory(categoryKey)}
                  >
                    {t(`faqPage.categories.${categoryKey}`)}
                  </button>
                ))}
              </div>

              <div className="faq-metrics-grid">
                <article className="faq-metric-card">
                  <p className="faq-metric-label">
                    {t('faqPage.metrics.questionsLabel')}
                  </p>
                  <p className="faq-metric-value">
                    {t('faqPage.metrics.questionsValue', {
                      count: filteredFaqItems.length,
                    })}
                  </p>
                </article>
                <article className="faq-metric-card">
                  <p className="faq-metric-label">{t('faqPage.metrics.countryLabel')}</p>
                  <p className="faq-metric-value">
                    {t('faqPage.metrics.countryValue', { country: selectedCountryName })}
                  </p>
                </article>
              </div>
            </div>

            <div className="faq-hero-visual" aria-hidden="true">
              <img src={faqHeroImage} alt="" loading="eager" decoding="async" />
            </div>
          </div>
        </section>

        <section
          className="org-section org-section-alt"
          aria-labelledby="faq-questions-title"
        >
          <div className="org-container faq-stage-shell">
            <div className="faq-stage-grid">
              <div className="faq-question-column">
                <h2 id="faq-questions-title" className="org-section-heading">
                  {t('faqPage.questionRail.title')}
                </h2>
                <p className="org-section-intro">
                  {t('faqPage.questionRail.description')}
                </p>

                {filteredFaqItems.length > 0 ? (
                  <div className="faq-question-list" role="list">
                    {filteredFaqItems.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        role="listitem"
                        className={`faq-question-item${item.id === visibleActiveItemId ? ' is-active' : ''}`}
                        aria-pressed={item.id === visibleActiveItemId}
                        onClick={() => setActiveItemId(item.id)}
                      >
                        <span className="faq-question-chip">
                          {t(`faqPage.categories.${item.category}`)}
                        </span>
                        <span className="faq-question-copy">{item.question}</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="faq-empty-state" role="status">
                    <h3>{t('faqPage.empty.title')}</h3>
                    <p>{t('faqPage.empty.description')}</p>
                    <button
                      type="button"
                      className="org-button org-button-outline"
                      onClick={() => {
                        setSearchTerm('')
                        setActiveCategory('all')
                      }}
                    >
                      {t('faqPage.empty.reset')}
                    </button>
                  </div>
                )}
              </div>

              <div className="faq-answer-column">
                {activeFaqItem ? (
                  <article className="faq-answer-card">
                    <p className="org-eyebrow">{t('faqPage.answer.eyebrow')}</p>
                    <h2>{activeFaqItem.question}</h2>
                    <p>{activeFaqItem.answer}</p>
                    <p className="faq-answer-note">{t('faqPage.answer.note')}</p>

                    <section
                      className="faq-answer-actions"
                      aria-labelledby="faq-answer-actions-title"
                    >
                      <h3 id="faq-answer-actions-title">
                        {t('faqPage.answer.actionsTitle')}
                      </h3>
                      <div className="faq-answer-action-grid">
                        <Link
                          className="org-button org-button-accent"
                          to={toLocalizedPath('/resources/hotlines', locale)}
                        >
                          {t('faqPage.answer.actions.hotlines')}
                        </Link>
                        <Link
                          className="org-button org-button-ghost"
                          to={toLocalizedPath('/resources', locale)}
                        >
                          {t('faqPage.answer.actions.resources')}
                        </Link>
                        <Link
                          className="org-button org-button-outline"
                          to={toLocalizedPath('/contact', locale)}
                        >
                          {t('faqPage.answer.actions.contact')}
                        </Link>
                      </div>
                    </section>
                  </article>
                ) : (
                  <article className="faq-answer-card faq-answer-card-placeholder">
                    <p>{t('faqPage.empty.description')}</p>
                  </article>
                )}
              </div>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}

export default FAQPage
