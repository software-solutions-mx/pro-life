import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { trackPageView } from './analytics'

vi.mock('./analytics', async () => {
  const actual = await vi.importActual('./analytics')
  return {
    ...actual,
    trackPageView: vi.fn(),
  }
})

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the main landmark', () => {
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>,
    )

    expect(screen.getByRole('main', { name: /contenido principal/i })).toBeInTheDocument()
  })

  it('tracks the initial page view once', () => {
    render(
      <HelmetProvider>
        <App />
      </HelmetProvider>,
    )

    expect(trackPageView).toHaveBeenCalledTimes(1)
    const [path, title] = trackPageView.mock.calls[0]
    expect(typeof path).toBe('string')
    expect(typeof title).toBe('string')
  })
})
