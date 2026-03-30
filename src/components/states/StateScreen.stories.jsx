import {
  EmptyState,
  ErrorState,
  LoadingState,
  NotFoundState,
  ServerErrorState,
} from './index'
import { MemoryRouter } from 'react-router-dom'

const meta = {
  title: 'States/App Runtime States',
  decorators: [(StoryFn) => <MemoryRouter>{StoryFn()}</MemoryRouter>],
  parameters: {
    layout: 'padded',
  },
}

export default meta

export function Loading() {
  return <LoadingState title="Cargando" message="Estamos preparando la informacion." />
}

export function Empty() {
  return <EmptyState title="Sin contenido" message="Aun no hay elementos para mostrar." />
}

export function Error() {
  return (
    <ErrorState
      title="Ocurrio un error"
      message="No fue posible completar la accion."
      actionLabel="Reintentar"
    />
  )
}

export function NotFound() {
  return (
    <NotFoundState
      title="Pagina no encontrada"
      message="La ruta solicitada no existe."
      actionLabel="Volver al inicio"
      homePath="/"
    />
  )
}

export function ServerError() {
  return (
    <ServerErrorState
      title="Error interno"
      message="El servicio no esta disponible por el momento."
      actionLabel="Reintentar"
    />
  )
}
