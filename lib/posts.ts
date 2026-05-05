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
    return trimmed
      .slice(1, -1)
      .split(',')
      .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
      .filter(Boolean)
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

function findFirstImage(content: string, data: Record<string, any>) {
  const explicit = data.featuredImage || data.featured_image || data.image || data.coverImage
  if (explicit) return String(explicit)

  const html = content.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1]
  if (html) return html

  const md = content.match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1]
  if (md) return md

  return '/logo.jpg'
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
  const fileCandidates = [
    path.join(postsDirectory, `${slug}.mdx`),
    path.join(postsDirectory, `${slug}.md`),
  ]
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
    content,
  }
}

export function getCategories() {
  const counts = new Map<string, number>()

  getAllPosts().forEach((post) => {
    const list = post.categories.length ? post.categories : ['Travel']
    list.forEach((category) => counts.set(category, (counts.get(category) || 0) + 1))
  })

  return Array.from(counts.entries())
    .map(([name, count]) => ({name, slug: slugify(name), count}))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function searchPosts(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return getAllPosts().filter((post) => {
    return [
      post.title,
      post.excerpt,
      post.categories.join(' '),
      post.tags.join(' '),
    ].join(' ').toLowerCase().includes(q)
  })
}