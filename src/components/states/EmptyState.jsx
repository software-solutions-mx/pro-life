import { useTranslation } from 'react-i18next'
import StateScreen from './StateScreen'

function EmptyState({ title, message }) {
  const { t } = useTranslation()

  return (
    <StateScreen
      title={title ?? t('states.empty.title')}
      message={message ?? t('states.empty.message')}
      variant="light"
      icon="inbox"
    />
  )
}

export default EmptyState
