import Link from 'next/link'
import type {PostMeta} from '@/lib/posts'
import ImageWithFallback from './ImageWithFallback'

export default function ArticleCard({post}: {post: PostMeta}) {
  return (
    <article className="article-card">
      <Link href={`/blog/${post.slug}`} className="article-image" aria-label={post.title}>
        <ImageWithFallback
          src={post.featuredImage || '/logo.svg'}
          fallbackSrc="/logo.svg"
          alt=""
          loading="lazy"
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
