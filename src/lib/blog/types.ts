export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImageUrl: string | null
  author: string
  publishedAt: string | null
  status: 'draft' | 'published'
  tags: string[]
}
