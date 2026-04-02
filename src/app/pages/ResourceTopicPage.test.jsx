import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { COUNTRY_PREFERENCE_STORAGE_KEY } from '../../i18n/hooks/useCountryPreference'
import ResourceTopicPage from './ResourceTopicPage'

function renderResourceTopicPage(initialEntry = '/en/resources/hotlines') {
  const router = createMemoryRouter(
    [
      { path: '/resources/:topic', element: <ResourceTopicPage /> },
      { path: '/:locale/resources/:topic', element: <ResourceTopicPage /> },
    ],
    { initialEntries: [initialEntry] },
  )

  return render(<RouterProvider router={router} />)
}

describe('ResourceTopicPage', () => {
  beforeEach(() => {
    localStorage.removeItem(COUNTRY_PREFERENCE_STORAGE_KEY)
  })

  it('renders hotlines page with emergency actions and localized routes', () => {
    renderResourceTopicPage('/en/resources/hotlines')

    expect(
      screen.getByRole('heading', { level: 1, name: 'resourceTopics.hotlines.title' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: 'resourceTopics.hotlines.emergencyCallPrimary',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'resourceTopics.actions.backToResources' }),
    ).toHaveAttribute('href', '/en/resources')
    expect(
      screen.getByRole('link', { name: 'resourceTopics.actions.contact' }),
    ).toHaveAttribute('href', '/en/contact')
    expect(document.title).toBe('seo.resourceTopics.hotlines.title')
  })

  it('uses country-aware emergency hotline numbers', () => {
    localStorage.setItem(COUNTRY_PREFERENCE_STORAGE_KEY, 'FR')
    renderResourceTopicPage('/en/resources/hotlines')

    expect(
      screen.getByRole('link', {
        name: 'resourceTopics.hotlines.emergencyCallPrimary',
      }),
    ).toHaveAttribute('href', 'tel:+112')
    expect(
      screen.getByRole('link', {
        name: 'resourceTopics.hotlines.emergencyCallSecondary',
      }),
    ).toHaveAttribute('href', 'tel:+0800714040')
  })

  it('filters resource topic data by country preference', () => {
    localStorage.setItem(COUNTRY_PREFERENCE_STORAGE_KEY, 'FR')
    renderResourceTopicPage('/en/resources/find-local-help')

    expect(screen.getByText('Maison Sainte Claire')).toBeInTheDocument()
    expect(screen.queryByText('Starlight Community Help Center')).not.toBeInTheDocument()
  })

  it('shows not found state for unknown topic slug', () => {
    renderResourceTopicPage('/en/resources/unknown-topic')

    expect(screen.getByText('errors.notFound.title')).toBeInTheDocument()
    expect(screen.getByText('errors.notFound.message')).toBeInTheDocument()
  })
})
