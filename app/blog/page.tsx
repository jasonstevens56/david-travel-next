import fs from 'fs'
import path from 'path'
import Link from 'next/link'

function getPosts() {
  const postsDir = path.join(process.cwd(), 'content', 'posts')
  if (!fs.existsSync(postsDir)) return []

  return fs.readdirSync(postsDir)
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, '')
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf8')
      const titleMatch = raw.match(/title:\s*["']?(.+?)["']?\s*$/m)
      const dateMatch = raw.match(/date:\s*["']?(.+?)["']?\s*$/m)
      return {
        slug,
        title: titleMatch?.[1] || slug.replaceAll('-', ' '),
        date: dateMatch?.[1] || '',
      }
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
}

export default function BlogPage() {
  const posts = getPosts()

  return (
    <main style={{maxWidth: 960, margin: '0 auto', padding: '48px 24px'}}>
      <Link href="/" style={{color: '#555'}}>← Home</Link>
      <h1 style={{fontSize: 42}}>Blog</h1>
      {posts.length === 0 ? (
        <p>No local MDX posts found yet. Check that your posts are in <code>content/posts</code>.</p>
      ) : (
        <div style={{display: 'grid', gap: 18}}>
          {posts.map((post) => (
            <article key={post.slug} style={{background: 'white', padding: 24, borderRadius: 14, border: '1px solid #eee'}}>
              <h2 style={{margin: '0 0 8px'}}><Link href={`/blog/${post.slug}`} style={{color: '#111', textDecoration: 'none'}}>{post.title}</Link></h2>
              {post.date && <p style={{color: '#666', margin: 0}}>{post.date}</p>}
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
