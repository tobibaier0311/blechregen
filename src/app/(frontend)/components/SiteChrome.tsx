import Link from 'next/link'
import type { SiteSetting } from '@/payload-types'

const navigation = [
  ['Band', '/band'],
  ['Musik', '/musik'],
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
      <Link className="button button-accent header-cta" href="/booking">Buch uns ↗</Link>
      <details className="mobile-menu">
        <summary aria-label="Menü öffnen"><span /><span /></summary>
        <nav aria-label="Mobile Navigation">
          {navigation.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
          <Link href="/booking">Booking</Link>
          <Link href="/kontakt">Kontakt</Link>
        </nav>
      </details>
    </header>
  )
}

export function Footer({ settings }: { settings: SiteSetting }) {
  const email = settings.contact?.email || 'blechregen@gmail.com'
  const instagram = settings.socialMedia?.instagram || 'https://www.instagram.com/blechregen/'
  return (
    <footer className="site-footer">
      <div className="footer-topline"><div className="footer-wordmark">Blech<span>Regen.</span></div><a href="#start">Zurück nach oben ↑</a></div>
      <div className="footer-columns">
        <div><strong>Direkt</strong><Link href="/booking">Booking</Link><Link href="/kontakt">Kontakt</Link><a href={`mailto:${email}`}>{email}</a></div>
        <div><strong>Folgen</strong><a href={instagram} rel="noreferrer" target="_blank">Instagram ↗</a>{settings.socialMedia?.youtube && <a href={settings.socialMedia.youtube} rel="noreferrer" target="_blank">YouTube ↗</a>}</div>
        <div><strong>Rechtliches</strong><Link href="/impressum">Impressum</Link><Link href="/datenschutz">Datenschutz</Link><Link href="/admin">Redaktion</Link></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} BlechRegen</span><span>Sieben Musiker · Regensburg</span></div>
    </footer>
  )
}

export function PageHero({ eyebrow, title, intro, tone = 'dark' }: { eyebrow: string; title: string; intro: string; tone?: 'dark' | 'yellow' | 'coral' }) {
  return <section className={`page-hero page-hero-${tone}`}><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></section>
}

export function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="arrow-link" href={href}>{children}<span aria-hidden="true">↗</span></Link>
}
