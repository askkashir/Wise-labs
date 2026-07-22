import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import App from './App'
import { ApplyPage } from '@/pages/ApplyPage'
import { BlogListPage } from '@/pages/BlogListPage'
import { BlogPostPage } from '@/pages/BlogPostPage'
import { AdminAuthProvider } from '@/lib/auth/useAdminAuth'
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminSubmissionsPage } from '@/pages/admin/AdminSubmissionsPage'
import { AdminBlogPage } from '@/pages/admin/AdminBlogPage'
import { AdminBlogEditorPage } from '@/pages/admin/AdminBlogEditorPage'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { ApplyNowButton } from '@/components/ApplyNowButton'

/**
 * Floating WhatsApp + Apply Now buttons on every public-facing route; hidden
 * on /admin. Apply Now is also hidden while already on an /apply/:track page
 * — no need to prompt someone to apply while they're mid-application.
 */
function GlobalChrome() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/admin')) return null
  return (
    <>
      {!pathname.startsWith('/apply') && <ApplyNowButton />}
      <WhatsAppButton />
    </>
  )
}

/**
 * Top-level route tree. The landing page ("/") is exactly the pre-existing
 * <App /> — untouched, still the single-page scroll experience with hash
 * nav. Everything else (application forms, blog, admin portal) is new
 * routes that wrap around it, per the master prompt's instruction not to
 * replace the landing page structure.
 */
export function AppRouter() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/apply/:track" element={<ApplyPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="submissions" element={<AdminSubmissionsPage />} />
            <Route path="blog" element={<AdminBlogPage />} />
            <Route path="blog/:id" element={<AdminBlogEditorPage />} />
          </Route>
        </Routes>
        <GlobalChrome />
      </AdminAuthProvider>
    </BrowserRouter>
  )
}
