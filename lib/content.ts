import {
  getAllPosts,
  getPostBySlug,
  searchPosts,
  slugify,
  type Post,
  type PostMeta,
} from './posts'

export { slugify }

export type PublishedPost = {
  title: string
  slug: string
  date: string
  excerpt: string
  featuredImage?: string
  categories: string[]
  tags: string[]
  content: string
}

export type PublishedCategory = {
  name: string
  slug: string
  count: number
}

function toPublishedPost(post: PostMeta, content = ''): PublishedPost {
  return {
    title: post.title,
    slug: post.slug,
    date: post.date,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    categories: post.categories || [],
    tags: post.tags || [],
    content,
  }
}

function toPublishedFullPost(post: Post): PublishedPost {
  return {
    title: post.title,
    slug: post.slug,
    date: post.date,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    categories: post.categories || [],
    tags: post.tags || [],
    content: post.content,
  }
}

export async function getAllPublishedPosts(): Promise<PublishedPost[]> {
  return getAllPosts().map((post) => toPublishedPost(post))
}

export async function getPublishedPosts(): Promise<PublishedPost[]> {
  return getAllPublishedPosts()
}

export async function getPublishedPostBySlug(slug: string): Promise<PublishedPost | null> {
  const post = getPostBySlug(slug)
  if (!post) return null
  return toPublishedFullPost(post)
}

export async function getRecentPosts(limit = 6) {
  const posts = await getAllPublishedPosts()
  return posts.slice(0, limit)
}

export async function getPublishedCategories(): Promise<PublishedCategory[]> {
  const posts = await getAllPublishedPosts()
  const counts = new Map<string, {name: string; count: number}>()

  for (const post of posts) {
    for (const category of post.categories || []) {
      const name = String(category || '').trim()
      if (!name) continue
      const key = slugify(name)
      const existing = counts.get(key)
      if (existing) {
        existing.count += 1
      } else {
        counts.set(key, {name, count: 1})
      }
    }
  }

  return Array.from(counts.entries())
    .map(([slug, value]) => ({
      name: value.name,
      slug,
      count: value.count,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export async function getCategories(): Promise<PublishedCategory[]> {
  return getPublishedCategories()
}

export async function getPostsByCategory(category: string) {
  const posts = await getAllPublishedPosts()
  const wanted = slugify(category)
  return posts.filter((post) => post.categories.some((cat) => slugify(cat) === wanted))
}

export async function searchPublishedPosts(query: string) {
  return searchPosts(query).map((post) => toPublishedPost(post))
}

