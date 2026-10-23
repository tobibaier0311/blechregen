import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import { SoundMixer } from './components/SoundMixer'
import { dateShort, eventPlace, getSiteData } from './lib/data'

export const dynamic = 'force-dynamic'

const fallbackInstruments = ['Flügelhorn', 'Flügelhorn', 'Trompete', 'Tenorhorn', 'Bariton', 'Tuba', 'Schlagzeug']

function HornArtwork() {
  return <svg className="concept-horn" viewBox="0 0 600 460" aria-hidden="true"><g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M61 256C36 244 30 210 51 189c15-15 43-14 64 5" stroke="#15382e" strokeWidth="50"/><path d="M61 256C36 244 30 210 51 189c15-15 43-14 64 5" stroke="#f6cc54" strokeWidth="34"/>
    <path d="M102 193c65-18 127-10 191-10h162c18 0 27-13 35-33" stroke="#14382d" strokeWidth="47"/><path d="M102 193c65-18 127-10 191-10h162c18 0 27-13 35-33" stroke="#ffda69" strokeWidth="34"/>
    <path d="M123 235c80 4 167 11 241 11h92c28 1 48-17 53-49" stroke="#15382e" strokeWidth="42"/><path d="M123 235c80 4 167 11 241 11h92c28 1 48-17 53-49" stroke="#eeb33c" strokeWidth="29"/>
    <path d="M232 181v-62m63 62v-69m63 69v-59" stroke="#16382d" strokeWidth="28"/><path d="M232 181v-62m63 62v-69m63 69v-59" stroke="#ffd66b" strokeWidth="18"/><path d="M218 114h29m33-7h30m34 9h29" stroke="#fff3bc" strokeWidth="11"/>
    <path d="M140 238c9 61 75 102 124 80 17-10 25-25 27-69" stroke="#13352d" strokeWidth="40"/><path d="M140 238c9 61 75 102 124 80 17-10 25-25 27-69" stroke="#f6c652" strokeWidth="28"/>
    <path d="M452 182c47-1 74-16 107-43l21 166c-52-39-87-58-128-58z" fill="#f8d55f" stroke="#193e34" strokeWidth="11"/><ellipse cx="570" cy="222" rx="31" ry="90" fill="#e99048" stroke="#193e34" strokeWidth="12" transform="rotate(-7 570 222)"/><ellipse cx="571" cy="220" rx="16" ry="67" fill="#fad76b" stroke="none" transform="rotate(-7 571 220)"/>
  </g></svg>
}

