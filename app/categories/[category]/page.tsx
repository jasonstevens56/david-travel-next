import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import Sidebar from '@/components/Sidebar'
import {getAllPublishedPosts, slugify} from '@/lib/content'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{category: string}>
}) {
  const {category} = await params
  const posts = (await getAllPublishedPosts()).filter((post) => {
    const categories = post.categories.length ? post.categories : ['Travel']
    return categories.some((name) => slugify(name) === category)
  })
  const categoryName = posts[0]?.categories.find((name) => slugify(name) === category) || 'Travel'

  return (
    <>
      <Header />
      <main className="container layout-grid">
        <section className="article-list">
          <h1 style={{fontSize: 42, margin: 0}}>Category: {categoryName}</h1>
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
