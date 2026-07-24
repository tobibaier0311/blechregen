import Image from 'next/image'
import Link from 'next/link'
import { ArrowLink } from './components/SiteChrome'
import { dateShort, eventPlace, getSiteData } from './lib/data'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { home, payload } = await getSiteData()
  const events = await payload.find({ collection: 'events', depth: 1, limit: 3, overrideAccess: false, sort: 'startDate', where: { startDate: { greater_than_equal: new Date().toISOString() } } })
  const heroImage = home.hero.image && typeof home.hero.image === 'object' && home.hero.image.url ? home.hero.image.url : '/images/blechregen-live.jpg'
  return <main>
    <section className="home-hero">
      <div className="hero-image"><Image alt="BlechRegen live" fill priority sizes="100vw" src={heroImage} unoptimized /></div>
      <div className="hero-wash" />
      <div className="hero-content">
        <p className="eyebrow">Sieben Musiker · Regensburg</p>
        <h1>Blasmusik<br /><em>zum Aufwachen.</em></h1>
        <p>{home.hero.text}</p>
        <div className="button-row"><Link className="button button-accent" href="/termine">Live erleben</Link><Link className="button button-ghost" href="/booking">BlechRegen buchen</Link></div>
      </div>
      <div className="hero-stamp"><span>BY</span><b>×</b><span>CO</span><small>Von Bayern<br />bis Bogotá</small></div>
    </section>

    <section className="manifesto content-grid">
      <p className="eyebrow">Das ist BlechRegen</p>
      <div><h2>Tradition im Herzen.<br /><span>Fernweh im Takt.</span></h2><p>Polka, Walzer und Märsche treffen auf Cumbia, Latin und den einen oder anderen musikalischen Umweg. Ehrlich gespielt, mit Freude serviert.</p><ArrowLink href="/band">Lernt uns kennen</ArrowLink></div>
    </section>

    <section className="sound-preview">
      <div className="sound-number">07</div>
      <div><p className="eyebrow">Unser Sound</p><h2>Vertraut.<br />Nur nicht ganz<br /><em>gewöhnlich.</em></h2></div>
      <div className="sound-notes"><article><span>01</span><h3>Bayerisch-böhmisch</h3><p>Polka, Walzer und Märsche – mit Gefühl und ohne großes Drumherum.</p></article><article><span>02</span><h3>Kolumbianischer Einschlag</h3><p>Rhythmen, bei denen selbst die Bierbank nicht still sitzen bleibt.</p></article><ArrowLink href="/musik">Unsere Musik entdecken</ArrowLink></div>
    </section>

    <section className="events-teaser section-wrap">
      <div className="section-title"><div><p className="eyebrow">Raus aus dem Proberaum</p><h2>Als Nächstes<br /><em>live.</em></h2></div><ArrowLink href="/termine">Alle Termine</ArrowLink></div>
      <div className="event-cards">{events.docs.length ? events.docs.map((event, index) => { const date = new Date(event.startDate); return <article className="event-card" key={event.id}><span className="event-index">0{index + 1}</span><time dateTime={event.startDate}><b>{dateShort.format(date).split(' ')[0]}</b>{dateShort.format(date).split(' ')[1]}</time><div><h3>{event.title}</h3><p>{eventPlace(event)}</p></div>{event.externalLink ? <a href={event.externalLink} rel="noreferrer" target="_blank" aria-label="Veranstaltung öffnen">↗</a> : <span>→</span>}</article> }) : <div className="no-events"><p>Der Kalender wird gerade gestimmt.</p><Link href="/booking">Holt BlechRegen zu euch →</Link></div>}</div>
    </section>

    <section className="booking-banner"><p className="eyebrow">Biergarten, Hochzeit oder Festival?</p><h2>Ihr habt den Anlass.<br /><em>Wir bringen den Regen.</em></h2><Link className="button button-dark" href="/booking">Unverbindlich anfragen</Link></section>
  </main>
}
