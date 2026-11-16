import type { Metadata } from 'next'
import React from 'react'
import { Footer, Header } from './components/SiteChrome'
import { getSiteData } from './lib/data'
import './styles.css'
import './green.css'

export const metadata: Metadata = {
  description: 'BlechRegen – bayerisch-böhmische Blasmusik mit kolumbianischem Flair aus Regensburg.',
  title: 'BlechRegen | Band & Musik aus Regensburg',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getSiteData()
  return (
    <html lang="de" data-scroll-behavior="smooth">
      <body id="start"><a className="green-skip-link" href="#inhalt">Zum Inhalt</a><Header settings={settings} /><div id="inhalt">{children}</div><Footer settings={settings} /></body>
    </html>
  )
}
