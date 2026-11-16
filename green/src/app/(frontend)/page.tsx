import Link from 'next/link'
import Image from 'next/image'
import { GenreTicker } from './components/GenreTicker'
import { SoundMixer } from './components/SoundMixer'
import { EventList } from './components/EventList'
import { getSiteData } from './lib/data'

export default async function Home() {
  const { home, payload } = await getSiteData()
  const musicians = await payload.find({ collection: 'musicians', limit: 7, sort: 'order' })
  return <main>
    <section className="concept-hero">
      <div className="concept-container concept-hero-inner">
        <div className="concept-hero-grid">
          <div className="concept-hero-copy">
            <h1 className="green-hero-title"><span>Wenn die</span><span>Polka</span><strong>Salsa tanzt</strong></h1>
            <p>{home.hero.text}</p>
            <div className="concept-actions"><Link className="concept-button concept-button-sun" href="/band">Band & Musik</Link><Link className="concept-text-link" href="/booking">Buch uns</Link></div>
          </div>
          <div className="green-hero-logo-stage"><Image className="green-hero-logo" src="/images/BlechRegen%20Logo%20Transparent.png" alt="BlechRegen Logo mit goldener Trompete" width={984} height={1040} sizes="(max-width: 900px) 320px, 480px" priority /></div>
        </div>
      </div>
    </section>
    <GenreTicker />
    <section className="green-section" id="geschichte">
      <div className="concept-container green-intro green-story">
        <div className="green-story-poster" aria-hidden="true"><strong>Oans<br/>Zwoa<br/>Hey!</strong></div>
        <div><h2 className="green-heading">Erst a Maß.<br/>Dann a Idee.</h2><p>Manche Bands gründen sich im Proberaum. Wir beim Bockbieranstich.</p><p>Von einer Kolumbienreise sind uns Salsa und Cumbia geblieben. Die verbinden wir mit bayerisch-böhmischer Blasmusik.</p><Link className="concept-underlink" href="/band">Mehr über die Kapelle</Link></div>
      </div>
    </section>
    <section className="green-section green-section-dark" id="musik">
      <div className="concept-container"><h2 className="green-heading">Unsere Musik</h2>
        <div className="green-sound-flow"><article><h3>Polka, Walzer und Märsche</h3><p>Wir spielen traditionelle bayerisch-böhmische Blasmusik.</p></article><article><h3>Salsa, Cumbia und Rumba</h3><p>Lateinamerikanische Rhythmen, gespielt mit unseren Blasinstrumenten.</p></article><article><h3>Eigene Arrangements</h3><p>Auch moderne Songs und eigene Bearbeitungen gehören zu unserer Musik.</p></article></div>
        <SoundMixer />
      </div>
    </section>
    <section className="green-section" id="kapelle"><div className="concept-container green-section-split"><h2 className="green-heading">Die Kapelle</h2><div><p>Wir sind sieben Musikanten aus Regensburg. Unsere Besetzung: zwei Flügelhörner, Trompete, Tenorhorn, Bariton, Tuba und Schlagzeug.</p>{musicians.docs.length > 0 && <div className="green-musicians">{musicians.docs.map(person => <article key={person.id}><h3>{person.name}</h3><p>{person.instrument}</p></article>)}</div>}<Link className="concept-underlink" href="/band/#besetzung">Mehr über die Besetzung</Link></div></div></section>
    <section className="green-section green-section-dark" id="termine">
      <div className="concept-container green-section-split"><div><h2 className="green-heading">Termine</h2><p>Hier findet ihr unsere öffentlichen Auftritte.</p></div><div><EventList limit={3} compact/><Link className="concept-underlink" href="/termine">Alle Termine</Link></div></div>
    </section>
    <section className="green-section green-section-sun" id="booking"><div className="concept-container green-section-split"><h2 className="green-heading">Buch uns</h2><div><p>Für Serenade, Sommerfest, Geburtstag oder Biergarten: Schreibt uns den Anlass, den Ort und euren Wunschtermin.</p><Link className="concept-button concept-button-dark" href="/booking">Anfrage vorbereiten</Link></div></div></section>
  </main>
}
