import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { COUNTRY_PREFERENCE_STORAGE_KEY } from '../../i18n/hooks/useCountryPreference'
import StoriesPage from './StoriesPage'

function renderStoriesPage(initialEntry = '/testimonials') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  const router = createMemoryRouter(
    [
      { path: '/testimonials', element: <StoriesPage /> },
      { path: '/stories', element: <StoriesPage /> },
      { path: '/:locale/testimonials', element: <StoriesPage /> },
    ],
    { initialEntries: [initialEntry] },
  )

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('StoriesPage', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = vi.fn()
    localStorage.removeItem(COUNTRY_PREFERENCE_STORAGE_KEY)
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()
    localStorage.removeItem(COUNTRY_PREFERENCE_STORAGE_KEY)
  })

  it('renders stories hero and gallery', () => {
    renderStoriesPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'storiesPage.hero.title' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'storiesPage.gallery.title' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0)
  })

  it('uses global country preference from localStorage', () => {
    localStorage.setItem(COUNTRY_PREFERENCE_STORAGE_KEY, 'FR')
    renderStoriesPage('/en/testimonials')

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

  it('shows validation errors when required fields are missing', async () => {
    renderStoriesPage('/en/testimonials')

    fireEvent.click(
      screen.getByRole('button', { name: 'storiesPage.submit.form.submit.idle' }),
    )

    expect(
      await screen.findByText('storiesPage.submit.form.errors.title'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('storiesPage.submit.form.errors.authorName'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('storiesPage.submit.form.errors.storyBody'),
    ).toBeInTheDocument()
    expect(
      screen.getByText('storiesPage.submit.form.errors.consentAccepted'),
    ).toBeInTheDocument()

    const submissionCalls = global.fetch.mock.calls.filter(([requestUrl]) =>
      String(requestUrl).includes('/api/v1/story_submissions'),
    )
    expect(submissionCalls).toHaveLength(0)
  })

  it('submits story form to rails endpoint and shows success state', async () => {
    global.fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok', story_submission: { id: 1 } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )
    localStorage.setItem(COUNTRY_PREFERENCE_STORAGE_KEY, 'MX')
    renderStoriesPage('/en/testimonials')

    fireEvent.change(
      screen.getByLabelText('storiesPage.submit.form.fields.title.label'),
      {
        target: { value: 'A calmer path when I needed help most' },
      },
    )
    fireEvent.change(
      screen.getByLabelText('storiesPage.submit.form.fields.authorName.label'),
      {
        target: { value: 'Maria Elena' },
      },
    )
    fireEvent.change(
      screen.getByLabelText('storiesPage.submit.form.fields.email.label'),
      {
        target: { value: 'maria@example.com' },
      },
    )
    fireEvent.change(
      screen.getByLabelText('storiesPage.submit.form.fields.publicationPreference.label'),
      {
        target: { value: 'firstName' },
      },
    )
    fireEvent.change(
      screen.getByLabelText('storiesPage.submit.form.fields.storyBody.label'),
      {
        target: {
          value:
            'I felt overwhelmed at first, but receiving respectful and practical support helped me process my options with more calm, safety, and hope for the next step.',
        },
      },
    )
    fireEvent.click(
      screen.getByLabelText('storiesPage.submit.form.fields.consentAccepted.label'),
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'storiesPage.submit.form.submit.idle' }),
    )

    let submissionCall
    await waitFor(() => {
      const submissionCalls = global.fetch.mock.calls.filter(([requestUrl]) =>
        String(requestUrl).includes('/api/v1/story_submissions'),
      )
      expect(submissionCalls).toHaveLength(1)
      submissionCall = submissionCalls[0]
    })

    const [requestUrl, requestOptions] = submissionCall
    expect(requestUrl).toContain('/api/v1/story_submissions')
    expect(requestOptions.method).toBe('POST')

    const parsedPayload = JSON.parse(requestOptions.body)
    expect(parsedPayload.story_submission.title).toBe(
      'A calmer path when I needed help most',
    )
    expect(parsedPayload.story_submission.author_name).toBe('Maria Elena')
    expect(parsedPayload.story_submission.email).toBe('maria@example.com')
    expect(parsedPayload.story_submission.publication_preference).toBe('firstName')
    expect(parsedPayload.story_submission.country_code).toBe('MX')
    expect(parsedPayload.story_submission.locale).toBe('en')
    expect(parsedPayload.story_submission.source_path).toBe('/en/testimonials')

    expect(
      await screen.findByText('storiesPage.submit.status.success'),
    ).toBeInTheDocument()
  })
})
