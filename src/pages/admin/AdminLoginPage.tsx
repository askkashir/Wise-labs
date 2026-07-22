import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { WiseMark } from '@/components/WiseLabLogo'
import { useAdminAuth } from '@/lib/auth/useAdminAuth'

export function AdminLoginPage() {
  const { session, configured, signIn } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (session) return <Navigate to="/admin" replace />

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) setError(error)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-beige px-6">
      <div className="w-full max-w-sm rounded-3xl border border-plum/10 bg-white p-8 shadow-card">
        <div className="flex justify-center">
          <WiseMark className="h-12 w-auto" />
        </div>
        <h1 className="mt-6 text-center font-display text-2xl font-bold text-plum">
          WISE Lab Admin
        </h1>

        {!configured ? (
          <p className="mt-6 rounded-xl bg-plum/5 p-4 text-center text-sm text-plum/60">
            The admin backend isn't configured yet. Provision Supabase and set env vars
            (see TODO_FOR_HUMAN.md) before signing in.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-[13px] font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        )}
      </div>
    </main>
  )
}
