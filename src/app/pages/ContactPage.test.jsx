import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { COUNTRY_PREFERENCE_STORAGE_KEY } from '../../i18n/hooks/useCountryPreference'
import ContactPage from './ContactPage'

function renderContactPage(initialEntry = '/contact') {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  const router = createMemoryRouter(
    [
      { path: '/contact', element: <ContactPage /> },
      { path: '/:locale/contact', element: <ContactPage /> },
    ],
    { initialEntries: [initialEntry] },
  )

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('ContactPage', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = vi.fn()
    localStorage.setItem(COUNTRY_PREFERENCE_STORAGE_KEY, 'US')
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()
    localStorage.removeItem(COUNTRY_PREFERENCE_STORAGE_KEY)
  })

  it('renders contact page structure and support content', () => {
    renderContactPage('/en/contact')

    expect(
      screen.getByRole('heading', { level: 1, name: 'contactPage.hero.title' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'contactPage.form.title' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: 'contactPage.support.title' }),
    ).toBeInTheDocument()
  })

  it('shows validation errors when required fields are empty', async () => {
    renderContactPage('/en/contact')

    fireEvent.click(screen.getByRole('button', { name: 'contactPage.form.submit.idle' }))

    expect(await screen.findByText('contactPage.form.errors.name')).toBeInTheDocument()
    expect(screen.getByText('contactPage.form.errors.email')).toBeInTheDocument()
    expect(screen.getByText('contactPage.form.errors.message')).toBeInTheDocument()
    const apiSubmitCalls = global.fetch.mock.calls.filter(([requestUrl]) =>
      String(requestUrl).includes('/api/v1/contact_messages'),
    )
    expect(apiSubmitCalls).toHaveLength(0)
  })

  it('submits payload to rails contact endpoint and shows success status', async () => {
    global.fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok', message: 'created' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )

    renderContactPage('/en/contact')

    fireEvent.change(screen.getByLabelText('contactPage.form.fields.name.label'), {
      target: { value: 'Jane Doe' },
    })
    fireEvent.change(screen.getByLabelText('contactPage.form.fields.email.label'), {
      target: { value: 'jane@example.com' },
    })
    fireEvent.change(screen.getByLabelText('contactPage.form.fields.reason.label'), {
      target: { value: 'help' },
    })
    fireEvent.change(screen.getByLabelText('contactPage.form.fields.message.label'), {
      target: {
        value: 'I need guidance and practical support for my current situation.',
      },
    })

    fireEvent.click(screen.getByRole('button', { name: 'contactPage.form.submit.idle' }))

    let apiSubmitCall
    await waitFor(() => {
      const apiSubmitCalls = global.fetch.mock.calls.filter(([requestUrl]) =>
        String(requestUrl).includes('/api/v1/contact_messages'),
      )
      expect(apiSubmitCalls).toHaveLength(1)
      apiSubmitCall = apiSubmitCalls[0]
    })

    const [requestUrl, requestOptions] = apiSubmitCall
    expect(requestUrl).toContain('/api/v1/contact_messages')
    expect(requestOptions.method).toBe('POST')

    const parsedPayload = JSON.parse(requestOptions.body)
    expect(parsedPayload.contact_message.reason).toBe('help')
    expect(parsedPayload.contact_message.country_code).toBe('US')
    expect(parsedPayload.contact_message.locale).toBe('en')
    expect(parsedPayload.contact_message.source_path).toBe('/en/contact')

    expect(await screen.findByText('contactPage.form.status.success')).toBeInTheDocument()
    expect(document.title).toBe('seo.contact.title')
  })
})
