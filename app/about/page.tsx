import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'About Us | David Travel',
}

export default function Page() {
  return (
    <>
      <Header />
      <main className="page-main">
        <article className="page-card">
          <h1>About Us</h1>
          <p>David Travel shares travel commentary, restaurant reviews, airline observations, hotel tips, and practical advice for travelers.</p>
        </article>
      </main>
      <Footer />
    </>
  )
}
