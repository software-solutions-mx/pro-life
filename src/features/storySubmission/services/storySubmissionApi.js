import { apiClient } from '../../../lib/api/client'
import {
  storySubmissionErrorSchema,
  storySubmissionRequestSchema,
  storySubmissionResponseSchema,
} from '../schemas/storySubmissionSchemas'

export async function submitStorySubmission(payload) {
  return apiClient.post('/v1/story_submissions', payload, {
    requestSchema: storySubmissionRequestSchema,
    responseSchema: storySubmissionResponseSchema,
    errorSchema: storySubmissionErrorSchema,
  })
}
