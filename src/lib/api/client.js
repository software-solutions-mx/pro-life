import { API_BASE_URL } from '../../config/env'

export class ApiError extends Error {
  constructor(message, { status, url, data }) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.url = url
    this.data = data
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  if (contentType.includes('text/')) {
    return response.text()
  }

  return null
}

async function request(path, options = {}) {
  const { method = 'GET', body, headers, signal } = options
  const isJsonBody = body !== undefined && body !== null && !(body instanceof FormData)
  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
    ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
  }
  const requestBody = isJsonBody ? JSON.stringify(body) : body
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const url = `${API_BASE_URL}${normalizedPath}`

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: requestBody,
    signal,
  })

  const data = await parseResponse(response)

  if (!response.ok) {
    throw new ApiError(`API request failed with status ${response.status}`, {
      status: response.status,
      url,
      data,
    })
  }

  return data
}

export const apiClient = {
  get(path, options = {}) {
    return request(path, { ...options, method: 'GET' })
  },
  post(path, body, options = {}) {
    return request(path, { ...options, method: 'POST', body })
  },
  put(path, body, options = {}) {
    return request(path, { ...options, method: 'PUT', body })
  },
  patch(path, body, options = {}) {
    return request(path, { ...options, method: 'PATCH', body })
  },
  delete(path, options = {}) {
    return request(path, { ...options, method: 'DELETE' })
  },
}
