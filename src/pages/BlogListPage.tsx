import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal'
import { listPublishedPosts } from '@/lib/blog/api'
import type { BlogPost } from '@/lib/blog/types'
import { isSupabaseConfigured } from '@/lib/supabase'

export function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    listPublishedPosts().then((p) => {
      if (alive) {
        setPosts(p)
        setLoading(false)
      }
    })
    return () => {
      alive = false
    }
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-beige py-16 md:py-24">
      <div className="grain" />
      <div className="container-wise relative">
        <Reveal>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-plum/60 transition-colors hover:text-plum"
          >
            <ArrowLeft className="h-4 w-4" /> Back to WISE Lab
          </Link>
          <p className="eyebrow mt-8">WISE Lab Journal</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.03] text-plum">
            Stories from the Lab
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-plum/70">
            Founder journeys, ecosystem news, and updates from Pakistan's women-led
            innovation and enterprise movement.
          </p>
        </Reveal>

        <div className="mt-16">
          {!isSupabaseConfigured && (
            <p className="rounded-2xl border border-plum/10 bg-white/60 p-6 text-sm text-plum/60">
              The blog isn't connected to a live backend yet. Once Supabase is provisioned
              (see TODO_FOR_HUMAN.md) and posts are published, they'll appear here.
            </p>
          )}

          {isSupabaseConfigured && !loading && posts.length === 0 && (
            <p className="rounded-2xl border border-plum/10 bg-white/60 p-6 text-sm text-plum/60">
              No posts published yet — check back soon.
            </p>
          )}

          <RevealGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <RevealItem key={post.id}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-plum/10 bg-white shadow-card transition-shadow duration-500 hover:shadow-card-hover"
                >
                  {post.coverImageUrl && (
                    <div className="aspect-[16/9] w-full overflow-hidden bg-plum/5">
                      <img
                        src={post.coverImageUrl}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="font-display text-xl font-semibold text-plum">
                      {post.title}
                    </h2>
                    <p className="mt-2 flex-1 text-[15px] leading-relaxed text-plum/65">
                      {post.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal">
                      Read more
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </main>
  )
}
