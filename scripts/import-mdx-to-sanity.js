#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const {createClient} = require('@sanity/client')

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'e4d8eg4j'
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_WRITE_TOKEN

if (!TOKEN) {
  console.error('\nERROR: Missing SANITY_WRITE_TOKEN.')
  process.exit(1)
}

const projectRoot = process.cwd()
const postsDir = path.join(projectRoot, 'content', 'posts')

if (!fs.existsSync(postsDir)) {
  console.error(`ERROR: Could not find ${postsDir}`)
  process.exit(1)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  token: TOKEN,
  apiVersion: '2026-05-04',
  useCdn: false,
})

function parseFrontmatter(raw) {
  if (!raw.startsWith('---')) return [{}, raw]

  const end = raw.indexOf('\n---', 3)
  if (end === -1) return [{}, raw]

  const fmText = raw.slice(3, end).trim()
  const body = raw.slice(end + 4).trim()
  const data = {}

  for (const line of fmText.split('\n')) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    value = value.replace(/^['"]|['"]$/g, '')

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((v) => v.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    }

    data[key] = value
  }

  return [data, body]
}

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .replace(/\.mdx?$/, '')
    .replace(/&amp;/g, 'and')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function safeDocId(slug) {
  const hash = crypto.createHash('sha1').update(slug).digest('hex').slice(0, 12)
  const shortSlug = slug.slice(0, 80).replace(/-+$/g, '')
  return `post-${shortSlug}-${hash}`
}

function textToBlocks(markdown) {
  const cleaned = markdown
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/#{1,6}\s+/g, '')
    .replace(/[*_`>]/g, '')
    .trim()

  const paragraphs = cleaned
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 200)

  return paragraphs.map((p, index) => ({
    _type: 'block',
    _key: `b${index}${Math.random().toString(36).slice(2, 8)}`,
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: `s${index}${Math.random().toString(36).slice(2, 8)}`,
        text: p,
        marks: [],
      },
    ],
  }))
}

async function main() {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))

  console.log(`Found ${files.length} local posts in content/posts`)
  let created = 0
  let updated = 0
  let skipped = 0

  for (const file of files) {
    const filePath = path.join(postsDir, file)
    const raw = fs.readFileSync(filePath, 'utf8')
    const [frontmatter, body] = parseFrontmatter(raw)

    const slug = slugify(frontmatter.slug || file.replace(/\.mdx?$/, ''))
    const title = frontmatter.title || slug.replace(/-/g, ' ')
    const publishedAt = frontmatter.date || frontmatter.publishedAt || new Date().toISOString()
    const excerpt = frontmatter.excerpt || frontmatter.description || ''

    if (!slug || !title) {
      console.log(`Skipping ${file}: missing slug/title`)
      skipped++
      continue
    }

    const docId = safeDocId(slug)

    const doc = {
      _id: docId,
      _type: 'post',
      title,
      slug: {
        _type: 'slug',
        current: slug,
      },
      publishedAt,
      excerpt,
      body: textToBlocks(body),
    }

    const existing = await client.fetch('*[_id == $id][0]._id', {id: docId})
    await client.createOrReplace(doc)

    if (existing) {
      updated++
      console.log(`Updated: ${title}`)
    } else {
      created++
      console.log(`Created: ${title}`)
    }
  }

  console.log('\nImport complete.')
  console.log(`Created: ${created}`)
  console.log(`Updated: ${updated}`)
  console.log(`Skipped: ${skipped}`)
  console.log('\nOpen Sanity Studio:')
  console.log('http://localhost:3000/studio/structure/post')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
