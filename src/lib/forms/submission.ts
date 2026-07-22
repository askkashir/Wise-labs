import type { FormSchema, SubmissionPayload } from './types'

/** Flattens all fields across all sections of a schema, in order. */
export function allFields(schema: FormSchema) {
  return schema.sections.flatMap((s) => s.fields)
}

/**
 * Builds the stable SubmissionPayload envelope from raw form values.
 * Fields marked `analytics` are copied into the flattened `analytics` map
 * so admin/reporting code can query one shape regardless of track.
 */
export function buildSubmissionPayload(
  schema: FormSchema,
  values: Record<string, unknown>
): SubmissionPayload {
  const analytics: Record<string, string | boolean> = {}
  for (const field of allFields(schema)) {
    if (!field.analytics) continue
    const raw = values[field.name]
    if (raw === undefined || raw === '') continue
    if (field.analytics.kind === 'boolean') {
      analytics[field.analytics.dimension] = raw === 'yes' || raw === true
    } else {
      analytics[field.analytics.dimension] = String(raw)
    }
  }

  return {
    track: schema.track,
    values,
    analytics,
    submittedAt: new Date().toISOString(),
    meta: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      locale: typeof navigator !== 'undefined' ? navigator.language : 'en',
    },
  }
}

/** Is a field currently visible given its `conditional` rule and current values? */
export function isFieldVisible(
  field: { conditional?: { field: string; equals: string | string[] | boolean } },
  values: Record<string, unknown>
): boolean {
  if (!field.conditional) return true
  const dep = values[field.conditional.field]
  const target = field.conditional.equals
  if (Array.isArray(target)) return target.includes(dep as string)
  return dep === target
}
