import * as Sentry from '@sentry/react'
import {
  APP_ENV,
  APP_VERSION,
  IS_DEV,
  IS_PROD,
  SENTRY_DSN,
  SENTRY_ENVIRONMENT,
  SENTRY_RELEASE,
  SENTRY_TRACES_SAMPLE_RATE,
} from '../config/env'

const IS_SENTRY_CONFIGURED =
  typeof SENTRY_DSN === 'string' && SENTRY_DSN.trim().length > 0

export function initErrorMonitoring() {
  if (!IS_PROD || !IS_SENTRY_CONFIGURED) {
    return
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: SENTRY_ENVIRONMENT ?? APP_ENV,
    release: SENTRY_RELEASE || APP_VERSION,
    tracesSampleRate: SENTRY_TRACES_SAMPLE_RATE,
    beforeSend(event) {
      if (event.request?.headers) {
        delete event.request.headers.Authorization
        delete event.request.headers['X-Client-Secret']
        delete event.request.headers['X-CSRF-Token']
      }

      return event
    },
  })
}

export function captureException(error, context = {}) {
  if (!IS_SENTRY_CONFIGURED) {
    if (IS_DEV) {
      console.error('[monitoring] Exception captured', error, context)
    }
    return
  }

  Sentry.captureException(error, {
    tags: context.tags,
    extra: context.extra,
  })
}

export { Sentry }
