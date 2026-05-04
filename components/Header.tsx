import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <nav className="container nav">
        <Link href="/" className="brand">david.travel</Link>
        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/blog">Blog</Link>
        </div>
      </nav>
    </header>
  );
}
