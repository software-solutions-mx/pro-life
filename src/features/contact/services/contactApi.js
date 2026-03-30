import { apiClient } from '../../../lib/api/client'
import {
  contactMessageErrorSchema,
  contactMessageRequestSchema,
  contactMessageResponseSchema,
} from '../schemas/contactSchemas'

export async function submitContactMessage(payload) {
  return apiClient.post('/v1/contact_messages', payload, {
    requestSchema: contactMessageRequestSchema,
    responseSchema: contactMessageResponseSchema,
    errorSchema: contactMessageErrorSchema,
  })
}
