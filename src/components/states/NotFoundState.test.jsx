import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import NotFoundState from './NotFoundState'

function renderNotFound(initialEntry) {
  const router = createMemoryRouter(
    [
      { path: '/:locale/*', element: <NotFoundState /> },
      { path: '/*', element: <NotFoundState /> },
    ],
    { initialEntries: [initialEntry] },
  )

  return render(<RouterProvider router={router} />)
}

describe('NotFoundState', () => {
  it('links back to localized home when locale param exists', () => {
    renderNotFound('/en/does-not-exist')

    expect(
      screen.getByRole('link', { name: 'errors.actions.backToHome' }),
    ).toHaveAttribute('href', '/en')
  })

  it('falls back to default home for unsupported locale param', () => {
    renderNotFound('/xx/does-not-exist')

    expect(
      screen.getByRole('link', { name: 'errors.actions.backToHome' }),
    ).toHaveAttribute('href', '/')
  })
})
