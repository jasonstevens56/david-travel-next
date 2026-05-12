import fs from 'fs'
import path from 'path'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export type PostMeta = {
  title: string
  slug: string
  date: string
  excerpt: string
  featuredImage?: string
  categories: string[]
  tags: string[]
}

export type Post = PostMeta & {
  content: string
}

function parseValue(value: string): any {
  const trimmed = value.trim().replace(/^['"]|['"]$/g, '')
  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    return trimmed.slice(1, -1).split(',').map((item) => item.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
  }
  return trimmed
}

function parseFrontmatter(raw: string): {data: Record<string, any>, content: string} {
  if (!raw.startsWith('---')) return {data: {}, content: raw}
  const end = raw.indexOf('\n---', 3)
  if (end === -1) return {data: {}, content: raw}

  const fm = raw.slice(3, end).trim()
  const content = raw.slice(end + 4).trim()
  const data: Record<string, any> = {}
  const lines = fm.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const rest = line.slice(idx + 1).trim()

    if (!rest && i + 1 < lines.length && lines[i + 1].trim().startsWith('- ')) {
      const arr: string[] = []
      while (i + 1 < lines.length && lines[i + 1].trim().startsWith('- ')) {
        i++
        arr.push(lines[i].trim().replace(/^-\s*/, '').replace(/^['"]|['"]$/g, ''))
      }
      data[key] = arr
    } else {
      data[key] = parseValue(rest)
    }
  }

  return {data, content}
}

function stripHtml(input: string) {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

export function makeExcerpt(content: string, fallback = '', length = 220) {
  const text = stripHtml(fallback || content)
  if (text.length <= length) return text
  return text.slice(0, length).replace(/\s+\S*$/, '') + '...'
}

function normalizeArray(value: any): string[] {
  if (!value) return []
  if (Array.isArray(value)) return value.map(String)
  return String(value).split(',').map((v) => v.trim()).filter(Boolean)
}

function normalizeImageUrl(src: string | undefined) {
  if (!src) return undefined

  let cleaned = String(src).trim().replace(/^['"]|['"]$/g, '').replace(/&amp;/g, '&')
  if (!cleaned) return undefined

  const uploadsMatch = cleaned.match(/\/wp-content\/uploads\/(.+)$/i)
  if (uploadsMatch?.[1]) return `/wp-content/uploads/${uploadsMatch[1]}`

  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) return cleaned
  if (cleaned.startsWith('//')) return `https:${cleaned}`
  if (cleaned.startsWith('/')) return cleaned
  if (cleaned.startsWith('wp-content/uploads/')) return `/${cleaned}`
  if (cleaned.startsWith('uploads/')) return `/wp-content/${cleaned}`
  return cleaned
}

function findFirstImage(content: string, data: Record<string, any>) {
  const candidates = [data.featuredImage, data.featured_image, data.image, data.coverImage, data.thumbnail, data.ogImage]

  for (const candidate of candidates) {
    const normalized = normalizeImageUrl(candidate)
    if (normalized) return normalized
  }

  const htmlPatterns = [
    /<img[^>]+src=["']([^"']+)["']/i,
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
  ]

  for (const pattern of htmlPatterns) {
    const match = content.match(pattern)?.[1]
    const normalized = normalizeImageUrl(match)
    if (normalized) return normalized
  }

  const md = content.match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1]
  const normalizedMd = normalizeImageUrl(md)
  if (normalizedMd) return normalizedMd

  return '/logo.svg'
}

export function preparePostHtml(content: string) {
  return content.replace(/<img([^>]+)src=["']([^"']+)["']([^>]*)>/gi, (_match, before, src, after) => {
    const normalized = normalizeImageUrl(src) || '/logo.svg'
    return `<img${before}src="${normalized}"${after} onerror="this.onerror=null;this.src='/logo.svg';">`
  })
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return []

  return fs.readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(postsDirectory, file), 'utf8')
      const {data, content} = parseFrontmatter(raw)
      const slug = String(data.slug || file.replace(/\.mdx?$/, ''))
      const title = String(data.title || slug.replaceAll('-', ' '))
      const date = String(data.date || data.publishedAt || '')
      const categories = normalizeArray(data.categories || data.category)
      const tags = normalizeArray(data.tags)

      return {
        title,
        slug,
        date,
        excerpt: makeExcerpt(content, String(data.excerpt || data.description || '')),
        featuredImage: findFirstImage(content, data),
        categories,
        tags,
      }
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
}

export function getPostBySlug(slug: string): Post | null {
  const fileCandidates = [path.join(postsDirectory, `${slug}.mdx`), path.join(postsDirectory, `${slug}.md`)]
  const filePath = fileCandidates.find((candidate) => fs.existsSync(candidate))
  if (!filePath) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const {data, content} = parseFrontmatter(raw)
  const title = String(data.title || slug.replaceAll('-', ' '))
  const date = String(data.date || data.publishedAt || '')
  const categories = normalizeArray(data.categories || data.category)
  const tags = normalizeArray(data.tags)

  return {
    title,
    slug,
    date,
    excerpt: makeExcerpt(content, String(data.excerpt || data.description || '')),
    featuredImage: findFirstImage(content, data),
    categories,
    tags,
    content: preparePostHtml(content),
  }
}

export function slugify(value: string) {
  return value.toLowerCase().replace(/&amp;/g, 'and').replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

export function searchPosts(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return getAllPosts().filter((post) => {
    return [post.title, post.excerpt, post.categories.join(' '), post.tags.join(' ')].join(' ').toLowerCase().includes(q)
  })
}
