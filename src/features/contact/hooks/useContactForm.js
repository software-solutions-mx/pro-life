import { useMutation } from '@tanstack/react-query'
import { submitContactMessage } from '../services/contactApi'

export function useContactForm() {
  return useMutation({
    mutationFn: submitContactMessage,
  })
}
