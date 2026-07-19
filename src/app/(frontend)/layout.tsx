import type { Metadata } from 'next'
import React from 'react'
import './styles.css'

export const metadata: Metadata = {
  description: 'BlechRegen – bayerisch-böhmische Blasmusik mit kolumbianischem Flair aus Regensburg.',
  title: 'BlechRegen | Blasmusik zum Aufwachen',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  )
}
