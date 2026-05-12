import {createClient} from '@sanity/client'
import {getAllPosts as getLocalPosts, getPostBySlug as getLocalPostBySlug, slugify} from './posts'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4d8eg4j',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  useCdn: false,
})

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

function plainText(blocks: any) {
  if (!Array.isArray(blocks)) return ''
  return blocks
    .map((block) => {
      if (block?._type !== 'block' || !Array.isArray(block.children)) return ''
      return block.children.map((child: any) => child.text || '').join('')
    })
    .join('\n\n')
    .trim()
}

function makeExcerpt(text: string, length = 220) {
  const clean = String(text || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  if (clean.length <= length) return clean
  return clean.slice(0, length).replace(/\s+\S*$/, '') + '...'
}

function categoryNames(value: any): string[] {
  if (!value) return []
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') return item
        return item?.title || item?.name || ''
      })
      .filter(Boolean)
  }
  if (typeof value === 'string') return [value]
  return []
}

function normalizeSanityPost(post: any): PublishedPost {
  const slug = post?.slug?.current || post?.slug || ''
  const date = post?.publishedAt || post?.date || ''
  const text = post?.bodyHtml || plainText(post?.body) || post?.content || ''
  const mainImage = post?.mainImageUrl || post?.featuredImage || post?.image || post?.coverImage

  return {
    title: post?.title || slug.replaceAll('-', ' '),
    slug,
    date,
    excerpt: post?.excerpt || post?.description || makeExcerpt(text),
    featuredImage: mainImage,
    categories: categoryNames(post?.categories || post?.category),
    tags: categoryNames(post?.tags),
    content: post?.bodyHtml || text,
  }
}

function localImageForSanityPost(post: PublishedPost) {
  const locals = getLocalPosts()

  const bySlug = locals.find((local) => local.slug === post.slug)
  if (bySlug?.featuredImage && bySlug.featuredImage !== '/logo.svg') return bySlug.featuredImage

  const byTitle = locals.find((local) => local.title.trim().toLowerCase() === post.title.trim().toLowerCase())
  if (byTitle?.featuredImage && byTitle.featuredImage !== '/logo.svg') return byTitle.featuredImage

  const postTitleSlug = slugify(post.title || '')
  const byTitleSlug = locals.find((local) => local.slug === postTitleSlug)
  if (byTitleSlug?.featuredImage && byTitleSlug.featuredImage !== '/logo.svg') return byTitleSlug.featuredImage

  return undefined
}

function mergeLocalImage(post: PublishedPost): PublishedPost {
  const localImage = localImageForSanityPost(post)

  return {
    ...post,
    featuredImage:
      localImage ||
      (post.featuredImage && post.featuredImage !== '/logo.svg' ? post.featuredImage : undefined) ||
      '/logo.svg',
  }
}

function localFallbackPosts(): PublishedPost[] {
  return getLocalPosts().map((post) => ({
    title: post.title,
    slug: post.slug,
    date: post.date,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    categories: post.categories,
    tags: post.tags,
    content: '',
  }))
}

export async function getPublishedPosts(): Promise<PublishedPost[]> {
  try {
    const sanityPosts = await client.fetch(`
      *[_type == "post" && defined(slug.current)] | order(coalesce(publishedAt, date) desc) {
        title,
        "slug": slug.current,
        publishedAt,
        date,
        excerpt,
        description,
        body,
        content,
        bodyHtml,
        "mainImageUrl": mainImage.asset->url,
        featuredImage,
        image,
        coverImage,
        categories[]->{title},
        tags
      }
    `)

    const normalized = Array.isArray(sanityPosts)
      ? sanityPosts.map(normalizeSanityPost).map(mergeLocalImage)
      : []

    return normalized.length ? normalized : localFallbackPosts()
  } catch {
    return localFallbackPosts()
  }
}

export async function getPublishedPostBySlug(slug: string): Promise<PublishedPost | null> {
  try {
    const sanityPost = await client.fetch(
      `
      *[_type == "post" && slug.current == $slug][0] {
        title,
        "slug": slug.current,
        publishedAt,
        date,
        excerpt,
        description,
        body,
        content,
        bodyHtml,
        "mainImageUrl": mainImage.asset->url,
        featuredImage,
        image,
        coverImage,
        categories[]->{title},
        tags
      }
    `,
      {slug}
    )

    if (sanityPost) {
      const normalized = mergeLocalImage(normalizeSanityPost(sanityPost))
      const local = getLocalPostBySlug(slug)

      return {
        ...normalized,
        content: normalized.content || local?.content || '',
        featuredImage:
          local?.featuredImage && local.featuredImage !== '/logo.svg'
            ? local.featuredImage
            : normalized.featuredImage,
      }
    }
  } catch {
    // fall back below
  }

  const local = getLocalPostBySlug(slug)
  if (!local) return null

  return {
    title: local.title,
    slug: local.slug,
    date: local.date,
    excerpt: local.excerpt,
    featuredImage: local.featuredImage,
    categories: local.categories,
    tags: local.tags,
    content: local.content,
  }
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
  const posts = await getPublishedPosts()
  const q = query.trim().toLowerCase()
  if (!q) return []
  return posts.filter((post) =>
    [post.title, post.excerpt, post.categories.join(' '), post.tags.join(' ')]
      .join(' ')
      .toLowerCase()
      .includes(q)
  )
}

