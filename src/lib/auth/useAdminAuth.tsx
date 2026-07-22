import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase'

interface AdminAuthValue {
  session: Session | null
  loading: boolean
  /** true only if the signed-in user also has a row in `admin_profiles` (see 0001_init.sql RLS). */
  isAdmin: boolean
  configured: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null)

/**
 * Thin wrapper around Supabase auth for the admin portal. Admin accounts are
 * provisioned manually in the `admin_profiles` table (see
 * supabase/migrations) — there's no public sign-up flow, by design.
 *
 * Having a valid Supabase auth session is not the same as being an admin:
 * the `submissions`/`blog_posts` RLS policies gate SELECT on membership in
 * `admin_profiles`, so the client must check the same table to know whether
 * a signed-in user is actually authorized, rather than treating "has a
 * session" as "is an admin".
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) {
      setLoading(false)
      return
    }

    let alive = true

    const syncSession = async (s: Session | null) => {
      if (!alive) return
      setSession(s)
      if (!s) {
        setIsAdmin(false)
        return
      }
      const { data } = await supabase
        .from('admin_profiles')
        .select('id')
        .eq('id', s.user.id)
        .maybeSingle()
      if (alive) setIsAdmin(!!data)
    }

    supabase.auth.getSession().then(async ({ data }) => {
      await syncSession(data.session)
      if (alive) setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      syncSession(s)
    })

    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const supabase = getSupabase()
    if (!supabase) return { error: 'Backend is not configured yet.' }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) return { error: signInError.message }

    const { data } = await supabase.auth.getSession()
    const user = data.session?.user
    if (!user) return { error: 'Sign-in failed. Please try again.' }

    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile) {
      await supabase.auth.signOut()
      return { error: 'This account is not authorized for admin access.' }
    }

    return { error: null }
  }

  const signOut = async () => {
    const supabase = getSupabase()
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return (
    <AdminAuthContext.Provider
      value={{ session, loading, isAdmin, configured: isSupabaseConfigured, signIn, signOut }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