export default async function Home() {
  const { home, payload } = await getSiteData()
  const [events, musicians] = await Promise.all([
    payload.find({ collection: 'events', depth: 1, limit: 3, overrideAccess: false, sort: 'startDate', where: { startDate: { greater_than_equal: new Date().toISOString() } } }),
    payload.find({ collection: 'musicians', depth: 1, limit: 7, overrideAccess: false, sort: 'order' }),
  ])
  const people = musicians.docs.length ? musicians.docs : fallbackInstruments.map((instrument, index) => ({ id: String(index), instrument, name: `Musiker ${index + 1}` }))

  return <main>
    <section className="concept-hero" id="start"><div className="concept-container concept-hero-inner">
      <div className="concept-meta"><span>Sieben Musikanten <b>✳</b> 100 % Blech <b>✳</b> ordentlich Rhythmus</span><span>Aus Bayern. Mit Temperament.</span></div>
      <div className="concept-hero-grid"><div className="concept-hero-copy"><h1><span>Blech</span><em>Regen</em></h1><h2>Wenn die Polka <strong>Salsa tanzt.</strong></h2><p>{home.hero.text}</p><div className="concept-actions"><Link className="concept-button concept-button-sun" href="/musik">Entdeckt unseren Sound <b>↗</b></Link><Link className="concept-text-link" href="/band">Lernt uns kennen ↓</Link></div></div><div className="concept-art"><div className="concept-sun"/><HornArtwork/><div className="concept-sticker">O&apos;ZAPFT IS!<small>¡VAMOS!</small></div></div></div>
    </div></section>
    <div className="concept-ticker" aria-hidden="true"><div><span>POLKA ✳ SALSA ✳ CUMBIA ✳ BÖHMISCH ✳ RUMBA ✳ BLECHREGEN ✳</span><span>POLKA ✳ SALSA ✳ CUMBIA ✳ BÖHMISCH ✳ RUMBA ✳ BLECHREGEN ✳</span></div></div>
    <section className="concept-section concept-story"><div className="concept-container concept-story-grid"><div className="concept-poster" aria-hidden="true"><div><span>EST. 2025</span><span>BRASS × LATIN</span></div><strong>OANS<br/>ZWOA<br/>HEY!</strong><em>Biergarten<br/>meets Bogotá.</em><footer><span>BlechRegen</span><span>✳ LIVE & LAUT ✳</span></footer></div><div><p className="concept-eyebrow">01 / Unsere Geschichte</p><h2 className="concept-heading">Erst a Maß.<br/>Dann a <em>Idee.</em></h2><p className="concept-lead">Manche Bands gründen sich im Proberaum. Wir beim Bockbieranstich.</p><RichText className="concept-richtext" data={home.about.text}/><div className="concept-facts"><div><b>07</b><span>Musikanten</span></div><div><b>2025</b><span>Gründungsjahr</span></div><div><b>∞</b><span>Rhythmusideen</span></div></div></div></div></section>
    <section className="concept-section concept-sound"><div className="concept-container"><div className="concept-section-head"><div><p className="concept-eyebrow">02 / Unser Sound</p><h2 className="concept-heading">Drei Welten.<br/>Ein <em>Blech.</em></h2></div><p>Altbekannt, neu gedacht und immer mit ordentlich Schub. So klingt unser musikalischer Mischmasch.</p></div><div className="concept-genres"><article><span>01 / DIE WURZELN</span><i>🍺</i><h3>Servus,<br/>Polka!</h3><p>Bayerisch-böhmische Klassiker – ehrlich, gemütlich und mit Herz.</p></article><article><span>02 / DER PULS</span><i>☀️</i><h3>Hola,<br/>Ritmo!</h3><p>Salsa, Cumbia und Rumba: lateinamerikanische Rhythmen fürs Bläserherz.</p></article><article><span>03 / DAS EXPERIMENT</span><i>⚡</i><h3>Alles<br/>erlaubt.</h3><p>Moderne Songs, eigene Arrangements und alles, was uns gerade packt.</p></article></div><SoundMixer/></div></section>
    <section className="concept-section concept-band"><div className="concept-container"><div className="concept-section-head"><div><p className="concept-eyebrow">03 / Die Bande</p><h2 className="concept-heading">Sieben Köpfe.<br/>Ein <em>Groove.</em></h2></div><p>Sieben Charaktere, sieben Instrumente und ungefähr sieben Meinungen zum richtigen Tempo.</p></div><div className="concept-members">{people.map((person, index) => <article key={person.id}><div><span>BR / {String(index + 1).padStart(2, '0')}</span><span>✳</span></div><strong aria-hidden="true">{['♩','♪','♫','♬','♩','♪','♫'][index]}</strong><h3>{person.name}</h3><p>{person.instrument}</p></article>)}</div><Link className="concept-underlink" href="/band">Alle Bandmitglieder kennenlernen <span>↗</span></Link></div></section>
    <section className="concept-live"><div className="concept-container concept-live-grid"><div><p className="concept-eyebrow">04 / Live</p><h2 className="concept-heading">Biergarten?<br/>Festl?<br/>¡Vamos!</h2><p>Kommt vorbei, hört zu und trinkt etwas mit uns. Hier findet ihr die nächsten öffentlichen Termine.</p><Link className="concept-button concept-button-light" href="/termine">Alle Termine <b>↗</b></Link></div><div className="concept-events">{events.docs.length ? events.docs.map((event, index) => { const date = new Date(event.startDate); return <article key={event.id}><span>0{index + 1}</span><time dateTime={event.startDate}>{dateShort.format(date)}</time><div><h3>{event.title}</h3><p>{eventPlace(event)}</p></div>{event.externalLink ? <a href={event.externalLink} rel="noreferrer" target="_blank">↗</a> : <b>→</b>}</article> }) : <div className="concept-empty"><span>DER NÄCHSTE GIG?</span><strong>VIELLEICHT<br/>BEI DIR.</strong><p>Sieben Musiker · viel Spielfreude · 100 % live</p></div>}</div></div></section>
    <section className="concept-booking"><div className="concept-container"><p className="concept-eyebrow">05 / Booking</p><h2 className="concept-heading">Du hast die Bühne.<br/><em>Wir das Blech.</em></h2><p>Ob Serenade, Sommerfest, Geburtstag oder Biergarten: Erzählt uns, was ihr plant.</p><Link className="concept-button concept-button-dark" href="/booking">Unverbindlich anfragen <b>↗</b></Link></div></section>
  </main>
}
