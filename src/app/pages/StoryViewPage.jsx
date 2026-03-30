import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import SEOHead from '../../components/SEO/SEOHead'
import NotFoundState from '../../components/states/NotFoundState'
import storyImageNewborn from '../../assets/images/support-images/support41.png'
import storyImageHopeHand from '../../assets/images/support-images/support48.png'
import storyImageGlow from '../../assets/images/support-images/support54.png'
import storyImageBabyHand from '../../assets/images/support-images/support57.png'
import { getStoryById } from '../../data/stories/storyCatalog'
import { normalizeLocale } from '../../i18n/locales'
import i18n from '../../i18n/config'
import { toLocalizedPath } from '../../seo/siteConfig'

const STORY_IMAGES = {
  newborn: storyImageNewborn,
  hopeHand: storyImageHopeHand,
  glow: storyImageGlow,
  babyHand: storyImageBabyHand,
}

function formatStoryDate(dateValue, locale) {
  const parsedDate = new Date(dateValue)
  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue
  }

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsedDate)
}

function StoryViewPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const { locale: localeParam, storyId } = useParams()
  const locale = normalizeLocale(localeParam ?? i18n.resolvedLanguage ?? i18n.language)
  const story = useMemo(() => getStoryById(storyId), [storyId])

  if (!story) {
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

  const storyCountryName = t(`countries.${story.countryCode}`, {
    defaultValue: story.countryCode,
  })
  const storyImageSrc = STORY_IMAGES[story.imageKey] ?? storyImageGlow
  const storyPublishedAt = formatStoryDate(story.publishedAt, locale)

  return (
    <>
      <SEOHead
        title={t('seo.storyDetail.title', {
          title: story.title,
          brand: t('brand.shortName'),
        })}
        description={t('seo.storyDetail.description', {
          title: story.title,
          author: story.author,
          country: storyCountryName,
        })}
        path={location.pathname}
      />
      <article className="org-page story-view-page">
        <section
          className="org-section story-view-hero"
          aria-labelledby="story-view-title"
        >
          <div className="org-container story-view-hero-inner">
            <div className="story-view-content">
              <Link
                className="org-button org-button-ghost story-view-back"
                to={toLocalizedPath('/stories', locale)}
              >
                {t('storiesPage.detail.backToStories')}
              </Link>
              <p className="org-eyebrow">{t('storiesPage.detail.eyebrow')}</p>
              <h1 id="story-view-title">{story.title}</h1>
              <p className="story-view-summary">{story.summary}</p>
              <dl className="story-view-meta">
                <div>
                  <dt>{t('storiesPage.detail.meta.authorLabel')}</dt>
                  <dd>{story.author}</dd>
                </div>
                <div>
                  <dt>{t('storiesPage.detail.meta.countryLabel')}</dt>
                  <dd>{storyCountryName}</dd>
                </div>
                <div>
                  <dt>{t('storiesPage.detail.meta.publishedLabel')}</dt>
                  <dd>{storyPublishedAt}</dd>
                </div>
                <div>
                  <dt>{t('storiesPage.detail.meta.readTimeLabel')}</dt>
                  <dd>
                    {t('storiesPage.detail.meta.readTimeValue', {
                      count: story.readingMinutes,
                    })}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="story-view-visual" aria-hidden="true">
              <img src={storyImageSrc} alt="" loading="eager" decoding="async" />
            </div>
          </div>
        </section>

        <section
          className="org-section org-section-alt"
          aria-labelledby="story-view-body-title"
        >
          <div className="org-container">
            <div className="story-view-layout">
              <div className="story-view-body-card">
                <h2 id="story-view-body-title" className="org-section-heading">
                  {t('storiesPage.detail.bodyTitle')}
                </h2>
                {story.body.map((paragraph, index) => (
                  <p key={`${story.id}-paragraph-${index}`}>{paragraph}</p>
                ))}
              </div>

              <aside
                className="story-view-actions-card"
                aria-labelledby="story-view-actions-title"
              >
                <h2 id="story-view-actions-title" className="org-section-heading">
                  {t('storiesPage.detail.relatedActions.title')}
                </h2>
                <div className="story-view-actions">
                  <Link
                    className="org-button org-button-accent"
                    to={toLocalizedPath('/resources/hotlines', locale)}
                  >
                    {t('storiesPage.detail.relatedActions.resources')}
                  </Link>
                  <Link
                    className="org-button org-button-outline"
                    to={toLocalizedPath('/contact', locale)}
                  >
                    {t('storiesPage.detail.relatedActions.contact')}
                  </Link>
                  <Link
                    className="org-button org-button-ghost"
                    to={toLocalizedPath('/stories', locale)}
                  >
                    {t('storiesPage.detail.relatedActions.allStories')}
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}

export default StoryViewPage
