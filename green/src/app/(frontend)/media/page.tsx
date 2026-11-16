import Image from 'next/image'
import { PageHero } from '../components/SiteChrome'
import { getSiteData } from '../lib/data'

export const metadata = { title: 'Media | BlechRegen', description: 'Fotos, Videos und Musikmitschnitte von BlechRegen.' }

export default async function MediaPage() {
  const { payload } = await getSiteData()
  const galleries = await payload.find({ collection: 'galleries', depth: 2, limit: 20, sort: '-eventDate' })
  return <main><PageHero title="Media" intro="Fotos, Videos und Musikmitschnitte."/>
    <section className="green-section"><div className="concept-container"><h2 className="green-heading">Fotos</h2><div className="green-gallery"><figure><Image src="/images/blechregen-band.jpg" alt="Die sieben Musiker von BlechRegen mit ihren Instrumenten" width={1324} height={1133} sizes="(max-width: 760px) 100vw, 800px" priority/></figure>{galleries.docs.flatMap(gallery => (gallery.images || []).map(entry => { const image = entry.image; return image && typeof image === 'object' && image.url ? <figure key={entry.id || image.id}><Image src={image.url} alt={image.alt || 'BlechRegen'} width={image.width || 1200} height={image.height || 800} unoptimized/></figure> : null }))}</div></div></section>
    <section className="green-section green-section-dark"><div className="concept-container green-section-split"><h2 className="green-heading">Videos</h2><p>Hier sind noch keine Videomitschnitte veröffentlicht.</p></div></section>
    <section className="green-section"><div className="concept-container green-section-split"><h2 className="green-heading">Audio</h2><p>Hier sind noch keine Audioaufnahmen veröffentlicht.</p></div></section>
  </main>
}
