import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Industry Directory',
  description: 'A comprehensive directory of industry contacts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-dark-950 text-dark-100 min-h-screen">{children}</body>
    </html>
  )
}
