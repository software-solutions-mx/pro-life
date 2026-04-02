import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import SEOHead from '../../components/SEO/SEOHead'
import NotFoundState from '../../components/states/NotFoundState'
import { getLocalizedHomePath } from '../utils/getLocalizedHomePath'

function NotFoundPage() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const { locale: localeParam } = useParams()
  const homePath = getLocalizedHomePath({
    localeParam,
    resolvedLanguage: i18n.resolvedLanguage,
    language: i18n.language,
  })

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
        homePath={homePath}
      />
    </>
  )
}

export default NotFoundPage
