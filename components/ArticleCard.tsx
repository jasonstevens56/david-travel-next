import Link from 'next/link'
import type {PostMeta} from '@/lib/posts'

export default function ArticleCard({post}: {post: PostMeta}) {
  const imageSrc = post.featuredImage || '/logo.svg'

  return (
    <article className="article-card">
      <Link href={`/blog/${post.slug}`} className="article-image" aria-label={post.title}>
        <img
          src={imageSrc}
          alt=""
          loading="lazy"
          onError={(event) => {
            const img = event.currentTarget
            if (!img.src.endsWith('/logo.svg')) {
              img.src = '/logo.svg'
            }
          }}
        />
      </Link>

      <div className="article-body">
        {post.date && <div className="article-date">{post.date}</div>}
        <h2>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p>{post.excerpt}</p>
        <Link className="read-more" href={`/blog/${post.slug}`}>Read article →</Link>
      </div>
    </article>
  )
}
