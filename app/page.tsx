import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import Sidebar from '@/components/Sidebar'
import {getAllPublishedPosts} from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const posts = await getAllPublishedPosts()
  const featured = posts.slice(0, 12)

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="container">
            <h1>Travel smarter. Eat better. Avoid the junk fees.</h1>
            <p>
              Honest travel commentary, restaurant reviews, airline observations,
              hotel tips, and practical advice from David Travel.
            </p>
          </div>
        </section>

        <div className="container layout-grid">
          <section className="article-list" aria-label="Featured articles">
            {featured.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </section>
          <Sidebar />
        </div>
      </main>
      <Footer />
    </>
  )
}
