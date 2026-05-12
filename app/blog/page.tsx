import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import Sidebar from '@/components/Sidebar'
import {getAllPublishedPosts} from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Blog | David Travel',
}

export default async function BlogPage() {
  const posts = await getAllPublishedPosts()

  return (
    <>
      <Header />
      <main className="container layout-grid">
        <section className="article-list">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}
