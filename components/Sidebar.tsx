import Link from 'next/link'
import {getAllPosts, getCategories} from '@/lib/posts'

export default function Sidebar() {
  const recent = getAllPosts().slice(0, 8)
  const categories = getCategories().slice(0, 12)

  return (
    <aside className="sidebar">
      <section className="sidebar-card">
        <h3>Most Recent Articles</h3>
        <ul className="recent-list">
          {recent.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="sidebar-card">
        <h3>Categories</h3>
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link href={`/categories/${category.slug}`}>{category.name} ({category.count})</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="sidebar-card">
        <h3>Free Newsletter</h3>
        <p>Get new David Travel articles by email.</p>
        <form
          className="newsletter"
          action={process.env.NEXT_PUBLIC_NEWSLETTER_ACTION || 'https://buttondown.email/api/emails/embed-subscribe/davidtravel'}
          method="post"
          target="_blank"
        >
          <input type="email" name="email" placeholder="you@example.com" required />
          <button type="submit">Sign Up</button>
        </form>
        <p style={{fontSize: 12, color: '#6b7280'}}>
          Uses Buttondown. Create a free Buttondown account and set NEXT_PUBLIC_NEWSLETTER_ACTION to your subscribe URL when ready.
        </p>
      </section>
    </aside>
  )
}
