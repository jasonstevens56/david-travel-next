import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import {getPostBySlug} from '@/lib/posts'
import {notFound} from 'next/navigation'

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  return (
    <>
      <Header />
      <main className="container layout-grid">
        <article>
          <div className="post-content">
            {post.date && <div className="article-date">{post.date}</div>}
            <h1 style={{fontSize: 46, lineHeight: 1.08, letterSpacing: '-0.04em'}}>{post.title}</h1>
            <div dangerouslySetInnerHTML={{__html: post.content}} />
          </div>
        </article>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}
