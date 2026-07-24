import { PageHero } from '../components/SiteChrome'
import { dateLong, eventPlace, getSiteData, timeShort } from '../lib/data'

export const metadata = { title: 'Termine | BlechRegen', description: 'Alle kommenden öffentlichen Auftritte von BlechRegen aus Regensburg.' }
export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  const { payload } = await getSiteData()
  const events = await payload.find({ collection: 'events', depth: 1, limit: 100, overrideAccess: false, sort: 'startDate', where: { startDate: { greater_than_equal: new Date().toISOString() } } })
  return <main><PageHero eyebrow="BlechRegen live" title="Nächster Halt: vielleicht bei euch." intro="Kommt vorbei, hört zu und trinkt etwas mit uns. Hier findet ihr alle öffentlichen Termine." />
    <section className="events-page section-wrap"><div className="events-meta"><p>{events.totalDocs} kommende {events.totalDocs === 1 ? 'Termin' : 'Termine'}</p><span>Stand {new Intl.DateTimeFormat('de-DE').format(new Date())}</span></div>{events.docs.length ? <div className="event-list">{events.docs.map((event, index) => { const date = new Date(event.startDate); return <article key={event.id}><span className="event-index">{String(index + 1).padStart(2, '0')}</span><time dateTime={event.startDate}><b>{dateLong.format(date)}</b><span>{timeShort.format(date)} Uhr</span></time><div><h2>{event.title}</h2><p>{eventPlace(event)}</p></div>{event.externalLink && <a href={event.externalLink} rel="noreferrer" target="_blank">Details ↗</a>}</article>})}</div> : <div className="empty-state"><span>♪</span><h2>Noch ist es hier ruhig.</h2><p>Neue öffentliche Termine folgen. Oder sorgt einfach selbst für den nächsten.</p><a className="button button-accent" href="/booking">BlechRegen anfragen</a></div>}</section>
  </main>
}
