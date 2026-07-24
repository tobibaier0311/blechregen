import type { Metadata } from 'next'
import React from 'react'
import { Footer, Header } from './components/SiteChrome'
import { getSiteData } from './lib/data'
import './styles.css'

export const metadata: Metadata = {
  description: 'BlechRegen – bayerisch-böhmische Blasmusik mit kolumbianischem Flair aus Regensburg.',
  title: 'BlechRegen | Blasmusik zum Aufwachen',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getSiteData()
  return (
    <html lang="de">
      <body><Header settings={settings} />{children}<Footer settings={settings} /></body>
    </html>
  )
}
