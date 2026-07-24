import Link from 'next/link'
import { PageHero } from '../components/SiteChrome'
import { getSiteData } from '../lib/data'

export const metadata = { title: 'Unsere Musik | BlechRegen', description: 'Bayerisch-böhmische Blasmusik mit Cumbia, Latin und kolumbianischem Einschlag.' }

export default async function MusicPage() {
  const { home } = await getSiteData()
  const features = home.music.features?.length ? home.music.features : []
  return <main><PageHero eyebrow="Nicht Humtata. Nicht Salsa. Irgendwo dazwischen." title="So klingt Fernweh auf sieben Instrumenten." intro={home.music.text || 'Klassische Blasmusik, heiße Rhythmen und Arrangements, die man nicht an jeder Ecke hört.'} tone="yellow" />
    <section className="music-tracks section-wrap">{features.map((feature, index) => <article key={feature.id || index}><span>0{index + 1}</span><div><p className="eyebrow">Klangfarbe</p><h2>{feature.title}</h2><p>{feature.text}</p></div><div className="track-mark" aria-hidden="true">{index === 0 ? '♩' : index === 1 ? '♪' : '♬'}</div></article>)}</section>
    <section className="music-stage"><div><p className="eyebrow">Für fast jede Bühne</p><h2>Klein besetzt.<br /><em>Groß im Klang.</em></h2></div><div><p>Ob Frühschoppen, Biergarten, Hochzeit oder Vereinsfest: Als klassische Siebenerbesetzung brauchen wir keine riesige Bühne, bringen aber genug Energie für einen ganzen Platz mit.</p><Link className="button button-accent" href="/booking">Für euren Anlass anfragen</Link></div></section>
  </main>
}
