import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import NotFoundState from './NotFoundState'

function renderNotFound({ initialEntry, homePath = '/' }) {
  const router = createMemoryRouter(
    [
      {
        path: '/*',
        element: (
          <NotFoundState
            title="errors.notFound.title"
            message="errors.notFound.message"
            actionLabel="errors.actions.backToHome"
            homePath={homePath}
          />
        ),
      },
    ],
    { initialEntries: [initialEntry] },
  )

  return render(<RouterProvider router={router} />)
}

describe('NotFoundState', () => {
  it('renders action link using provided home path', () => {
    renderNotFound({ initialEntry: '/en/does-not-exist', homePath: '/en' })

    expect(
      screen.getByRole('link', { name: 'errors.actions.backToHome' }),
    ).toHaveAttribute('href', '/en')
  })

  it('uses default home path when no path is provided', () => {
    renderNotFound({ initialEntry: '/does-not-exist' })

    expect(
      screen.getByRole('link', { name: 'errors.actions.backToHome' }),
    ).toHaveAttribute('href', '/')
  })
})
