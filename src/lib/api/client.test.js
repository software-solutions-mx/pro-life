import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'
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
