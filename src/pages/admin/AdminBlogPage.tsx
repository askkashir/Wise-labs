import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { deletePost, listAllPostsForAdmin } from '@/lib/blog/api'
import type { BlogPost } from '@/lib/blog/types'
import { Button } from '@/components/ui/button'

export function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  const reload = () => {
    setLoading(true)
    listAllPostsForAdmin().then((p) => {
      setPosts(p)
      setLoading(false)
    })
  }

  useEffect(reload, [])

  const onDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return
    await deletePost(id)
    reload()
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-plum">Blog</h1>
          <p className="mt-2 text-plum/60">Manage WISE Lab Journal posts.</p>
        </div>
        <Button asChild size="sm">
          <Link to="/admin/blog/new">
            <Plus className="h-4 w-4" /> New post
          </Link>
        </Button>
      </div>

      {loading ? (
        <p className="mt-8 text-plum/50">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-plum/10 bg-white p-6 text-plum/50">
          No posts yet.
        </p>
      ) : (
        <div className="mt-8 space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-plum/10 bg-white p-5 shadow-card"
            >
              <div>
                <p className="font-semibold text-plum">{post.title}</p>
                <p className="mt-1 text-sm text-plum/50">
                  {post.status === 'published' ? 'Published' : 'Draft'}
                  {post.publishedAt && ` · ${new Date(post.publishedAt).toLocaleDateString()}`}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to={`/admin/blog/${post.id}`}
                  className="text-sm font-semibold text-teal hover:underline"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(post.id)}
                  className="text-sm font-semibold text-destructive hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
