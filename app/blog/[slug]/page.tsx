import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import {notFound} from 'next/navigation'

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const postsDir = path.join(process.cwd(), 'content', 'posts')
  const mdxPath = path.join(postsDir, `${slug}.mdx`)
  const mdPath = path.join(postsDir, `${slug}.md`)
  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null

  if (!filePath) notFound()

  const raw = fs.readFileSync(filePath, 'utf8')
  const titleMatch = raw.match(/title:\s*["']?(.+?)["']?\s*$/m)
  const title = titleMatch?.[1] || slug.replaceAll('-', ' ')
  const body = raw.replace(/^---[\s\S]*?---/, '').trim()

  return (
    <main style={{maxWidth: 820, margin: '0 auto', padding: '48px 24px'}}>
      <Link href="/blog" style={{color: '#555'}}>← Blog</Link>
      <h1 style={{fontSize: 42, lineHeight: 1.1}}>{title}</h1>
      <article style={{whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: 18}}>
        {body}
      </article>
    </main>
  )
}
