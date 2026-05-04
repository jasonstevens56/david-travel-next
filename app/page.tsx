import Link from 'next/link'

export default function HomePage() {
  return (
    <main style={{maxWidth: 960, margin: '0 auto', padding: '48px 24px'}}>
      <p style={{fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', color: '#666'}}>David Travel</p>
      <h1 style={{fontSize: 52, lineHeight: 1.05, margin: '12px 0'}}>Travel stories, guides, and ideas.</h1>
      <p style={{fontSize: 20, lineHeight: 1.6, color: '#444', maxWidth: 720}}>
        Your React/Next.js site is running. Use the links below to view the public blog or manage content in Sanity Studio.
      </p>
      <div style={{display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap'}}>
        <Link href="/blog" style={{padding: '14px 18px', border: '1px solid #111', borderRadius: 10, color: '#111', textDecoration: 'none'}}>View Blog</Link>
        <Link href="/studio" style={{padding: '14px 18px', background: '#111', color: 'white', borderRadius: 10, textDecoration: 'none'}}>Open Studio</Link>
      </div>
    </main>
  )
}
