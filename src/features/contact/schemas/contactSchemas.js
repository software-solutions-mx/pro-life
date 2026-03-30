import { z } from 'zod'

export const CONTACT_REASON_VALUES = ['help', 'general', 'media', 'partner']

const contactReasonSchema = z.enum(CONTACT_REASON_VALUES)

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'contactPage.form.errors.name'),
  email: z.string().trim().email('contactPage.form.errors.email'),
  phone: z.string().trim().max(40, 'contactPage.form.errors.phone').optional(),
  reason: contactReasonSchema,
  message: z.string().trim().min(20, 'contactPage.form.errors.message'),
})

export const contactMessageRequestSchema = z.object({
  contact_message: z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    phone: z.string().trim().max(40).optional(),
    reason: contactReasonSchema,
    message: z.string().trim().min(20),
    country_code: z.string().trim().length(2),
    locale: z.string().trim().min(2),
    source_path: z.string().trim().min(1),
  }),
})

export const contactMessageResponseSchema = z
  .object({
    status: z.string().optional(),
    message: z.string().optional(),
    data: z
      .object({
        id: z.union([z.string(), z.number()]).optional(),
      })
      .passthrough()
      .optional(),
    contact_message: z
      .object({
        id: z.union([z.string(), z.number()]).optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()

export const contactMessageErrorSchema = z
  .object({
    error: z.string().optional(),
    message: z.string().optional(),
    errors: z.record(z.array(z.string())).optional(),
  })
  .passthrough()
