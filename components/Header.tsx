import Image from 'next/image'
import Link from 'next/link'
import SearchBox from './SearchBox'

export default function Header() {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <Link href="/" className="logo-link" aria-label="David Travel home">
            <Image src="/logo.jpg" alt="David Travel" width={160} height={160} className="logo-img" priority />
          </Link>

          <nav className="nav" aria-label="Primary navigation">
            <Link href="/categories">Categories</Link>
            <Link href="/about">About Us</Link>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-service">Terms</Link>
            <Link href="/do-not-sell-my-information">Do Not Sell</Link>
            <Link href="/studio">Studio</Link>
          </nav>
        </div>
      </header>
      <SearchBox />
    </>
  )
}
