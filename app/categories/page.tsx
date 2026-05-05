import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import {getCategories} from '@/lib/posts'

export const metadata = {
  title: 'Categories | David Travel',
}

export default function CategoriesPage() {
  const categories = getCategories()

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
