import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import OptionsPage from './OptionsPage'

function renderOptionsPage(initialEntry = '/options') {
  const router = createMemoryRouter(
    [
      { path: '/options', element: <OptionsPage /> },
      { path: '/:locale/options', element: <OptionsPage /> },
    ],
    { initialEntries: [initialEntry] },
  )

  return render(<RouterProvider router={router} />)
}

describe('OptionsPage', () => {
  it('renders key options sections', () => {
    renderOptionsPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'optionsPage.hero.title' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'optionsPage.orientation.title',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'optionsPage.pathways.title' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'optionsPage.framework.title',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'optionsPage.commitments.title',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'optionsPage.closing.title' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('optionsPage.pathways.items.parenting.title'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('optionsPage.framework.items.biologicalFacts.title'),
    ).toBeInTheDocument()
  })

  it('builds localized CTA links using route locale', () => {
    renderOptionsPage('/en/options')

    expect(
      screen.getByRole('link', { name: 'optionsPage.hero.primaryCta' }),
    ).toHaveAttribute('href', '/en/resources/hotlines')
    expect(
      screen.getByRole('link', { name: 'optionsPage.hero.secondaryCta' }),
    ).toHaveAttribute('href', '/en/contact')
    expect(
      screen.getByRole('link', { name: 'optionsPage.closing.primaryCta' }),
    ).toHaveAttribute('href', '/en/resources/hotlines')
    expect(
      screen.getByRole('link', { name: 'optionsPage.closing.secondaryCta' }),
    ).toHaveAttribute('href', '/en/faq')
    expect(document.title).toBe('seo.options.title')
  })
})
