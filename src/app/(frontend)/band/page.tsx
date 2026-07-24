import { RichText } from '@payloadcms/richtext-lexical/react'
import Image from 'next/image'
import { PageHero } from '../components/SiteChrome'
import { getSiteData } from '../lib/data'

export const metadata = { title: 'Die Band | BlechRegen', description: 'Sieben Musiker aus Regensburg zwischen bayerischer Blasmusik und kolumbianischem Fernweh.' }
export const dynamic = 'force-dynamic'

const instruments = ['Flügelhorn', 'Flügelhorn', 'Trompete', 'Tenorhorn', 'Bariton', 'Tuba', 'Schlagzeug']

export default async function BandPage() {
  const { home, payload } = await getSiteData()
  const musicians = await payload.find({ collection: 'musicians', depth: 1, limit: 20, overrideAccess: false, sort: 'order' })
  return <main>
    <PageHero eyebrow="Die sieben von BlechRegen" title="Sieben Köpfe. Eine Idee. Viel Blech." intro="Was bei einem Bockbier begann, ist heute eine kleine Besetzung mit großem Klang und einer ziemlich weiten musikalischen Reiseroute." tone="coral" />
    <section className="story section-wrap content-grid"><p className="eyebrow">Unsere Geschichte</p><div><h2>Von Regensburg<br />Richtung Bogotá.</h2><RichText className="rich-text" data={home.about.text} />{home.about.quote && <blockquote>„{home.about.quote}“</blockquote>}</div></section>
    <section className="band-photo section-wrap"><Image alt="Die sieben Musiker von BlechRegen" height={900} src="/images/blechregen-live.jpg" width={1600} /><span>Regensburg · Bayern</span></section>
    <section className="members section-wrap"><div className="section-title"><div><p className="eyebrow">Besetzung</p><h2>Die Menschen<br /><em>hinterm Blech.</em></h2></div><p>Sieben Charaktere, sieben Instrumente und ungefähr sieben Meinungen zum richtigen Tempo.</p></div><div className="member-grid">{musicians.docs.length ? musicians.docs.map((person, index) => <article key={person.id}>{person.portrait && typeof person.portrait === 'object' && person.portrait.url ? <Image alt={person.name} fill src={person.portrait.url} unoptimized /> : <div className="member-placeholder">0{index + 1}</div>}<div><span>{person.instrument}</span><h3>{person.name}</h3>{person.bio && <RichText data={person.bio} />}</div></article>) : instruments.map((instrument, index) => <article key={instrument + index}><div className="member-placeholder">0{index + 1}</div><div><span>{instrument}</span><h3>Musiker {index + 1}</h3><p>Porträt und persönliche Zeile können direkt im CMS ergänzt werden.</p></div></article>)}</div></section>
  </main>
}
