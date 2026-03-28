import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

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
  const { title, message } = getErrorDetails(error)

  return (
    <main aria-label="Error page">
      <h1>{title}</h1>
      <p>{message}</p>
    </main>
  )
}

export default RouteErrorBoundary
