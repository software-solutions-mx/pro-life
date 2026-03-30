import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import RouteErrorBoundary from './errors/RouteErrorBoundary'
import RootLayout from './layouts/RootLayout'
import RouteLoadingFallback from './components/RouteLoadingFallback'

function withRouteSuspense(importer) {
  const LazyRouteComponent = lazy(importer)

  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <LazyRouteComponent />
    </Suspense>
  )
}

const sharedChildren = [
  {
    index: true,
    element: withRouteSuspense(() => import('./pages/HomePage')),
  },
  {
    path: 'about',
    element: withRouteSuspense(() => import('./pages/AboutPage')),
  },
  {
    path: 'options',
    element: withRouteSuspense(() => import('./pages/OptionsPage')),
  },
  {
    path: 'resources',
    element: withRouteSuspense(() => import('./pages/ResourcesPage')),
  },
  {
    path: 'resources/:topic',
    element: withRouteSuspense(() => import('./pages/ResourceTopicPage')),
  },
  {
    path: 'testimonials',
    element: withRouteSuspense(() => import('./pages/StoriesPage')),
  },
  {
    path: 'testimonials/:storyId',
    element: withRouteSuspense(() => import('./pages/StoryViewPage')),
  },
  {
    path: 'stories',
    element: withRouteSuspense(() => import('./pages/StoriesPage')),
  },
  {
    path: 'stories/:storyId',
    element: withRouteSuspense(() => import('./pages/StoryViewPage')),
  },
  {
    path: 'faq',
    element: withRouteSuspense(() => import('./pages/FAQPage')),
  },
  {
    path: 'contact',
    element: withRouteSuspense(() => import('./pages/ContactPage')),
  },
  {
    path: 'legal/:policySlug',
    element: withRouteSuspense(() => import('./pages/LegalPage')),
  },
  {
    path: 'ux-states',
    element: withRouteSuspense(() => import('./pages/StateShowcasePage')),
  },
  {
    path: '500',
    element: withRouteSuspense(() => import('./pages/ServerErrorPage')),
  },
  {
    path: '*',
    element: withRouteSuspense(() => import('./pages/NotFoundPage')),
  },
]

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: sharedChildren,
  },
  {
    path: '/:locale',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: sharedChildren,
  },
])

export default router
