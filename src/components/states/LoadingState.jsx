import StateScreen from './StateScreen'

function LoadingState({ title, message }) {
  return (
    <StateScreen title={title} message={message} variant="info" icon="hourglass-split" />
  )
}

export default LoadingState
