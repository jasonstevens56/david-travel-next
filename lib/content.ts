import {
  getAllPosts,
  getPostBySlug,
  searchPosts,
  slugify,
  type Post,
  type PostMeta,
} from './posts'

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

function toPublishedPost(post: PostMeta, content = ''): PublishedPost {
  return {
    title: post.title,
    slug: post.slug,
    date: post.date,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage && post.featuredImage !== '/logo.svg' ? post.featuredImage : post.featuredImage,
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

export async function getPublishedPosts(): Promise<PublishedPost[]> {
  return getAllPosts().map((post) => toPublishedPost(post))
}

export async function getPublishedPostBySlug(slug: string): Promise<PublishedPost | null> {
  const post = getPostBySlug(slug)
  if (!post) return null
  return toPublishedFullPost(post)
}

export async function getRecentPosts(limit = 6) {
  const posts = await getPublishedPosts()
  return posts.slice(0, limit)
}

export async function getCategories() {
  const posts = await getPublishedPosts()
  return Array.from(new Set(posts.flatMap((post) => post.categories || []).filter(Boolean))).sort()
}

export async function getPostsByCategory(category: string) {
  const posts = await getPublishedPosts()
  const wanted = slugify(category)
  return posts.filter((post) => post.categories.some((cat) => slugify(cat) === wanted))
}

export async function searchPublishedPosts(query: string) {
  return searchPosts(query).map((post) => toPublishedPost(post))
}

