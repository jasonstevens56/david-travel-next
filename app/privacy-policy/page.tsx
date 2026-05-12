import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Privacy Policy | David Travel',
}

export default function Page() {
  return (
    <>
      <Header />
      <main className="page-main">
        <article className="page-card">
          <h1>Privacy Policy</h1>
          <p>This Privacy Policy explains how David Travel may collect and use information submitted through this website, including newsletter signup information.</p>
        </article>
      </main>
      <Footer />
    </>
  )
}
