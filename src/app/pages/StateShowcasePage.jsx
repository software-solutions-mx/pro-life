import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import SEOHead from '../../components/SEO/SEOHead'
import { getLocalizedHomePath } from '../utils/getLocalizedHomePath'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  NotFoundState,
  ServerErrorState,
} from '../../components/states'

function StateShowcasePage() {
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
        title={t('seo.stateShowcase.title')}
        description={t('seo.stateShowcase.description')}
        path={location.pathname}
        noindex
      />
      <div className="state-showcase">
        <LoadingState
          title={t('errors.loading.title')}
          message={t('errors.loading.message')}
        />
        <EmptyState title={t('states.empty.title')} message={t('states.empty.message')} />
        <ErrorState
          title={t('errors.general.title')}
          message={t('errors.general.message')}
          actionLabel={t('errors.actions.retry')}
        />
        <NotFoundState
          title={t('errors.notFound.title')}
          message={t('errors.notFound.message')}
          actionLabel={t('errors.actions.backToHome')}
          homePath={homePath}
        />
        <ServerErrorState
          title={t('errors.server.title')}
          message={t('errors.server.message')}
          actionLabel={t('errors.actions.retry')}
        />
      </div>
    </>
  )
}

export default StateShowcasePage
