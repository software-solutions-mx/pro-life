import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import SEOHead from '../../components/SEO/SEOHead'
import storiesHeroImage from '../../assets/images/support-images/support40.png'
import storyImageNewborn from '../../assets/images/support-images/support41.png'
import storyImageHopeHand from '../../assets/images/support-images/support48.png'
import storyImageGlow from '../../assets/images/support-images/support54.png'
import storyImageBabyHand from '../../assets/images/support-images/support57.png'
import { SUPPORTED_COUNTRY_CODES } from '../../data/countries'
import { getStoriesByCountry } from '../../data/stories/storyCatalog'
import {
  STORY_PUBLICATION_PREFERENCES,
  storySubmissionFormSchema,
  useStorySubmission,
} from '../../features/storySubmission'
import { normalizeLocale } from '../../i18n/locales'
import i18n from '../../i18n/config'
import { useCountryPreference } from '../../i18n/hooks/useCountryPreference'
import { toLocalizedPath } from '../../seo/siteConfig'

const STORY_IMAGES = {
  newborn: storyImageNewborn,
  hopeHand: storyImageHopeHand,
  glow: storyImageGlow,
  babyHand: storyImageBabyHand,
}

const INITIAL_STORY_FORM = {
  title: '',
  authorName: '',
  email: '',
  storyBody: '',
  publicationPreference: STORY_PUBLICATION_PREFERENCES[0],
  allowFollowUp: true,
  consentAccepted: false,
}

const STORY_SUBMISSION_ERROR_FIELD_MAP = {
  author_name: 'authorName',
  publication_preference: 'publicationPreference',
  allow_follow_up: 'allowFollowUp',
  consent_accepted: 'consentAccepted',
  body: 'storyBody',
}

function toInitials(value, fallbackValue) {
  if (typeof value !== 'string') {
    return fallbackValue
  }

  const words = value.trim().split(/\s+/).filter(Boolean).slice(0, 2)

  if (words.length === 0) {
    return fallbackValue
  }

  return `${words.map((word) => word[0]?.toUpperCase() ?? '').join('')}.`
}

