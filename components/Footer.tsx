import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <strong>David Travel</strong>
        <div className="footer-links">
          <Link href="/about">About Us</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-of-service">Terms of Service</Link>
          <Link href="/do-not-sell-my-information">Do Not Sell My Information</Link>
        </div>
      </div>
    </footer>
  )
}
