import Link from 'next/link'
import { PageHero } from '../components/SiteChrome'

export const metadata = { title: 'Unsere Musik | BlechRegen', robots: { index: false } }

// Alte Adresse bleibt erreichbar; Inhalte werden nur auf der gemeinsamen Seite gepflegt.
export default function MusicPage() {
  return <main><PageHero title="Unsere Musik" intro="Musik und Kapelle stellen wir jetzt gemeinsam vor."/><section className="green-section"><div className="concept-container"><Link className="concept-button concept-button-dark" href="/band/#musik">Zu Band & Musik</Link></div></section></main>
}
