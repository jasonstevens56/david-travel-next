import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Sidebar from '@/components/Sidebar'
import {getPublishedPostBySlug} from '@/lib/content'
import {notFound} from 'next/navigation'

export const dynamic = 'force-dynamic'

function renderContent(content: string) {
  if (content.trim().startsWith('<')) {
    return <div dangerouslySetInnerHTML={{__html: content}} />
  }

  return content.split('\n\n').map((paragraph, index) => (
    <p key={index}>{paragraph}</p>
  ))
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{slug: string}>
}) {
  const {slug} = await params
  const post = await getPublishedPostBySlug(slug)

  if (!post) notFound()

  return (
    <>
      <Header />
      <main className="container layout-grid">
        <article>
          <div className="post-content">
            {post.date && <div className="article-date">{post.date}</div>}
            <h1 style={{fontSize: 46, lineHeight: 1.08, letterSpacing: '-0.04em'}}>{post.title}</h1>
            {renderContent(post.content)}
          </div>
        </article>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}
