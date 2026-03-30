import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import AboutPage from './AboutPage'

function renderAboutPage(initialEntry = '/about') {
  const router = createMemoryRouter(
    [
      { path: '/about', element: <AboutPage /> },
      { path: '/:locale/about', element: <AboutPage /> },
    ],
    { initialEntries: [initialEntry] },
  )

  return render(<RouterProvider router={router} />)
}

describe('AboutPage', () => {
  it('renders the main about structure with all key sections', () => {
    renderAboutPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'about.hero.title' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'about.values.title' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'about.story.title' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'about.trust.title' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'about.closing.title' }),
    ).toBeInTheDocument()
    expect(screen.getByText('about.values.items.dignity.title')).toBeInTheDocument()
    expect(
      screen.getByText('about.trust.items.confidentialCare.title'),
    ).toBeInTheDocument()
  })

  it('builds localized links using the route locale parameter', () => {
    renderAboutPage('/en/about')

    expect(screen.getByRole('link', { name: 'about.hero.primaryCta' })).toHaveAttribute(
      'href',
      '/en/resources/hotlines',
    )
    expect(screen.getByRole('link', { name: 'about.hero.secondaryCta' })).toHaveAttribute(
      'href',
      '/en/contact',
    )
    expect(screen.getByRole('link', { name: 'about.story.cta' })).toHaveAttribute(
      'href',
      '/en/resources/find-local-help',
    )
    expect(screen.getByRole('link', { name: 'about.closing.cta' })).toHaveAttribute(
      'href',
      '/en/resources/hotlines',
    )
    expect(document.title).toBe('seo.about.title')
  })
})
