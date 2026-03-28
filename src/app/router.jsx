import { createBrowserRouter } from 'react-router-dom'
import RouteErrorBoundary from './errors/RouteErrorBoundary'
import RootLayout from './layouts/RootLayout'
import HomePage from './pages/HomePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
])

export default router
