import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { isSupportedLocale, normalizeLocale } from '../../i18n/locales'
import { toLocalizedPath } from '../../seo/siteConfig'
import StateScreen from './StateScreen'

function NotFoundState() {
  const { t, i18n } = useTranslation()
  const { locale: localeParam } = useParams()
  const resolvedLocale = normalizeLocale(
    localeParam ?? i18n.resolvedLanguage ?? i18n.language,
  )
  const homePath = toLocalizedPath(
    '/',
    isSupportedLocale(resolvedLocale) ? resolvedLocale : undefined,
  )

  return (
    <StateScreen
      title={t('errors.notFound.title')}
      message={t('errors.notFound.message')}
      variant="warning"
      icon="signpost-split"
    >
      <Link to={homePath} className="state-screen-action">
        {t('errors.actions.backToHome')}
      </Link>
    </StateScreen>
  )
}

export default NotFoundState
