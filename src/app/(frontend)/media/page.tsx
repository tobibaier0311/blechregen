import Image from 'next/image'
import { PageHero } from '../components/SiteChrome'
import { getSiteData } from '../lib/data'

export const metadata = { title: 'Media | BlechRegen', description: 'Fotos und Eindrücke von BlechRegen live und unterwegs.' }
export const dynamic = 'force-dynamic'

export default async function MediaPage() {
  const { payload } = await getSiteData()
  const galleries = await payload.find({ collection: 'galleries', depth: 2, limit: 20, overrideAccess: false, sort: '-eventDate' })
  const galleryImages = galleries.docs.flatMap(g => g.images?.map(entry => entry.image).filter(image => image && typeof image === 'object' && image.url) || [])
  return <main><PageHero eyebrow="Bilder sagen mehr als sieben Musiker" title="Live. Laut. Und meistens gut angezogen." intro="Eindrücke aus Biergärten, von Bühnen und von überall dort, wo BlechRegen niedergeht." tone="coral" />
    <section className="media-grid section-wrap">{galleryImages.length ? galleryImages.map((image, index) => typeof image === 'object' && image.url && <figure key={image.id} className={`media-${index % 5}`}><Image alt={image.alt} fill sizes="(max-width: 700px) 100vw, 50vw" src={image.url} unoptimized /></figure>) : <><figure className="media-0"><Image alt="BlechRegen als siebenköpfige Besetzung" fill src="/images/blechregen-live.jpg" /></figure><div className="media-callout"><span>Mehr folgt</span><h2>Die Galerie wartet auf euren nächsten Auftritt.</h2><p>Fotos und Galerien lassen sich im Payload-CMS veröffentlichen.</p></div></>}</section>
  </main>
}
