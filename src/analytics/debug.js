export function initAnalyticsDebugger() {
  if (!import.meta.env.DEV) return

  window.dataLayer = window.dataLayer || []
  const originalPush = window.dataLayer.push.bind(window.dataLayer)

  window.dataLayer.push = (...args) => {
    const [payload] = args
    if (payload && typeof payload === 'object' && 'event' in payload) {
      console.group(
        `%c[Analytics] ${payload.event}`,
        'color: #0d6efd; font-weight: 600;',
      )
      console.table(payload)
      console.groupEnd()
    }
    return originalPush(...args)
  }
}
