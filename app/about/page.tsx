import Header from '@/components/Header'
import Footer from '@/components/Footer'

const paragraphs = ["ABOUT US", "We know first-hand the challenges people have in planning and traveling whether locally, nationally or overseas.  We created DavidDotTravel.com to share with you our thoughts and knowledge on travel related challenges.", "DavidDotTravel.com was created by travelers for travelers.  We hope to provide you some help with your next adventure.", "We promise to spend as much time as we can to assist you out in this process.  We acknowledge that we are not perfect but we strive to continue to improve and drive better results for you.", "Our team brings decades of experience and mistakes in travel.  We hope to impart our wisdom on how best to travel and help you avoid the mistakes we have made."]

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
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>
      </main>
      <Footer />
    </>
  )
}
