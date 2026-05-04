export const metadata = {
  title: 'David Travel',
  description: 'Travel stories, guides, and blog posts from David Travel.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{margin: 0, fontFamily: 'Arial, sans-serif', background: '#fafafa', color: '#111'}}>
        {children}
      </body>
    </html>
  )
}
