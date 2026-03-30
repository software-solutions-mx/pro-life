import StateScreen from './StateScreen'

function ServerErrorState({ title, message, actionLabel, onAction }) {
  return (
    <StateScreen
      title={title}
      message={message}
      variant="danger"
      icon="cpu"
      actionLabel={actionLabel}
      onAction={onAction}
    />
  )
}

export default ServerErrorState