function StoriesPage() {
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
  const [storyForm, setStoryForm] = useState(INITIAL_STORY_FORM)
  const [storyFormErrors, setStoryFormErrors] = useState({})
  const [submissionState, setSubmissionState] = useState('idle')
  const storySubmissionMutation = useStorySubmission()

  const filteredStories = useMemo(
    () => getStoriesByCountry(activeCountryCode),
    [activeCountryCode],
  )
  const publicationOptions = useMemo(
    () =>
      STORY_PUBLICATION_PREFERENCES.map((option) => ({
        value: option,
        label: t(`storiesPage.submit.form.publicationOptions.${option}`),
      })),
    [t],
  )
  const previewAuthor = useMemo(() => {
    const normalizedAuthorName = storyForm.authorName.trim()

    if (storyForm.publicationPreference === 'anonymous') {
      return t('storiesPage.submit.preview.authorAnonymous')
    }

    if (storyForm.publicationPreference === 'initials') {
      return toInitials(
        normalizedAuthorName,
        t('storiesPage.submit.preview.initialsFallback'),
      )
    }

    if (normalizedAuthorName.length === 0) {
      return t('storiesPage.submit.preview.authorFallback')
    }

    return normalizedAuthorName.split(/\s+/)[0]
  }, [storyForm.authorName, storyForm.publicationPreference, t])
  const previewTitle = storyForm.title.trim().length
    ? storyForm.title
    : t('storiesPage.submit.preview.titleFallback')
  const previewBody = storyForm.storyBody.trim().length
    ? storyForm.storyBody
    : t('storiesPage.submit.preview.bodyFallback')
  const storyBodyCharacterCount = storyForm.storyBody.length

  const handleStoryFieldChange = (event) => {
    const { name, value, type, checked } = event.target
    const nextValue = type === 'checkbox' ? checked : value

    setStoryForm((current) => ({
      ...current,
      [name]: nextValue,
    }))

    setStoryFormErrors((current) => {
      if (!current[name]) {
        return current
      }

      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })
  }

  const handleStorySubmit = async (event) => {
    event.preventDefault()
    setSubmissionState('idle')

    const parsedStoryForm = storySubmissionFormSchema.safeParse(storyForm)
    if (!parsedStoryForm.success) {
      const nextErrors = {}
      for (const issue of parsedStoryForm.error.issues) {
        const fieldName = issue.path[0]
        if (typeof fieldName === 'string' && !nextErrors[fieldName]) {
          nextErrors[fieldName] = issue.message
        }
      }
      setStoryFormErrors(nextErrors)
      return
    }

    const trimmedEmail = parsedStoryForm.data.email?.trim()
    setStoryFormErrors({})

    try {
      await storySubmissionMutation.mutateAsync({
        story_submission: {
          title: parsedStoryForm.data.title,
          author_name: parsedStoryForm.data.authorName,
          ...(trimmedEmail ? { email: trimmedEmail } : {}),
          body: parsedStoryForm.data.storyBody,
          publication_preference: parsedStoryForm.data.publicationPreference,
          allow_follow_up: parsedStoryForm.data.allowFollowUp,
          consent_accepted: parsedStoryForm.data.consentAccepted,
          country_code: activeCountryCode,
          locale,
          source_path: location.pathname,
        },
      })

      setSubmissionState('success')
      setStoryForm(INITIAL_STORY_FORM)
    } catch (error) {
      setSubmissionState('error')

      const errorDetails = error?.data?.errors
      if (errorDetails && typeof errorDetails === 'object') {
        const nextErrors = {}
        for (const [fieldKey, fieldMessages] of Object.entries(errorDetails)) {
          if (Array.isArray(fieldMessages) && fieldMessages.length > 0) {
            const normalizedFieldKey =
              STORY_SUBMISSION_ERROR_FIELD_MAP[fieldKey] ?? fieldKey
            nextErrors[normalizedFieldKey] = fieldMessages[0]
          }
        }

        if (Object.keys(nextErrors).length > 0) {
          setStoryFormErrors((current) => ({
            ...current,
            ...nextErrors,
          }))
        }
      }
    }
  }

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
              <p className="stories-country-badge">
                {t('storiesPage.countrySummary', { country: selectedCountryName })}
              </p>
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
                {t('storiesPage.gallery.title', { country: selectedCountryName })}
              </h2>
              <p className="org-section-intro">
                {t('storiesPage.gallery.description', { country: selectedCountryName })}
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
                        <Link
                          className="org-button org-button-outline stories-card-link"
                          to={toLocalizedPath(`/stories/${story.id}`, locale)}
                        >
                          {t('storiesPage.gallery.readStoryCta')}
                        </Link>
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

        <section
          className="org-section stories-submit-section"
          aria-labelledby="stories-submit-title"
        >
          <div className="org-container">
            <div className="stories-submit-shell">
              <div className="stories-submit-form-card">
                <h2 id="stories-submit-title" className="org-section-heading">
                  {t('storiesPage.submit.title')}
                </h2>
                <p className="org-section-intro">{t('storiesPage.submit.description')}</p>
                <p className="stories-submit-country-note">
                  {t('storiesPage.submit.countryNote', { country: selectedCountryName })}
                </p>

                {submissionState === 'success' ? (
                  <p className="stories-submit-status is-success" role="status">
                    {t('storiesPage.submit.status.success')}
                  </p>
                ) : null}

                {submissionState === 'error' ? (
                  <p className="stories-submit-status is-error" role="alert">
                    {t('storiesPage.submit.status.error')}
                  </p>
                ) : null}

                <form
                  className="stories-submit-form"
                  noValidate
                  onSubmit={handleStorySubmit}
                >
                  <div className="stories-submit-field-grid">
                    <div className="stories-submit-field">
                      <label htmlFor="story-title">
                        {t('storiesPage.submit.form.fields.title.label')}
                      </label>
                      <input
                        id="story-title"
                        name="title"
                        value={storyForm.title}
                        onChange={handleStoryFieldChange}
                      />
                      {storyFormErrors.title ? (
                        <p className="stories-submit-field-error" role="alert">
                          {t(storyFormErrors.title)}
                        </p>
                      ) : null}
                    </div>

                    <div className="stories-submit-field">
                      <label htmlFor="story-author-name">
                        {t('storiesPage.submit.form.fields.authorName.label')}
                      </label>
                      <input
                        id="story-author-name"
                        name="authorName"
                        autoComplete="name"
                        value={storyForm.authorName}
                        onChange={handleStoryFieldChange}
                      />
                      {storyFormErrors.authorName ? (
                        <p className="stories-submit-field-error" role="alert">
                          {t(storyFormErrors.authorName)}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="stories-submit-field-grid">
                    <div className="stories-submit-field">
                      <label htmlFor="story-email">
                        {t('storiesPage.submit.form.fields.email.label')}
                      </label>
                      <input
                        id="story-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={storyForm.email}
                        onChange={handleStoryFieldChange}
                      />
                      {storyFormErrors.email ? (
                        <p className="stories-submit-field-error" role="alert">
                          {t(storyFormErrors.email)}
                        </p>
                      ) : null}
                    </div>

                    <div className="stories-submit-field">
                      <label htmlFor="story-publication-preference">
                        {t('storiesPage.submit.form.fields.publicationPreference.label')}
                      </label>
                      <select
                        id="story-publication-preference"
                        name="publicationPreference"
                        value={storyForm.publicationPreference}
                        onChange={handleStoryFieldChange}
                      >
                        {publicationOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      {storyFormErrors.publicationPreference ? (
                        <p className="stories-submit-field-error" role="alert">
                          {t(storyFormErrors.publicationPreference)}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="stories-submit-field">
                    <label htmlFor="story-body">
                      {t('storiesPage.submit.form.fields.storyBody.label')}
                    </label>
                    <textarea
                      id="story-body"
                      name="storyBody"
                      rows={8}
                      value={storyForm.storyBody}
                      onChange={handleStoryFieldChange}
                    />
                    <p className="stories-submit-character-count">
                      {t('storiesPage.submit.form.characterCount', {
                        count: storyBodyCharacterCount,
                      })}
                    </p>
                    {storyFormErrors.storyBody ? (
                      <p className="stories-submit-field-error" role="alert">
                        {t(storyFormErrors.storyBody)}
                      </p>
                    ) : null}
                  </div>

                  <label className="stories-submit-checkbox">
                    <input
                      type="checkbox"
                      name="allowFollowUp"
                      checked={storyForm.allowFollowUp}
                      onChange={handleStoryFieldChange}
                    />
                    <span>{t('storiesPage.submit.form.fields.allowFollowUp.label')}</span>
                  </label>

                  <label className="stories-submit-checkbox">
                    <input
                      type="checkbox"
                      name="consentAccepted"
                      checked={storyForm.consentAccepted}
                      onChange={handleStoryFieldChange}
                    />
                    <span>
                      {t('storiesPage.submit.form.fields.consentAccepted.label')}
                    </span>
                  </label>
                  {storyFormErrors.consentAccepted ? (
                    <p className="stories-submit-field-error" role="alert">
                      {t(storyFormErrors.consentAccepted)}
                    </p>
                  ) : null}

                  <p className="stories-submit-disclaimer">
                    {t('storiesPage.submit.form.disclaimer')}
                  </p>
                  <button
                    type="submit"
                    className="org-button org-button-accent stories-submit-button"
                    disabled={storySubmissionMutation.isPending}
                  >
                    {storySubmissionMutation.isPending
                      ? t('storiesPage.submit.form.submit.pending')
                      : t('storiesPage.submit.form.submit.idle')}
                  </button>
                </form>
              </div>

              <aside
                className="stories-submit-preview-card"
                aria-labelledby="story-preview-title"
              >
                <p className="org-eyebrow">{t('storiesPage.submit.preview.eyebrow')}</p>
                <h3 id="story-preview-title">{previewTitle}</h3>
                <blockquote>{previewBody}</blockquote>
                <p className="stories-submit-preview-author">{previewAuthor}</p>
                <p className="stories-submit-preview-meta">
                  {t('storiesPage.submit.preview.meta', {
                    country: selectedCountryName,
                    publication: t(
                      `storiesPage.submit.form.publicationOptions.${storyForm.publicationPreference}`,
                    ),
                  })}
                </p>
              </aside>
            </div>
          </div>
        </section>
      </article>
    </>
  )
}

export default StoriesPage
