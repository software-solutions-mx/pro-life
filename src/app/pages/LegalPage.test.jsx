import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import LegalPage from './LegalPage'

function renderLegalPage(initialEntry = '/en/legal/privacy-policy') {
  const router = createMemoryRouter(
    [
      { path: '/legal/:policySlug', element: <LegalPage /> },
      { path: '/:locale/legal/:policySlug', element: <LegalPage /> },
    ],
    { initialEntries: [initialEntry] },
  )

  return render(<RouterProvider router={router} />)
}

describe('LegalPage', () => {
  it('renders legal content and localized actions', () => {
    renderLegalPage('/en/legal/privacy-policy')

    expect(
      screen.getByRole('heading', { level: 1, name: 'legal.privacy' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'legalPages.actions.resources' }),
    ).toHaveAttribute('href', '/en/resources/hotlines')
    expect(
      screen.getByRole('link', { name: 'legalPages.actions.contact' }),
    ).toHaveAttribute('href', '/en/contact')
    expect(document.title).toBe('seo.legalPages.privacy.title')
  })

  it('shows not found state for unknown legal slug', () => {
    renderLegalPage('/en/legal/unknown')

    expect(screen.getByText('errors.notFound.title')).toBeInTheDocument()
    expect(screen.getByText('errors.notFound.message')).toBeInTheDocument()
  })
})
