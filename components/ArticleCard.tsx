import Image from 'next/image'
import Link from 'next/link'
import type {PostMeta} from '@/lib/posts'

export default function ArticleCard({post}: {post: PostMeta}) {
  return (
    <article className="article-card">
      <Link href={`/blog/${post.slug}`} className="article-image" aria-label={post.title}>
        <Image
          src={post.featuredImage || '/logo.jpg'}
          alt=""
          width={520}
          height={360}
          unoptimized={String(post.featuredImage || '').startsWith('http')}
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
