import { createBrowserRouter } from 'react-router-dom'
import RouteErrorBoundary from './errors/RouteErrorBoundary'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import ServerErrorPage from './pages/ServerErrorPage'
import StateShowcasePage from './pages/StateShowcasePage'

const sharedChildren = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: 'ux-states',
    element: <StateShowcasePage />,
  },
  {
    path: '500',
    element: <ServerErrorPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
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
