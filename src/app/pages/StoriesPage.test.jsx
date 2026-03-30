import { fireEvent, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import StoriesPage from './StoriesPage'

function renderStoriesPage(initialEntry = '/testimonials') {
  const router = createMemoryRouter(
    [
      { path: '/testimonials', element: <StoriesPage /> },
      { path: '/stories', element: <StoriesPage /> },
      { path: '/:locale/testimonials', element: <StoriesPage /> },
    ],
    { initialEntries: [initialEntry] },
  )

  return render(<RouterProvider router={router} />)
}

describe('StoriesPage', () => {
  it('renders stories hero and selector', () => {
    renderStoriesPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'storiesPage.hero.title' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('storiesPage.selector.label')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'storiesPage.gallery.title' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0)
  })

  it('filters stories when country changes', () => {
    renderStoriesPage('/en/testimonials')

    const countrySelect = screen.getByLabelText('storiesPage.selector.label')
    fireEvent.change(countrySelect, { target: { value: 'FR' } })

    expect(
      screen.getByText('Une Main Tendue Quand J en Avais Besoin'),
    ).toBeInTheDocument()
    expect(
      screen.queryByText('I Found Courage One Day at a Time'),
    ).not.toBeInTheDocument()
  })

  it('uses localized routes for hero actions', () => {
    renderStoriesPage('/en/testimonials')

    expect(
      screen.getByRole('link', { name: 'storiesPage.hero.primaryCta' }),
    ).toHaveAttribute('href', '/en/resources/hotlines')
    expect(
      screen.getByRole('link', { name: 'storiesPage.hero.secondaryCta' }),
    ).toHaveAttribute('href', '/en/contact')
    expect(document.title).toBe('seo.stories.title')
  })
})
