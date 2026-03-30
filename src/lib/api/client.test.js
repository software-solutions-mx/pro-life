import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
import { API_CLIENT_ID, API_CLIENT_SECRET } from '../../config/env'
import { ApiContractError, apiClient } from './client'

describe('apiClient', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()
  })

  it('validates and parses a successful response payload', async () => {
    global.fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )

    const responseSchema = z.object({
      status: z.enum(['ok', 'degraded', 'down']),
    })

    await expect(apiClient.get('/health', { responseSchema })).resolves.toMatchObject({
      status: 'ok',
    })
  })

  it('sends credentials and default security headers', async () => {
    global.fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )

    await apiClient.get('/health')

    const [requestUrl, requestOptions] = global.fetch.mock.calls[0]
    expect(typeof requestUrl).toBe('string')
    expect(requestOptions.credentials).toBe('include')
    expect(requestOptions.headers['X-Requested-With']).toBe('XMLHttpRequest')
    expect(requestOptions.headers['X-Client-Id']).toBe(API_CLIENT_ID)
    expect(requestOptions.headers['X-Client-Secret']).toBe(API_CLIENT_SECRET)
    expect(requestOptions.headers['Accept-Language']).toBe('en')
    expect(requestOptions.headers['X-Locale']).toBe('en')
  })

  it('uses current document language for locale headers', async () => {
    global.fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )

    document.documentElement.lang = 'es-MX'
    await apiClient.get('/health')

    const [, requestOptions] = global.fetch.mock.calls[0]
    expect(requestOptions.headers['Accept-Language']).toBe('es-MX')
    expect(requestOptions.headers['X-Locale']).toBe('es-MX')
    document.documentElement.lang = ''
  })

  it('attaches CSRF token on mutating requests when available', async () => {
    global.fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )

    const csrfMeta = document.createElement('meta')
    csrfMeta.setAttribute('name', 'csrf-token')
    csrfMeta.setAttribute('content', 'csrf-token-value')
    document.head.appendChild(csrfMeta)

    await apiClient.post('/users', { email: 'person@example.com' })

    const [, requestOptions] = global.fetch.mock.calls[0]
    expect(requestOptions.headers['X-CSRF-Token']).toBe('csrf-token-value')

    csrfMeta.remove()
  })

  it('throws ApiContractError when response payload does not satisfy schema', async () => {
    global.fetch.mockResolvedValue(
      new Response(JSON.stringify({ status: 'unexpected' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )

    const responseSchema = z.object({
      status: z.enum(['ok', 'degraded', 'down']),
    })

    await expect(apiClient.get('/health', { responseSchema })).rejects.toBeInstanceOf(
      ApiContractError,
    )
  })

  it('throws ApiContractError before sending request when request payload is invalid', async () => {
    const requestSchema = z.object({
      email: z.string().email(),
    })

    await expect(
      apiClient.post('/users', { email: 'invalid-email' }, { requestSchema }),
    ).rejects.toBeInstanceOf(ApiContractError)
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
