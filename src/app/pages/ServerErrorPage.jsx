import { useNavigate } from 'react-router-dom'
import ServerErrorState from '../../components/states/ServerErrorState'

function ServerErrorPage() {
  const navigate = useNavigate()

  return (
    <ServerErrorState
      actionLabel="Reintentar"
      onAction={() => {
        navigate(0)
      }}
    />
  )
}

export default ServerErrorPage
