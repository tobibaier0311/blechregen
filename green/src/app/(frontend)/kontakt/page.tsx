import Link from 'next/link'
import { PageHero } from '../components/SiteChrome'
import { getSiteData } from '../lib/data'

export const metadata = { title: 'Kontakt | BlechRegen' }

export default async function ContactPage() {
  const { settings } = await getSiteData()
  const email = settings.contact?.email || 'blechregen@gmail.com'
  return <main><PageHero title="Kontakt" intro="Hier erreicht ihr BlechRegen."/><section className="green-section"><div className="concept-container"><p><a className="green-email" href={`mailto:${email}`}>{email}</a></p><Link className="concept-button concept-button-dark" href="/booking">Auftritt anfragen</Link></div></section></main>
}
