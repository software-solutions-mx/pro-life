import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import SEOHead from '../../components/SEO/SEOHead'
import ServerErrorState from '../../components/states/ServerErrorState'

function ServerErrorPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <>
      <SEOHead
        title={t('seo.serverError.title')}
        description={t('seo.serverError.description')}
        path={location.pathname}
        noindex
      />
      <ServerErrorState
        title={t('errors.server.title')}
        message={t('errors.server.message')}
        actionLabel={t('errors.actions.retry')}
        onAction={() => {
          navigate(0)
        }}
      />
    </>
  )
}

export default ServerErrorPage
