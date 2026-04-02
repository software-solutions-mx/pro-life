import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  isRouteErrorResponse,
  useNavigate,
  useParams,
  useRouteError,
} from 'react-router-dom'
import { ErrorState, NotFoundState, ServerErrorState } from '../../components/states'
import { IS_DEV } from '../../config/env'
import { captureException } from '../../monitoring/sentry'
import { getLocalizedHomePath } from '../utils/getLocalizedHomePath'

function getErrorDetails(error, t) {
  if (isRouteErrorResponse(error)) {
    return {
      message: typeof error.data === 'string' ? error.data : t('errors.route.notLoaded'),
    }
  }

  if (error instanceof Error) {
    return {
      message: IS_DEV ? error.message : t('errors.route.unexpectedTryAgain'),
    }
  }

  return {
    message: t('errors.route.renderFailed'),
  }
}

function RouteErrorBoundary() {
  const { t, i18n } = useTranslation()
  const error = useRouteError()
  const navigate = useNavigate()
  const { locale: localeParam } = useParams()
  const homePath = getLocalizedHomePath({
    localeParam,
    resolvedLanguage: i18n.resolvedLanguage,
    language: i18n.language,
  })

  useEffect(() => {
    if (isRouteErrorResponse(error)) {
      if (error.status >= 500) {
        captureException(
          new Error(`RouteErrorResponse ${error.status}: ${error.statusText}`),
          {
            tags: { area: 'router', kind: 'response' },
            extra: {
              status: error.status,
              statusText: error.statusText,
              data: error.data,
            },
          },
        )
      }
      return
    }

    if (error instanceof Error) {
      captureException(error, {
        tags: { area: 'router', kind: 'exception' },
      })
    }
  }, [error])

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <NotFoundState
          title={t('errors.notFound.title')}
          message={t('errors.notFound.message')}
          actionLabel={t('errors.actions.backToHome')}
          homePath={homePath}
        />
      )
    }

    if (error.status >= 500) {
      return (
        <ServerErrorState
          title={t('errors.server.title')}
          message={t('errors.server.message')}
          actionLabel={t('errors.actions.retry')}
          onAction={() => navigate(0)}
        />
      )
    }
  }

  const { message } = getErrorDetails(error, t)

  return (
    <ErrorState
      title={t('errors.general.title')}
      message={message}
      actionLabel={t('errors.actions.backToHome')}
      onAction={() => navigate(homePath)}
    />
  )
}

export default RouteErrorBoundary
