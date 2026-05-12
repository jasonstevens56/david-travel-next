import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Do Not Sell My Personal Information | David Travel',
}

export default function Page() {
  return (
    <>
      <Header />
      <main className="page-main">
        <article className="page-card">
          <h1>Do Not Sell My Personal Information</h1>
          <p>David Travel does not knowingly sell personal information. Contact us for privacy-related requests.</p>
        </article>
      </main>
      <Footer />
    </>
  )
}
