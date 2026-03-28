import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async'
import { I18nextProvider } from 'react-i18next'
import App from './App.jsx'
import { initAnalyticsDebugger, reportWebVitals, restoreConsent } from './analytics'
import i18n from './i18n/config'
import { queryClient } from './lib/query/queryClient'
import { Sentry, initErrorMonitoring } from './monitoring/sentry'
import './assets/scss/theme.scss'

restoreConsent()
initAnalyticsDebugger()
initErrorMonitoring()
reportWebVitals()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <I18nextProvider i18n={i18n} defaultNS="common">
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<div>Loading...</div>}>
            <Sentry.ErrorBoundary fallback={<main aria-label="Application error" />}>
              <App />
            </Sentry.ErrorBoundary>
          </Suspense>
        </QueryClientProvider>
      </I18nextProvider>
    </HelmetProvider>
  </StrictMode>,
)
