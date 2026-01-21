import type { Metadata } from 'next'
import '../src/app/globals.css'

export const metadata: Metadata = {
  title: 'Sidra Content Factory',
  description: 'Arabic RTL content creation platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}
