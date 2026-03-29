import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import SEOHead from '../../components/SEO/SEOHead'
import {
  EmptyState,
  ErrorState,
  LoadingState,
  NotFoundState,
  ServerErrorState,
} from '../../components/states'

function StateShowcasePage() {
  const { t } = useTranslation()
  const location = useLocation()

  return (
    <>
      <SEOHead
        title={t('seo.stateShowcase.title')}
        description={t('seo.stateShowcase.description')}
        path={location.pathname}
        noindex
      />
      <div className="state-showcase">
        <LoadingState />
        <EmptyState />
        <ErrorState />
        <NotFoundState />
        <ServerErrorState />
      </div>
    </>
  )
}

export default StateShowcasePage
