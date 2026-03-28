import {
  EmptyState,
  ErrorState,
  LoadingState,
  NotFoundState,
  ServerErrorState,
} from '../../components/states'

function StateShowcasePage() {
  return (
    <div className="py-4 d-flex flex-column gap-4">
      <LoadingState />
      <EmptyState />
      <ErrorState />
      <NotFoundState />
      <ServerErrorState />
    </div>
  )
}

export default StateShowcasePage
