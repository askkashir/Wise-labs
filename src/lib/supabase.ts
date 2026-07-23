import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Lazily-created Supabase client. Returns `null` (never throws) when env
 * vars aren't configured — no live project exists yet in this environment
 * (see TODO_FOR_HUMAN.md). Callers must handle the null case: forms fall
 * back to a local-only "queued" submission so the UI still works end-to-end
 * for development/demo without a backend.
 */
let client: SupabaseClient | null | undefined

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client
  if (!url || !anonKey) {
    console.error('Supabase credentials missing. Forms and Blog will not work with a live backend.')
    client = null
    return client
  }
  client = createClient(url, anonKey)
  return client
}

export const isSupabaseConfigured = Boolean(url && anonKey)
