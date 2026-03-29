import { fireEvent, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
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
  it('renders resources sections and country selector', () => {
    renderResourcesPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'resourcesPage.hero.title' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('resourcesPage.selector.label')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'resourcesPage.gallery.title' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0)
  })

  it('filters gallery rows when country changes', () => {
    renderResourcesPage('/en/resources')

    const countrySelect = screen.getByLabelText('resourcesPage.selector.label')
    fireEvent.change(countrySelect, { target: { value: 'FR' } })

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
