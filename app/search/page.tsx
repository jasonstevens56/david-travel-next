import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import Sidebar from '@/components/Sidebar'
import {searchPosts} from '@/lib/posts'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{q?: string}>
}) {
  const {q = ''} = await searchParams
  const results = searchPosts(q)

  return (
    <>
      <Header />
      <main className="container layout-grid">
        <section className="article-list">
          <h1 style={{fontSize: 42, margin: 0}}>Search</h1>
          <p>{q ? `${results.length} result(s) for “${q}”` : 'Enter a search term above.'}</p>
          {results.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}
