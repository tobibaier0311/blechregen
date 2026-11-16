import Link from 'next/link'
import Image from 'next/image'
import type { Musician } from '@/payload-types'
import { SoundMixer } from './SoundMixer'
import { EventList } from './EventList'

const instruments = ['Flügelhorn', 'Flügelhorn', 'Trompete', 'Tenorhorn', 'Bariton', 'Tuba', 'Schlagzeug']

export function HomeSections({ musicians }: { musicians: Musician[] }) {
  const people = musicians.length ? musicians : instruments.map((instrument, index) => ({ id: `instrument-${index}`, name: '', instrument, portrait: null }))
  return <>
    <section className="concept-section concept-story" id="geschichte">
      <div className="concept-container concept-story-grid">
        <div className="concept-poster home-story-poster" aria-hidden="true"><strong>Oans<br/>Zwoa<br/>Hey!</strong><em>Biergarten<br/>meets Bogotá.</em></div>
        <div><h2 className="concept-heading">Erst a Maß.<br/>Dann a <em>Idee.</em></h2><p className="concept-lead">Manche Bands gründen sich im Proberaum. Wir beim Bockbieranstich.</p><p className="concept-richtext">Von einer Kolumbienreise sind uns Salsa und Cumbia geblieben. Die verbinden wir mit bayerisch-böhmischer Blasmusik.</p><Link className="concept-underlink" href="/band">Mehr über die Kapelle</Link></div>
      </div>
    </section>

    <section className="concept-section concept-sound" id="musik">
      <div className="concept-container">
        <div className="concept-section-head"><h2 className="concept-heading">Drei Welten.<br/>Ein <em>Blech.</em></h2><p>Bayerisch-böhmische Blasmusik, lateinamerikanische Rhythmen und eigene Arrangements.</p></div>
        <div className="concept-genres">
          <article><span>Die Wurzeln</span><i aria-hidden="true">🍺</i><h3>Servus,<br/>Polka!</h3><p>Bayerisch-böhmische Klassiker – ehrlich, gemütlich und mit Herz.</p></article>
          <article><span>Der Puls</span><i aria-hidden="true">☀️</i><h3>Hola,<br/>Ritmo!</h3><p>Salsa, Cumbia und Rumba: lateinamerikanische Rhythmen fürs Bläserherz.</p></article>
          <article><span>Das Experiment</span><i aria-hidden="true">⚡</i><h3>Alles<br/>erlaubt.</h3><p>Moderne Songs, eigene Arrangements und alles, was uns gerade packt.</p></article>
        </div>
        <SoundMixer />
      </div>
    </section>

    <section className="concept-section concept-band" id="kapelle">
      <div className="concept-container">
        <div className="concept-section-head"><h2 className="concept-heading">Sieben Köpfe.<br/>Ein <em>Groove.</em></h2><p>Zwei Flügelhörner, Trompete, Tenorhorn, Bariton, Tuba und Schlagzeug.</p></div>
        <div className="concept-members home-members">{people.map((person, index) => <article key={person.id}>
          {person.portrait && typeof person.portrait === 'object' && person.portrait.url ? <Image className="home-member-photo" src={person.portrait.url} alt={person.name} width={400} height={400} unoptimized /> : <strong aria-hidden="true">{['♩', '♪', '♫', '♬', '♩', '♪', '♫'][index % 7]}</strong>}
          <h3>{person.name || person.instrument}</h3>{person.name && <p>{person.instrument}</p>}
        </article>)}</div>
        <Link className="concept-underlink" href="/band/#besetzung">Mehr über die Besetzung</Link>
      </div>
    </section>

    <section className="concept-live" id="termine">
      <div className="concept-container concept-live-grid">
        <div><h2 className="concept-heading">Biergarten?<br/>Festl?<br/>¡Vamos!</h2><p>Hier findet ihr unsere nächsten öffentlichen Auftritte.</p><Link className="concept-button concept-button-light" href="/termine">Alle Termine</Link></div>
        <div className="concept-events home-live-events"><EventList limit={3} compact/></div>
      </div>
    </section>

    <section className="concept-booking" id="booking">
      <div className="concept-container"><h2 className="concept-heading">Du hast die Bühne.<br/><em>Wir das Blech.</em></h2><p>Ob Serenade, Sommerfest, Geburtstag oder Biergarten: Erzählt uns, was ihr plant.</p><Link className="concept-button concept-button-dark" href="/booking">Unverbindlich anfragen</Link></div>
    </section>
  </>
}
