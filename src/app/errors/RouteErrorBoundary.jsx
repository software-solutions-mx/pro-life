import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'
import { ErrorState, NotFoundState, ServerErrorState } from '../../components/states'

function getErrorDetails(error) {
  if (isRouteErrorResponse(error)) {
    return {
      title: `${error.status} ${error.statusText}`,
      message:
        typeof error.data === 'string'
          ? error.data
          : 'La ruta solicitada no pudo cargarse.',
    }
  }

  if (error instanceof Error) {
    return {
      title: 'Unexpected Error',
      message: error.message,
    }
  }

  return {
    title: 'Unexpected Error',
    message: 'Something went wrong while rendering this route.',
  }
}

function RouteErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFoundState />
    }

    if (error.status >= 500) {
      return <ServerErrorState actionLabel="Reintentar" onAction={() => navigate(0)} />
    }
  }

  const { message } = getErrorDetails(error)

  return (
    <ErrorState
      message={message}
      actionLabel="Volver al inicio"
      onAction={() => navigate('/')}
    />
  )
}

export default RouteErrorBoundary
