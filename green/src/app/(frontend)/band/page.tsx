import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { PageHero } from '../components/SiteChrome'
import { SoundMixer } from '../components/SoundMixer'
import { getSiteData } from '../lib/data'

export const metadata = { title: 'Band & Musik | BlechRegen', description: 'Die Kapelle aus Regensburg, ihre Besetzung und ihre Musik: bayerisch-böhmische Blasmusik, Salsa und Cumbia.' }

export default async function BandPage() {
  const { home, payload } = await getSiteData()
  const musicians = await payload.find({ collection: 'musicians', limit: 20, sort: 'order' })
  return <main>
    <PageHero title="Band & Musik" intro="Sieben Musikanten aus Regensburg. Bayerisch-böhmische Blasmusik mit Salsa und Cumbia." />
    <section className="green-section"><div className="concept-container green-intro">
      <figure className="green-band-photo"><Image src="/images/blechregen-band.jpg" alt="Die Kapelle BlechRegen mit ihren Instrumenten" width={1324} height={1133} sizes="(max-width: 760px) 100vw, 48vw" priority /></figure>
      <div><h2 className="green-heading">Die Kapelle</h2><RichText className="green-prose" data={home.about.text}/></div>
    </div></section>
    <section className="green-section green-section-dark" id="musik"><div className="concept-container">
      <h2 className="green-heading">Unsere Musik</h2>
      <div className="green-sound-flow"><article><h3>Polka, Walzer und Märsche</h3><p>Wir spielen traditionelle bayerisch-böhmische Blasmusik.</p></article><article><h3>Salsa, Cumbia und Rumba</h3><p>Von einer Kolumbienreise sind uns die Rhythmen geblieben. Die bringen wir mit unseren Blasinstrumenten zusammen.</p></article><article><h3>Eigene Arrangements</h3><p>Auch moderne Songs und eigene Bearbeitungen gehören zu unserer Musik.</p></article></div>
      <SoundMixer />
    </div></section>
    <section className="green-section" id="besetzung"><div className="concept-container green-section-split"><h2 className="green-heading">Die Besetzung</h2><div><p>Zwei Flügelhörner, Trompete, Tenorhorn, Bariton, Tuba und Schlagzeug.</p>{musicians.docs.length > 0 && <div className="green-musicians">{musicians.docs.map(person => <article key={person.id}>{person.portrait && typeof person.portrait === 'object' && person.portrait.url && <Image src={person.portrait.url} alt={person.name} width={300} height={300} unoptimized />}<h3>{person.name}</h3><p>{person.instrument}</p>{person.bio && <RichText data={person.bio}/>}</article>)}</div>}</div></div></section>
  </main>
}
