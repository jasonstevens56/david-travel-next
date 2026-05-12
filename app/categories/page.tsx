import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import {getPublishedCategories} from '@/lib/content'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Categories | David Travel',
}

export default async function CategoriesPage() {
  const categories = await getPublishedCategories()

  return (
    <>
      <Header />
      <main className="page-main">
        <article className="page-card">
          <h1>Categories</h1>
          <ul className="category-list">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/categories/${category.slug}`}>{category.name} ({category.count})</Link>
              </li>
            ))}
          </ul>
        </article>
      </main>
      <Footer />
    </>
  )
}
