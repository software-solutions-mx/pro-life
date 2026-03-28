import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { trackPageView } from '../../analytics'
import SEOHead from '../../components/SEO/SEOHead'
import { organizationSchema, websiteSchema } from '../../data/schemas'

function RootLayout() {
  const location = useLocation()
  const lastTrackedPathRef = useRef(null)

  useEffect(() => {
    const currentPath = `${location.pathname}${location.search}`

    if (lastTrackedPathRef.current === currentPath) {
      return
    }

    lastTrackedPathRef.current = currentPath
    trackPageView(currentPath, document.title)
  }, [location.pathname, location.search])

  return (
    <>
      <SEOHead schema={[organizationSchema, websiteSchema]} />
      <main aria-label="Contenido principal">
        <Outlet />
      </main>
    </>
  )
}

export default RootLayout
