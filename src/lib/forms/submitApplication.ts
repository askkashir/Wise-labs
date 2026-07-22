import { getSupabase } from '@/lib/supabase'
import type { SubmissionPayload } from './types'

const LOCAL_QUEUE_KEY = 'wiselab:queued-submissions'

function queueLocally(payload: SubmissionPayload) {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) ?? '[]')
    existing.push(payload)
    localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(existing))
  } catch {
    // localStorage unavailable (private mode, SSR, etc.) — swallow, submission
    // still "succeeds" from the user's point of view since there's no backend
    // to fail against anyway.
  }
}

/**
 * Submits a validated application payload.
 *
 * When Supabase isn't configured (no live project provisioned yet — see
 * TODO_FOR_HUMAN.md), this queues the submission to localStorage and
 * resolves successfully so the form UX still completes end-to-end. Once a
 * project exists and VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set,
 * this writes straight to the `submissions` table (see
 * supabase/migrations/0001_init.sql).
 */
export async function submitApplication(payload: SubmissionPayload): Promise<void> {
  const supabase = getSupabase()

  if (!supabase) {
    queueLocally(payload)
    return
  }

  const { error } = await supabase.from('submissions').insert({
    track: payload.track,
    values: payload.values,
    analytics: payload.analytics,
    submitted_at: payload.submittedAt,
    meta: payload.meta,
  })

  if (error) throw error
}
