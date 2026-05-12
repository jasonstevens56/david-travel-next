import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import {
  getAllPosts as getLocalPosts,
  getPostBySlug as getLocalPostBySlug,
  searchPosts as searchLocalPosts,
  slugify,
  type Post,
  type PostMeta,
} from './posts'
import {apiVersion, dataset, projectId} from '../sanity/env'

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
})

const builder = imageUrlBuilder(client)

function imageUrl(source: any) {
  if (!source) return undefined
  try {
    return builder.image(source).width(900).height(620).fit('crop').url()
  } catch {
    return undefined
  }
}

function blockToText(blocks: any[] = []) {
  return blocks
    .map((block) => {
      if (block?._type !== 'block') return ''
      return (block.children || []).map((child: any) => child.text || '').join('')
    })
    .filter(Boolean)
    .join('\\n\\n')
}

function makeExcerpt(text: string, fallback = '', length = 220) {
  const clean = (fallback || text || '').replace(/\\s+/g, ' ').trim()
  if (clean.length <= length) return clean
  return clean.slice(0, length).replace(/\\s+\\S*$/, '') + '...'
}

type SanityPost = {
  _id: string
  title?: string
  slug?: {current?: string}
  publishedAt?: string
  excerpt?: string
  mainImage?: any
  body?: any[]
  categories?: {title?: string}[]
}

const postFields = `
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  mainImage,
  body,
  categories[]->{title}
`

function normalizeSanityPost(post: SanityPost): Post {
  const slug = post.slug?.current || post._id
  const text = blockToText(post.body || [])

  return {
    title: post.title || slug.replaceAll('-', ' '),
    slug,
    date: post.publishedAt || '',
    excerpt: makeExcerpt(text, post.excerpt || ''),
    featuredImage: imageUrl(post.mainImage) || '/logo.jpg',
    categories: (post.categories || []).map((cat) => cat.title || '').filter(Boolean),
    tags: [],
    content: text,
  }
}

export async function getSanityPosts(): Promise<Post[]> {
  try {
    const posts = await client.fetch<SanityPost[]>(
      `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {${postFields}}`,
      {},
      {next: {revalidate: 60}}
    )

    return posts.map(normalizeSanityPost)
  } catch (error) {
    console.error('Sanity fetch failed:', error)
    return []
  }
}

export async function getAllPublishedPosts(): Promise<PostMeta[]> {
  const sanityPosts = await getSanityPosts()
  const localPosts = getLocalPosts()

  const seen = new Set<string>()
  const combined = [...sanityPosts, ...localPosts].filter((post) => {
    if (seen.has(post.slug)) return false
    seen.add(post.slug)
    return true
  })

  return combined.sort((a, b) => String(b.date).localeCompare(String(a.date)))
}

export async function getPublishedPostBySlug(slug: string): Promise<Post | null> {
  try {
    const sanityPost = await client.fetch<SanityPost | null>(
      `*[_type == "post" && slug.current == $slug][0] {${postFields}}`,
      {slug},
      {next: {revalidate: 60}}
    )

    if (sanityPost) return normalizeSanityPost(sanityPost)
  } catch (error) {
    console.error('Sanity post fetch failed:', error)
  }

  return getLocalPostBySlug(slug)
}

export async function searchPublishedPosts(query: string): Promise<PostMeta[]> {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const sanityPosts = await getSanityPosts()
  const localPosts = searchLocalPosts(q)

  const combined = [...sanityPosts, ...localPosts]
  const seen = new Set<string>()

  return combined.filter((post) => {
    if (seen.has(post.slug)) return false
    seen.add(post.slug)

    return [
      post.title,
      post.excerpt,
      post.categories.join(' '),
      post.tags.join(' '),
    ].join(' ').toLowerCase().includes(q)
  })
}

export async function getPublishedCategories() {
  const posts = await getAllPublishedPosts()
  const counts = new Map<string, number>()

  posts.forEach((post) => {
    const list = post.categories.length ? post.categories : ['Travel']
    list.forEach((category) => counts.set(category, (counts.get(category) || 0) + 1))
  })

  return Array.from(counts.entries())
    .map(([name, count]) => ({name, slug: slugify(name), count}))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export {slugify}
