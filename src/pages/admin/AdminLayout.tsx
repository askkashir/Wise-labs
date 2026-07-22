import { Navigate, NavLink, Outlet } from 'react-router-dom'
import { FileText, LayoutDashboard, LogOut, Newspaper } from 'lucide-react'
import { WiseMark } from '@/components/WiseLabLogo'
import { useAdminAuth } from '@/lib/auth/useAdminAuth'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
  { to: '/admin/submissions', label: 'Submissions', Icon: FileText },
  { to: '/admin/blog', label: 'Blog', Icon: Newspaper },
]

export function AdminLayout() {
  const { session, loading, signOut } = useAdminAuth()

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-beige text-plum/50">Loading…</div>
  }
  if (!session) return <Navigate to="/admin/login" replace />

  return (
    <div className="flex min-h-screen bg-beige">
      <aside className="flex w-64 shrink-0 flex-col border-r border-plum/10 bg-white p-6">
        <div className="flex items-center gap-2.5">
          <WiseMark className="h-8 w-auto" />
          <span className="font-display text-lg font-bold text-plum">Admin</span>
        </div>
        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {NAV.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-teal/10 text-teal' : 'text-plum/70 hover:bg-plum/5 hover:text-plum'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => signOut()}
          className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-plum/60 transition-colors hover:bg-plum/5 hover:text-plum"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </aside>
      <main className="flex-1 p-8 md:p-12">
        <Outlet />
      </main>
    </div>
  )
}
