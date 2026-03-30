import { fireEvent, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import RouteErrorBoundary from './RouteErrorBoundary'

function renderBoundary(initialEntry = '/en/fail') {
  const router = createMemoryRouter(
    [
      {
        path: '/:locale',
        element: <p>home screen</p>,
      },
      {
        path: '/:locale/fail',
        loader: () => {
          throw new Error('boom')
        },
        element: <p>unreachable</p>,
        errorElement: <RouteErrorBoundary />,
      },
    ],
    { initialEntries: [initialEntry] },
  )

  return render(<RouterProvider router={router} />)
}

describe('RouteErrorBoundary', () => {
  it('navigates back to localized home from error action', async () => {
    renderBoundary('/en/fail')

    const backButton = await screen.findByRole('button', {
      name: 'errors.actions.backToHome',
    })
    fireEvent.click(backButton)

    expect(await screen.findByText('home screen')).toBeInTheDocument()
  })
})
