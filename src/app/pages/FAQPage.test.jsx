import { fireEvent, render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import FAQPage from './FAQPage'

function renderFAQPage(initialEntry = '/faq') {
  const router = createMemoryRouter(
    [
      { path: '/faq', element: <FAQPage /> },
      { path: '/:locale/faq', element: <FAQPage /> },
    ],
    { initialEntries: [initialEntry] },
  )

  return render(<RouterProvider router={router} />)
}

describe('FAQPage', () => {
  it('renders interactive faq page with question stream', () => {
    renderFAQPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'faqPage.hero.title' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('faqPage.search.label')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'faqPage.questionRail.title' }),
    ).toBeInTheDocument()
  })

  it('filters questions from search input', () => {
    renderFAQPage('/en/faq')

    fireEvent.change(screen.getByLabelText('faqPage.search.label'), {
      target: { value: 'zzzz-no-match' },
    })

    expect(screen.getByText('faqPage.empty.title')).toBeInTheDocument()
  })

  it('builds localized action links', () => {
    renderFAQPage('/en/faq')

    expect(
      screen.getByRole('link', { name: 'faqPage.answer.actions.hotlines' }),
    ).toHaveAttribute('href', '/en/resources/hotlines')
    expect(
      screen.getByRole('link', { name: 'faqPage.answer.actions.resources' }),
    ).toHaveAttribute('href', '/en/resources')
    expect(
      screen.getByRole('link', { name: 'faqPage.answer.actions.contact' }),
    ).toHaveAttribute('href', '/en/contact')
    expect(document.title).toBe('seo.faq.title')
  })
})
