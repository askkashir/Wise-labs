import { getSupabase } from '@/lib/supabase'

export interface LiveStats {
  applications: number
  cities: number
  mentors: number
}

/**
 * Real submission-derived stats, computed client-side from `submissions`.
 * Returns null (never throws) when Supabase isn't configured. Gated behind
 * VITE_FEATURE_LIVE_STATS — see src/sections/LiveStats.tsx.
 */
export async function fetchLiveStats(): Promise<LiveStats | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase.from('submissions').select('track, analytics')
  if (error || !data) return null

  const applications = data.length
  const cities = new Set(
    data.map((row) => (row.analytics as Record<string, unknown>)?.city).filter(Boolean)
  ).size
  const mentors = data.filter((row) => row.track === 'mentor').length

  return { applications, cities, mentors }
}

/**
 * Next application-cycle deadline. No real cycle calendar exists yet, so
 * this defaults to 30 days from first load (stable per session via
 * sessionStorage) rather than a hardcoded date that would silently become
 * stale. A human should replace this with a real date once one is set —
 * see TODO_FOR_HUMAN.md item 10.
 */
export function getNextCycleDeadline(): Date {
  const KEY = 'wiselab:next-cycle-deadline'
  const stored = typeof window !== 'undefined' ? sessionStorage.getItem(KEY) : null
  if (stored) return new Date(stored)

  const deadline = new Date()
  deadline.setDate(deadline.getDate() + 30)
  if (typeof window !== 'undefined') sessionStorage.setItem(KEY, deadline.toISOString())
  return deadline
}
