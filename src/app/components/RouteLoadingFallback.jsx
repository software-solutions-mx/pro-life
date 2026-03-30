import { useTranslation } from 'react-i18next'
import LoadingState from '../../components/states/LoadingState'

function RouteLoadingFallback() {
  const { t, i18n } = useTranslation('common', { useSuspense: false })
  const hasCommonNamespace =
    typeof i18n?.hasLoadedNamespace === 'function'
      ? i18n.hasLoadedNamespace('common')
      : true

  return (
    <LoadingState
      title={hasCommonNamespace ? t('errors.loading.title') : ''}
      message={hasCommonNamespace ? t('errors.loading.message') : ''}
    />
  )
}

export default RouteLoadingFallback
