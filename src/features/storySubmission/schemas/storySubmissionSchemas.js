import { z } from 'zod'

export const STORY_PUBLICATION_PREFERENCES = ['anonymous', 'firstName', 'initials']

const publicationPreferenceSchema = z.enum(STORY_PUBLICATION_PREFERENCES)

export const storySubmissionFormSchema = z.object({
  title: z.string().trim().min(6, 'storiesPage.submit.form.errors.title'),
  authorName: z.string().trim().min(2, 'storiesPage.submit.form.errors.authorName'),
  email: z
    .union([
      z.string().trim().email('storiesPage.submit.form.errors.email'),
      z.literal(''),
    ])
    .optional(),
  storyBody: z.string().trim().min(120, 'storiesPage.submit.form.errors.storyBody'),
  publicationPreference: publicationPreferenceSchema,
  allowFollowUp: z.boolean(),
  consentAccepted: z
    .boolean()
    .refine((isAccepted) => isAccepted, 'storiesPage.submit.form.errors.consentAccepted'),
})

export const storySubmissionRequestSchema = z.object({
  story_submission: z.object({
    title: z.string().trim().min(6),
    author_name: z.string().trim().min(2),
    email: z.string().trim().email().optional(),
    body: z.string().trim().min(120),
    publication_preference: publicationPreferenceSchema,
    allow_follow_up: z.boolean(),
    consent_accepted: z.literal(true),
    country_code: z.string().trim().length(2),
    locale: z.string().trim().min(2),
    source_path: z.string().trim().min(1),
  }),
})

export const storySubmissionResponseSchema = z
  .object({
    status: z.string().optional(),
    message: z.string().optional(),
    data: z
      .object({
        id: z.union([z.string(), z.number()]).optional(),
      })
      .passthrough()
      .optional(),
    story_submission: z
      .object({
        id: z.union([z.string(), z.number()]).optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()

export const storySubmissionErrorSchema = z
  .object({
    error: z.string().optional(),
    message: z.string().optional(),
    errors: z.record(z.array(z.string())).optional(),
  })
  .passthrough()
