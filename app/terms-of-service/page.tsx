import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Terms of Service | David Travel',
}

export default function Page() {
  return (
    <>
      <Header />
      <main className="page-main">
        <article className="page-card">
          <h1>Terms of Service</h1>
          <p>By using David Travel, you agree to use the site for lawful purposes and understand that content is provided for informational and editorial purposes.</p>
        </article>
      </main>
      <Footer />
    </>
  )
}
