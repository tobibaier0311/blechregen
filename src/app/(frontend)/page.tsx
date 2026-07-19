import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import type { Event, HomePage, Media } from '@/payload-types'
import './styles.css'

export const dynamic = 'force-dynamic'

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('de-DE', {
  hour: '2-digit',
  minute: '2-digit',
})

const fallbackFeatures = [
  { title: 'Bayerisch-böhmisch', text: 'Polka, Walzer und Märsche – ehrlich gespielt und ohne großes Drumherum.' },
  { title: 'Ein Schuss Kolumbien', text: 'Latin, Cumbia und Rhythmen, bei denen auch die Bierbank mitwippt.' },
  { title: 'Sieben Musikanten', text: 'Eine kleine, flexible Besetzung für Biergarten, Fest und private Feier.' },
]

function mediaURL(media: HomePage['hero']['image']) {
  if (media && typeof media === 'object' && media.url) return media.url
  return '/images/blechregen-live.jpg'
}

function mediaAlt(media: HomePage['hero']['image']) {
  if (media && typeof media === 'object') return media.alt
  return 'Die sieben Musiker von BlechRegen mit ihren Instrumenten'
}

function eventLocation(event: Event) {
  return [event.venueName, event.address?.city].filter(Boolean).join(' · ')
}

function relatedMediaURL(media: number | Media | null | undefined) {
  return media && typeof media === 'object' && media.url ? media.url : undefined
}

export default async function Home() {
  const payload = await getPayload({ config })
  const [home, settings, eventResult] = await Promise.all([
    payload.findGlobal({ slug: 'home-page', depth: 1, draft: false }),
    payload.findGlobal({ slug: 'site-settings', depth: 1 }),
    payload.find({
      collection: 'events',
      depth: 1,
      limit: 4,
      overrideAccess: false,
      sort: 'startDate',
      where: { startDate: { greater_than_equal: new Date().toISOString() } },
    }),
  ])

  const email = settings.contact?.email || 'blechregen@gmail.com'
  const phone = settings.contact?.phoneNumbers?.[0]?.number || '+49 160 7790533'
  const instagram = settings.socialMedia?.instagram || 'https://www.instagram.com/blechregen/'
  const logoURL = relatedMediaURL(settings.logo)
  const features = home.music.features?.length ? home.music.features : fallbackFeatures

  return (
    <div className="site-shell">
      <header className="site-header">
        <Link className="brand" href="#start" aria-label="BlechRegen – Startseite">
          {logoURL ? (
            <Image alt="" className="brand-logo" height={58} src={logoURL} unoptimized width={58} />
          ) : (
            <Image alt="" className="brand-logo" height={58} src="/images/blechregen-logo.jpg" width={58} />
          )}
          <span>
            <strong>{settings.siteName || 'BlechRegen'}</strong>
            <small>{settings.tagline || 'Von Bayern bis Bogotá'}</small>
          </span>
        </Link>

        <nav className="navigation" aria-label="Hauptnavigation">
          <a href="#ueber-uns">Über uns</a>
          <a href="#musik">Unsere Musik</a>
          <a href="#termine">Termine</a>
          <a className="nav-booking" href="#kontakt">Anfragen</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="start">
          <div className="hero-copy">
            <p className="kicker">{home.hero.eyebrow}</p>
            <h1>{home.hero.headline}</h1>
            <p className="hero-intro">{home.hero.text}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#termine">
                {home.hero.primaryButtonLabel || 'Nächste Termine'}
              </a>
              <a className="button button-secondary" href="#kontakt">
                {home.hero.secondaryButtonLabel || 'BlechRegen anfragen'}
              </a>
            </div>
          </div>
          <div className="hero-photo">
            <Image
              alt={mediaAlt(home.hero.image)}
              fill
              priority
              sizes="(max-width: 820px) 100vw, 55vw"
              src={mediaURL(home.hero.image)}
              unoptimized
            />
          </div>
        </section>

        <section className="about section" id="ueber-uns">
          <div className="section-heading">
            <p className="kicker">{home.about.kicker}</p>
            <h2>{home.about.headline}</h2>
          </div>
          <div className="about-body">
            <RichText className="rich-text" data={home.about.text} />
            {home.about.quote && <blockquote>{home.about.quote}</blockquote>}
          </div>
        </section>

        <section className="music" id="musik">
          <div className="music-inner section">
            <div className="music-heading">
              <p className="kicker">{home.music.kicker}</p>
              <h2>{home.music.headline}</h2>
              {home.music.text && <p>{home.music.text}</p>}
            </div>
            <div className="feature-list">
              {features.map((feature, index) => (
                <article key={`${feature.title}-${index}`}>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="events section" id="termine">
          <div className="section-heading events-heading">
            <div>
              <p className="kicker">{home.events.kicker}</p>
              <h2>{home.events.headline}</h2>
            </div>
            <p>Kommt vorbei, hört zu und trinkt etwas mit uns.</p>
          </div>

          {eventResult.docs.length ? (
            <div className="event-list">
              {eventResult.docs.map((event) => {
                const date = new Date(event.startDate)
                return (
                  <article className="event" key={event.id}>
                    <time dateTime={event.startDate}>{dateFormatter.format(date)}</time>
                    <div>
                      <h3>{event.title}</h3>
                      <p>{eventLocation(event)} · {timeFormatter.format(date)} Uhr</p>
                    </div>
                    {event.externalLink && (
                      <a href={event.externalLink} rel="noreferrer" target="_blank">Mehr erfahren ↗</a>
                    )}
                  </article>
                )
              })}
            </div>
          ) : (
            <div className="empty-events">
              <h3>{home.events.emptyHeadline || 'Neue Termine folgen.'}</h3>
              <p>{home.events.emptyText || 'Bis dahin sind wir für eure Veranstaltung direkt erreichbar.'}</p>
              <a href="#kontakt">Termin anfragen →</a>
            </div>
          )}
        </section>

        <section className="booking" id="kontakt">
          <div className="booking-inner">
            <p className="kicker">{home.booking.kicker}</p>
            <h2>{home.booking.headline}</h2>
            <p>{home.booking.text}</p>
            <a className="button button-light" href={`mailto:${email}`}>
              {home.booking.buttonLabel || 'Unverbindlich anfragen'}
            </a>
            <div className="contact-details">
              <a href={`mailto:${email}`}>{email}</a>
              <span aria-hidden="true">·</span>
              <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>{settings.siteName || 'BlechRegen'}</strong>
          <span>Blasmusik aus Regensburg</span>
        </div>
        <nav aria-label="Fußnavigation">
          <a href={instagram} rel="noreferrer" target="_blank">Instagram ↗</a>
          <a href="https://blechregen.de/impressum" rel="noreferrer" target="_blank">Impressum ↗</a>
          <a href="https://blechregen.de/datenschutzerklarung" rel="noreferrer" target="_blank">Datenschutz ↗</a>
          <Link href="/admin">Redaktion</Link>
        </nav>
        <small>© {new Date().getFullYear()} BlechRegen</small>
      </footer>
    </div>
  )
}
