import './globals.css'

export const metadata = {
  title: 'David Travel',
  description: 'Travel stories, guides, reviews, and practical travel advice.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
