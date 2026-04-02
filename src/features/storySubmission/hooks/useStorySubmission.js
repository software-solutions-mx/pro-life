import { useMutation } from '@tanstack/react-query'
import { submitStorySubmission } from '../services/storySubmissionApi'

export function useStorySubmission() {
  return useMutation({
    mutationFn: submitStorySubmission,
  })
}
