import Link from 'next/link'
import type { SiteSetting } from '@/payload-types'
import { MobileMenu } from './MobileMenu'

const navigation = [
  ['Band & Musik', '/band'],
  ['Termine', '/termine'],
  ['Media', '/media'],
] as const

export function Header({ settings }: { settings: SiteSetting }) {
  void settings
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="BlechRegen – Startseite"><span className="brand-type">Blech<span>Regen</span><b>✳</b></span></Link>
      <nav className="desktop-nav" aria-label="Hauptnavigation">
        {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>
      <Link className="concept-button concept-button-sun header-cta" href="/booking">Buch uns</Link>
      <MobileMenu navigation={navigation}/>
    </header>
  )
}

export function Footer({ settings }: { settings: SiteSetting }) {
  const email = settings.contact?.email || 'blechregen@gmail.com'
  const instagram = settings.socialMedia?.instagram || 'https://www.instagram.com/blechregen/'
  return (
    <footer className="site-footer">
      <div className="footer-topline"><a href="#start">Zurück nach oben ↑</a></div>
      <div className="footer-columns">
        <div><strong>Kontakt</strong><Link href="/booking">Buch uns</Link><a href={`mailto:${email}`}>{email}</a></div>
        <div><strong>Folgen</strong><a href={instagram} rel="noreferrer" target="_blank">Instagram ↗</a>{settings.socialMedia?.youtube && <a href={settings.socialMedia.youtube} rel="noreferrer" target="_blank">YouTube ↗</a>}</div>
        <div><strong>Rechtliches</strong><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} BlechRegen</span><span>Sieben Musiker · Regensburg</span></div>
    </footer>
  )
}

export function PageHero({ title, intro, tone = 'dark' }: { eyebrow?: string; title: string; intro: string; tone?: 'dark' | 'yellow' | 'coral' }) {
  return <section className={`page-hero page-hero-${tone}`}><div className="concept-container"><h1>{title}</h1><p>{intro}</p></div></section>
}

export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="arrow-link" href={href}>{children}<span aria-hidden="true">↗</span></Link>
}
