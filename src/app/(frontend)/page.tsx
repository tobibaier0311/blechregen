import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Event, SiteSetting } from '@/payload-types'
import './styles.css'

// Redaktionsänderungen an Terminen und Kontaktdaten sollen ohne neuen Build sichtbar sein.
export const dynamic = 'force-dynamic'

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('de-DE', {
  hour: '2-digit',
  minute: '2-digit',
})

function contactPhone(settings: SiteSetting) {
  return settings.contact?.phoneNumbers?.[0]?.number || '+49 160 7790533'
}

function eventLocation(event: Event) {
  return [event.venueName, event.address?.city].filter(Boolean).join(' · ')
}

export default async function HomePage() {
  const payload = await getPayload({ config })
  const today = new Date().toISOString()

  const [settings, eventResult] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings' }),
    payload.find({
      collection: 'events',
      depth: 1,
      limit: 3,
      overrideAccess: false,
      sort: 'startDate',
      where: {
        startDate: { greater_than_equal: today },
      },
    }),
  ])

  const events = eventResult.docs
  const email = settings.contact?.email || 'blechregen@gmail.com'
  const phone = contactPhone(settings)
  const instagram = settings.socialMedia?.instagram || 'https://www.instagram.com/blechregen/'

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" href="#start" aria-label="BlechRegen – Startseite">
          <span className="brand-mark" aria-hidden="true">BR</span>
          <span>BlechRegen</span>
        </Link>

        <nav className="navigation" aria-label="Hauptnavigation">
          <a href="#ueber-uns">Über uns</a>
          <a href="#termine">Termine</a>
          <a href="#musik">Unsere Musik</a>
          <a className="nav-cta" href="#kontakt">Anfragen</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="start">
          <Image
            alt="Die sieben Musiker von BlechRegen mit ihren Instrumenten"
            className="hero-image"
            fill
            priority
            sizes="100vw"
            src="/images/blechregen-live.jpg"
          />
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow">Bayerisch · Böhmisch · Kolumbianisch</p>
            <h1>Blasmusik<br />zum Aufwachen.</h1>
            <p className="hero-copy">
              Sieben Musikanten, viel Blech und ein Schuss Latin – von Bayern bis Bogotá.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#termine">Live erleben</a>
              <a className="button button-ghost" href="#kontakt">BlechRegen buchen</a>
            </div>
          </div>
          <a className="hero-scroll" href="#ueber-uns" aria-label="Weiter zu Über uns">
            <span>Mehr von uns</span>
            <span aria-hidden="true">↓</span>
          </a>
        </section>

        <section className="intro section" id="ueber-uns">
          <div className="section-number" aria-hidden="true">01</div>
          <div className="intro-heading">
            <p className="eyebrow eyebrow-dark">Servus bei BlechRegen</p>
            <h2>Tradition im Herzen.<br /><em>Fernweh im Takt.</em></h2>
          </div>
          <div className="intro-copy">
            <p>
              Unsere Geschichte begann bei einem gepflegten Bockbieranstich: zünftige
              Blasmusik im Ohr, die Rhythmen einer Kolumbienreise noch im Kopf – und die
              Idee, beides in einer kleinen Besetzung zusammenzubringen.
            </p>
            <p>
              Heute spielen wir bayerisch-böhmische Klassiker mit Latin-Einschüben. Mal
              gemütlich, mal unerwartet, aber immer handgemacht und mit Freude am gemeinsamen
              Musizieren.
            </p>
            <a className="text-link" href="#musik">So klingt BlechRegen <span>→</span></a>
          </div>
        </section>

        <section className="manifesto" id="musik">
          <div className="manifesto-image-wrap">
            <Image
              alt="BlechRegen in klassischer siebenköpfiger Besetzung"
              className="manifesto-image"
              fill
              sizes="(max-width: 800px) 100vw, 52vw"
              src="/images/blechregen-live.jpg"
            />
          </div>
          <div className="manifesto-content">
            <p className="eyebrow">Unser Rezept</p>
            <p className="manifesto-title">7 Musikanten.<br />2 Welten.<br />1 BlechRegen.</p>
            <ul className="sound-list">
              <li><span>01</span><strong>Bayerisch-böhmisch</strong></li>
              <li><span>02</span><strong>Latin &amp; Cumbia</strong></li>
              <li><span>03</span><strong>Direkt &amp; handgemacht</strong></li>
            </ul>
          </div>
        </section>

        <section className="events section" id="termine">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow eyebrow-dark">Raus aus dem Proberaum</p>
              <h2>Nächste <em>Auftritte</em></h2>
            </div>
            <p className="events-note">Biergarten, Fest oder Feier – Hauptsache live.</p>
          </div>

          <div className="event-list">
            {events.length > 0 ? events.map((event) => {
              const date = new Date(event.startDate)
              return (
                <article className="event-row" key={event.id}>
                  <time dateTime={event.startDate}>
                    <span className="event-day">{String(date.getDate()).padStart(2, '0')}</span>
                    <span>{dateFormatter.format(date).replace(/^\d{2}\.?\s*/, '')}</span>
                  </time>
                  <div>
                    <h3>{event.title}</h3>
                    <p>{eventLocation(event)}</p>
                  </div>
                  <span className="event-time">{timeFormatter.format(date)} Uhr</span>
                  {event.externalLink ? (
                    <a className="event-link" href={event.externalLink} rel="noreferrer" target="_blank">
                      Details <span aria-hidden="true">↗</span>
                    </a>
                  ) : <span className="event-link event-link-muted">Bald mehr</span>}
                </article>
              )
            }) : (
              <div className="empty-events">
                <p className="eyebrow eyebrow-dark">Der Kalender füllt sich</p>
                <h3>Neue Termine folgen in Kürze.</h3>
                <p>Bis dahin: Für eure Veranstaltung sind wir direkt erreichbar.</p>
                <a className="text-link" href="#kontakt">Termin anfragen <span>→</span></a>
              </div>
            )}
          </div>
        </section>

        <section className="booking" id="kontakt">
          <div className="booking-kicker">Von der Bierbank bis Bogotá</div>
          <h2>Wann lassen wir es<br /><em>bei euch regnen?</em></h2>
          <p>
            Hochzeit, Vereinsfest, Biergarten oder Frühschoppen – erzählt uns, was ihr vorhabt.
          </p>
          <a className="button button-light" href={`mailto:${email}`}>Buchung anfragen</a>
          <div className="booking-details">
            <a href={`mailto:${email}`}>{email}</a>
            <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand">BlechRegen</div>
        <div className="footer-links">
          <a href={instagram} rel="noreferrer" target="_blank">Instagram ↗</a>
          <a href="https://blechregen.de/impressum" rel="noreferrer" target="_blank">Impressum ↗</a>
          <a href="https://blechregen.de/datenschutzerklarung" rel="noreferrer" target="_blank">Datenschutz ↗</a>
          <Link href="/admin">Redaktion</Link>
        </div>
        <p>© {new Date().getFullYear()} BlechRegen · Regensburg</p>
      </footer>
    </div>
  )
}
