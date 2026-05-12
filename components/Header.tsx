import Link from 'next/link'
import SearchBox from './SearchBox'
import ImageWithFallback from './ImageWithFallback'

export default function Header() {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="logo-link" aria-label="David Travel home">
            <ImageWithFallback
              src="/logo.jpg"
              fallbackSrc="/logo.svg"
              alt="David Travel"
              className="logo-img"
              loading="eager"
            />
          </Link>

          <nav className="nav" aria-label="Primary navigation">
            <Link href="/categories">Categories</Link>
            <Link href="/about">About Us</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms</Link>
            <Link href="/do-not-sell-my-information">Do Not Sell</Link>
            <Link href="/studio" className="login-link">Login</Link>
          </nav>
        </div>
      </header>
      <SearchBox />
    </>
  )
}
