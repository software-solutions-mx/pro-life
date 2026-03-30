import StateScreen from './StateScreen'

function ErrorState({ title, message, actionLabel, onAction }) {
  return (
    <StateScreen
      title={title}
      message={message}
      variant="danger"
      icon="exclamation-triangle"
      actionLabel={actionLabel}
      onAction={onAction}
    />
  )
}

export default ErrorState
