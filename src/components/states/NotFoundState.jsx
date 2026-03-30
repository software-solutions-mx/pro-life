import { Link } from 'react-router-dom'
import StateScreen from './StateScreen'

function NotFoundState({ title, message, actionLabel, homePath = '/' }) {
  return (
    <StateScreen title={title} message={message} variant="warning" icon="signpost-split">
      <Link to={homePath} className="state-screen-action">
        {actionLabel}
      </Link>
    </StateScreen>
  )
}

export default NotFoundState
