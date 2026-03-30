import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useParams } from 'react-router-dom'
import SEOHead from '../../components/SEO/SEOHead'
import contactHeroImage from '../../assets/images/support-images/support26.png'
import { SUPPORTED_COUNTRY_CODES } from '../../data/countries'
import {
  CONTACT_REASON_VALUES,
  contactFormSchema,
  useContactForm,
} from '../../features/contact'
import i18n from '../../i18n/config'
import { useCountryPreference } from '../../i18n/hooks/useCountryPreference'
import { normalizeLocale } from '../../i18n/locales'
import { toLocalizedPath } from '../../seo/siteConfig'

const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  phone: '',
  reason: CONTACT_REASON_VALUES[0],
  message: '',
}

function ContactPage() {
  const { t } = useTranslation()
  const location = useLocation()
  const { locale: localeParam } = useParams()
  const locale = normalizeLocale(localeParam ?? i18n.resolvedLanguage ?? i18n.language)
  const { countryCode } = useCountryPreference(SUPPORTED_COUNTRY_CODES, locale)
  const selectedCountryName = t(`countries.${countryCode}`, {
    defaultValue: countryCode,
  })

  const [formData, setFormData] = useState(INITIAL_FORM_STATE)
  const [formErrors, setFormErrors] = useState({})
  const [submitState, setSubmitState] = useState('idle')
  const submitContactMutation = useContactForm()

  const reasonOptions = useMemo(
    () =>
      CONTACT_REASON_VALUES.map((reason) => ({
        value: reason,
        label: t(`contactPage.form.reasons.${reason}`),
      })),
    [t],
  )

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
    setFormErrors((current) => {
      if (!current[name]) {
        return current
      }

      const nextErrors = { ...current }
      delete nextErrors[name]
      return nextErrors
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitState('idle')

    const parsedForm = contactFormSchema.safeParse(formData)
    if (!parsedForm.success) {
      const nextErrors = {}
      for (const issue of parsedForm.error.issues) {
        const fieldName = issue.path[0]
        if (typeof fieldName === 'string' && !nextErrors[fieldName]) {
          nextErrors[fieldName] = issue.message
        }
      }
      setFormErrors(nextErrors)
      return
    }

    setFormErrors({})
    const trimmedPhone = parsedForm.data.phone?.trim()

    try {
      await submitContactMutation.mutateAsync({
        contact_message: {
          name: parsedForm.data.name,
          email: parsedForm.data.email,
          ...(trimmedPhone ? { phone: trimmedPhone } : {}),
          reason: parsedForm.data.reason,
          message: parsedForm.data.message,
          country_code: countryCode,
          locale,
          source_path: location.pathname,
        },
      })
      setSubmitState('success')
      setFormData(INITIAL_FORM_STATE)
    } catch (error) {
      setSubmitState('error')
      const nextErrors = {}
      const errorDetails = error?.data?.errors

      if (errorDetails && typeof errorDetails === 'object') {
        for (const [key, value] of Object.entries(errorDetails)) {
          if (Array.isArray(value) && value.length > 0) {
            nextErrors[key] = value[0]
          }
        }
      }

      if (Object.keys(nextErrors).length > 0) {
        setFormErrors((current) => ({
          ...current,
          ...nextErrors,
        }))
      }
    }
  }

  const isSubmitting = submitContactMutation.isPending
  const hasSubmissionError = submitState === 'error'
  const hasSubmissionSuccess = submitState === 'success'

  return (
    <>
      <SEOHead
        title={t('seo.contact.title')}
        description={t('seo.contact.description')}
        path={location.pathname}
      />
      <article className="org-page contact-page">
        <section
          className="org-section contact-hero"
          aria-labelledby="contact-page-title"
        >
          <div className="org-container contact-hero-inner">
            <div className="contact-hero-content">
              <p className="org-eyebrow">{t('contactPage.hero.eyebrow')}</p>
              <h1 id="contact-page-title">{t('contactPage.hero.title')}</h1>
              <p>{t('contactPage.hero.description')}</p>
              <p className="contact-country-badge">
                {t('contactPage.hero.countryLegend', { country: selectedCountryName })}
              </p>
              <div className="contact-hero-actions">
                <Link
                  className="org-button org-button-accent"
                  to={toLocalizedPath('/resources/hotlines', locale)}
                >
                  {t('contactPage.hero.primaryCta')}
                </Link>
                <Link
                  className="org-button org-button-ghost"
                  to={toLocalizedPath('/resources', locale)}
                >
                  {t('contactPage.hero.secondaryCta')}
                </Link>
              </div>
            </div>
            <div className="contact-hero-visual" aria-hidden="true">
              <img src={contactHeroImage} alt="" loading="eager" decoding="async" />
            </div>
          </div>
        </section>

        <section
          className="org-section org-section-alt"
          aria-labelledby="contact-form-title"
        >
          <div className="org-container contact-grid">
            <div className="contact-form-shell">
              <h2 id="contact-form-title" className="org-section-heading">
                {t('contactPage.form.title')}
              </h2>
              <p className="org-section-intro">{t('contactPage.form.description')}</p>

              {hasSubmissionSuccess ? (
                <p className="contact-form-status is-success" role="status">
                  {t('contactPage.form.status.success')}
                </p>
              ) : null}

              {hasSubmissionError ? (
                <p className="contact-form-status is-error" role="alert">
                  {t('contactPage.form.status.error')}
                </p>
              ) : null}

              <form className="contact-form" noValidate onSubmit={handleSubmit}>
                <div className="contact-field-grid">
                  <div className="contact-field">
                    <label htmlFor="contact-name">
                      {t('contactPage.form.fields.name.label')}
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                    {formErrors.name ? (
                      <p className="contact-field-error" role="alert">
                        {t(formErrors.name)}
                      </p>
                    ) : null}
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contact-email">
                      {t('contactPage.form.fields.email.label')}
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    {formErrors.email ? (
                      <p className="contact-field-error" role="alert">
                        {t(formErrors.email)}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="contact-field-grid">
                  <div className="contact-field">
                    <label htmlFor="contact-phone">
                      {t('contactPage.form.fields.phone.label')}
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    {formErrors.phone ? (
                      <p className="contact-field-error" role="alert">
                        {t(formErrors.phone)}
                      </p>
                    ) : null}
                  </div>

                  <div className="contact-field">
                    <label htmlFor="contact-reason">
                      {t('contactPage.form.fields.reason.label')}
                    </label>
                    <select
                      id="contact-reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                    >
                      {reasonOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {formErrors.reason ? (
                      <p className="contact-field-error" role="alert">
                        {t(formErrors.reason)}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="contact-field">
                  <label htmlFor="contact-message">
                    {t('contactPage.form.fields.message.label')}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                  />
                  {formErrors.message ? (
                    <p className="contact-field-error" role="alert">
                      {t(formErrors.message)}
                    </p>
                  ) : null}
                </div>

                <p className="contact-form-disclaimer">
                  {t('contactPage.form.disclaimer')}
                </p>
                <button
                  type="submit"
                  className="org-button org-button-accent contact-submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t('contactPage.form.submit.pending')
                    : t('contactPage.form.submit.idle')}
                </button>
              </form>
            </div>

            <aside
              className="contact-support-shell"
              aria-labelledby="contact-support-title"
            >
              <h2 id="contact-support-title" className="org-section-heading">
                {t('contactPage.support.title')}
              </h2>
              <p className="org-section-intro">{t('contactPage.support.description')}</p>
              <ul className="contact-support-list">
                <li>
                  <span>{t('contactPage.support.emailLabel')}</span>
                  <a href={`mailto:${t('contactPage.support.emailValue')}`}>
                    {t('contactPage.support.emailValue')}
                  </a>
                </li>
                <li>
                  <span>{t('contactPage.support.responseTimeLabel')}</span>
                  <p>{t('contactPage.support.responseTimeValue')}</p>
                </li>
                <li>
                  <span>{t('contactPage.support.regionLabel')}</span>
                  <p>{t('contactPage.support.regionValue')}</p>
                </li>
              </ul>
              <div className="contact-support-actions">
                <Link
                  className="org-button org-button-ghost"
                  to={toLocalizedPath('/resources/hotlines', locale)}
                >
                  {t('contactPage.support.hotlineCta')}
                </Link>
                <Link
                  className="org-button org-button-outline"
                  to={toLocalizedPath('/stories', locale)}
                >
                  {t('contactPage.support.storyCta')}
                </Link>
              </div>
              <p className="contact-support-consent">
                {t('contactPage.support.storyConsent')}
              </p>
            </aside>
          </div>
        </section>
      </article>
    </>
  )
}

export default ContactPage
