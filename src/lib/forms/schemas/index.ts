import type { ApplicationTrack, FormSchema } from '../types'
import { founderFormSchema } from './founder'
import { enterpriseFormSchema } from './enterprise'
import { mentorFormSchema } from './mentor'
import { partnerFormSchema } from './partner'

export const FORM_SCHEMAS: Record<ApplicationTrack, FormSchema> = {
  founder: founderFormSchema,
  enterprise: enterpriseFormSchema,
  mentor: mentorFormSchema,
  partner: partnerFormSchema,
}

export function getFormSchema(track: string | undefined): FormSchema | undefined {
  if (!track) return undefined
  return FORM_SCHEMAS[track as ApplicationTrack]
}

export {
  founderFormSchema,
  enterpriseFormSchema,
  mentorFormSchema,
  partnerFormSchema,
}
