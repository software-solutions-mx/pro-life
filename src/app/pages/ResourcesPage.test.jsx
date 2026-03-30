import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { COUNTRY_PREFERENCE_STORAGE_KEY } from '../../i18n/hooks/useCountryPreference'
import ResourcesPage from './ResourcesPage'

function renderResourcesPage(initialEntry = '/resources') {
  const router = createMemoryRouter(
    [
      { path: '/resources', element: <ResourcesPage /> },
      { path: '/:locale/resources', element: <ResourcesPage /> },
    ],
    { initialEntries: [initialEntry] },
  )

  return render(<RouterProvider router={router} />)
}

describe('ResourcesPage', () => {
  beforeEach(() => {
    localStorage.removeItem(COUNTRY_PREFERENCE_STORAGE_KEY)
  })

  it('renders resources sections and gallery', () => {
    renderResourcesPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'resourcesPage.hero.title' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'resourcesPage.gallery.title' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0)
  })

  it('uses global country preference from localStorage', () => {
    localStorage.setItem(COUNTRY_PREFERENCE_STORAGE_KEY, 'FR')
    renderResourcesPage('/en/resources')

    expect(screen.getByText('Soutien Maternite 24h')).toBeInTheDocument()
    expect(screen.queryByText('Maternal Mental Health Hotline')).not.toBeInTheDocument()
  })

  it('uses localized routes for CTA links', () => {
    renderResourcesPage('/en/resources')

    expect(
      screen.getByRole('link', { name: 'resourcesPage.hero.primaryCta' }),
    ).toHaveAttribute('href', '/en/resources/hotlines')
    expect(
      screen.getByRole('link', { name: 'resourcesPage.hero.secondaryCta' }),
    ).toHaveAttribute('href', '/en/contact')
    expect(document.title).toBe('seo.resources.title')
  })
})
