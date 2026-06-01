import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VerseFlash — Instantly Detect Bible References From Voice',
  description: 'Speak a Bible reference and VerseFlash displays the scripture in seconds. Built for churches, livestream teams, Bible teachers, and personal devotion.',
  keywords: ['Bible', 'scripture', 'voice', 'church', 'worship', 'Bible reference', 'sermon'],
  openGraph: {
    title: 'VerseFlash',
    description: 'Voice-powered Bible reference detection for churches and Bible study.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-poppins antialiased">{children}</body>
    </html>
  )
}
